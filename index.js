// inside index.js

require('dotenv').config();


// const PORT = 3000;

const { PORT = 3000 } = process.env;
const express = require('express');
const server = express();


//below lines unsure 

server.use(express.json())

const morgan = require('morgan');
server.use(morgan('dev'));
//above lines need to go in server? double check on this placement



const { client } = require('./db');
client.connect();


server.get('/background/:color', (req, res, next) => {
    res.send(`
      <body style="background: ${ req.params.color };">
        <h1>Hello World</h1>
      </body>
    `);
  });

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});

