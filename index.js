"use strict";
let express = require('express');
var R = require('ramda');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

let Users = require('./server/users');
let Game = require('./server/game');
let Canvas = require('./server/canvas');

const PORT = process.env.PORT || 3000;
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/app', express.static(__dirname + '/client/app'));

app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});


let users = new Users();
let game = new Game();
let canvas = new Canvas();

io.on('connection', (socket) => {
  users.addUser(socket.id);
  let user = users.find(socket.id);

  // Drawing on canvas
  socket.on('drawing:mouseDown', (pos) => {
    canvas.mouseDown(pos[1], pos[2]);
    socket.broadcast.emit('drawing:mouseDown', pos);
  });

  socket.on('drawing:mouseDrag', (pos) => {
    canvas.mouseDrag(pos[1], pos[2]);
    socket.broadcast.emit('drawing:mouseDrag', pos);
  });

  socket.on('drawing:clear', () => {
    canvas.clear();
    socket.broadcast.emit('drawing:clear');
  });

  // Chat
  socket.on('chat:newMessage', (msg) => {
    if (game.match(msg)) {
      user.score += 1;
      game.isPlaying = false;
      users.unReadyAll();
      canvas.clear();
      io.emit('game:end', {name: user.name, message: msg});
    } else {
      socket.broadcast.emit('chat:newMessage', {user: user.name, message: msg});
    }
  });

  // Game
  socket.on('game:ready', () => {
    user.isReady = true;
    
    if (users.allReady() && !game.isPlaying) {
      let drawerId = users.pickDrawer();
      game.newWord();
      game.isPlaying = true;
      io.emit('game:start');
      io.to(drawerId).emit('game:answer', game.answer);
      io.to(drawerId).emit('drawing:drawer');
    }
    if(game.isPlaying) {
      socket.emit('game:start');
    }
    io.emit('drawing:load', canvas.exportJSON());
  });

  socket.on('game:setUsername', (name) => {
    user.name = name;
    io.emit('game:userList', users.getUserList());
  });

  socket.on('game:userList', () => {
    socket.emit('game:userList', users.getUserList());
  });

  // Disconnect
  socket.on('disconnect', () => {
    users.removeUser(socket.id);
    if (users.getUserList().length === 0) {
      game.isPlaying = false;
      canvas.clear();
    }
    io.emit('project:userChange', users.getUserList());
  });
});

server.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});