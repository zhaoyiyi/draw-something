"use strict";
let path = require('path');
let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/app', express.static(__dirname + '/client/app'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});


let users = 0;
io.on('connection', (socket) => {
  console.log('a user connected');
  users++;
  io.emit('test', users);

  socket.on('drawing', (mousePos) => {
    console.log(mousePos);
    socket.broadcast.emit('drawing', mousePos);
  });

  socket.on('disconnect', () => {
    users--;
    console.log('one user left');
    io.emit('test', users);
  });
});

server.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});