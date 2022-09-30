// inside index.js
const PORT = 3000;
const express = require('express');
const server = express();


//below lines unsure 
const morgan = require('morgan');
server.use(morgan('dev'));
//above lines need to go in server? double check on this placement

server.use(express.json())

const apiRouter = require('./api');
server.use('/api', apiRouter);

const { client } = require('./db');
client.connect();


server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});