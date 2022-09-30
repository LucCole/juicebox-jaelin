// api/users.js
const express = require('express');
const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next(); // THIS IS DIFFERENT
});
//this middleware fires whenever get request is made to api/suers 
//sends back simple object with empty array



//below gets users from the database and sends them back
const {getAllUsers} = require('../db');

usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();
  
    res.send({
      users
    });
  });

module.exports = usersRouter;