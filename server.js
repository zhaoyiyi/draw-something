"use strict";
let paper = require('paper');
let express = require('express');
var R = require('ramda');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let User = require('./server/user');
let Game = require('./server/game');

const PORT = process.env.PORT || 3000;
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/app', express.static(__dirname + '/client/app'));

app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});


let users = {};
let game;
let canvas = paper.setup(new paper.Canvas(500, 500));
let path;

io.on('connection', (socket) => {
  users[socket.id] = new User(socket.id);
  let user = users[socket.id];

  io.emit('project:load', canvas.project.exportJSON());

  socket.on('project:userChange', (name) => {
    user.name = name;
    let userList = Object.keys(users).map( key => users[key]);
    io.emit('project:userChange', userList);
  });
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
    if (game.match(msg)) {
      user.score += 1;
      io.emit('game:end', {user: user.name, message: msg});
    } else {
      socket.broadcast.emit('chat:newMessage', {user: user.name, message: msg});
    }
  });

  // Game
  socket.on('game:ready', () => {
    user.isReady = true;
    let userArray = R.values(users);
    let isReady = R.propEq('isReady', true);
    let allReady = R.all(isReady)(userArray);
    if (allReady) {
      game = new Game();
      let randomIndex = Math.floor(Math.random() * userArray.length);
      io.to(userArray[randomIndex].id).emit('game:drawer', game.answer);
      io.emit('game:start');
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    delete users[socket.id];
    let userList = Object.keys(users).map( key => users[key]);
    io.emit('project:userChange', userList);
  });
});

server.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});