// api/index.js
const express = require('express');
const apiRouter = express.Router();

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);


//last section of part 1 added below
async function getAllTags() {
    const {} = await client.query(`SELECT * FROM tags;`);
    return tags;
  
  }

  

const postsRouter = require('./posts');
apiRouter.use('/posts', postsRouter);



module.exports = {
    apiRouter,
    getAllTags}
    ;
