"use strict";
let paper = require('paper');
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
let canvas = paper.setup(new paper.Canvas(500, 500));
let path;

io.on('connection', (socket) => {
  users++;
  io.emit('test', users);
  io.emit('project:load', canvas.project.exportJSON());

  socket.on('project:clear', () => {
    canvas.project.clear();
    socket.broadcast.emit('project:clear');
  });

  // Drawing on canvas
  socket.on('drawing:mouseDown', (pos) => {
    path = new canvas.Path();
    path.add(new canvas.Point(pos[1], pos[2]));
    path.strokeColor = 'black';
    socket.broadcast.emit('drawing:mouseDown', pos);
  });

  socket.on('drawing:mouseDrag', (pos) => {
    let p = new canvas.Point(pos[1], pos[2]);
    path.add(p);
    socket.broadcast.emit('drawing:mouseDrag', pos);
  });

  // Chat
  socket.on('chat:newMessage', (msg) => {
    socket.broadcast.emit('chat:newMessage', msg);
  });

  // Disconnect
  socket.on('disconnect', () => {
    users--;
    io.emit('test', users);
  });
});

server.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});