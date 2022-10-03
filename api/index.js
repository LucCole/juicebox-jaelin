// api/index.js

// Before we start attaching our routers
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;

const express = require('express');
const apiRouter = express.Router();




// JWT middware above here

apiRouter.use((req, res, next) => {
    if (req.user) {
      console.log("User is set:", req.user);
    }
  
    next();
  });
  
  // Routers below here
  

//this section of code may go in main index.js
const server = express();
server.use(express.json());


const morgan = require('morgan');
server.use(morgan('dev'));
//above lines need to go in server? double check on this placement


//above lines need to go in server? double check on this placement
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);




// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
  
    if (!auth) { // nothing to see here
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
  
        if (id) {
          req.user = await getUserById(id);
          next();
        }
      } catch ({ name, message }) {
        next({ name, message });
      }
    } else {
      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${ prefix }`
      });
    }
  });

// const express = require('express');
// const apiRouter = express.Router();

// const usersRouter = require('./users');
// apiRouter.use('/users', usersRouter);




const postsRouter = require('./posts');
apiRouter.use('/posts', postsRouter);


//last section of part 1 added below
async function getAllTags() {
    const {} = await client.query(`SELECT * FROM tags;`);
    return tags;
  
  }
//make sure above is in correct position
  



apiRouter.use((error, req, res, next) => {
    res.send({
      name: error.name,
      message: error.message
    });
  });
  

module.exports = apiRouter;
module.exports = {
    getAllTags} ;

