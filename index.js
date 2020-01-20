// implement your API here 
const express = require('express');
const db = require('./data/db.js')

const server = express()

server.listen(4000, () => {
  console.log('*** listening on port 4000')
});





/* 
CRUD
C - CREATE - post
R - READ - get
U - UPDATE - put
D - DELETE - delete

*/

/*-----------------------------------------------------------------------------------------
 retrieve info from the db
----------------------------------------------------------------------------------------- */

server.use(express.json());
server.get('/api/users', (req, res) => {
  db.find()
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "The users information could not be retrieved.", err })
    });
})

/*-----------------------------------------------------------------------------------------
 add a record to the db
----------------------------------------------------------------------------------------- */
server.post('/api/users', (req, res) => {
  const userInfo = req.body;
  if (!userInfo.name || !userInfo.bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  }
  db.insert(userInfo)
    .then(id => {
      console.log(id)
      db.findById(id.id)
        .then(users => {
          console.log(users)
          res.status(201).json({ success: true, users })
        })
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "There was an error while saving the user to the database", err })
    });
})


/* -----------------------------------------------------------------------------------------
 delete records
----------------------------------------------------------------------------------------- */
server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist.", deleted })
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "The user could not be removed", err })
    })
})

/* -----------------------------------------------------------------------------------------
 modify a record in the db
----------------------------------------------------------------------------------------- */
server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db.update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist.", updated })
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "The user information could not be modified.", err })
    })
})

