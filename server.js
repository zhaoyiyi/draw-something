"use strict";
let express = require('express');
var R = require('ramda');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let User = require('./server/user');
let Game = require('./server/game');
let Canvas = require('./server/canvas');

const PORT = process.env.PORT || 3000;
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/app', express.static(__dirname + '/client/app'));

app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});


let users = {};
let game = new Game();
let canvas = new Canvas();

io.on('connection', (socket) => {
  users[socket.id] = new User(socket.id);
  let user = users[socket.id];



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
      io.emit('game:end', {name: user.name, message: msg});
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
    if (allReady && !game.isPlaying) {
      game.newWord();
      game.isPlaying = true;
      let randomIndex = Math.floor(Math.random() * userArray.length);
      io.emit('game:start');
      io.to(userArray[randomIndex].id).emit('game:drawer', game.answer);
    }
    if(game.isPlaying) {
      socket.emit('game:start');
    }

    io.emit('project:load', canvas.exportJSON());
  });

  socket.on('game:setUsername', (name) => {
    user.name = name;
    let userList = Object.keys(users).map( key => users[key]);
    io.emit('game:userList', userList);
  });

  socket.on('game:userList', () => {
    let userList = Object.keys(users).map( key => users[key]);
    socket.emit('game:userList', userList);
  });

  // Disconnect
  socket.on('disconnect', () => {
    delete users[socket.id];
    let userList = Object.keys(users).map( key => users[key]);
    if (userList.length === 0) {
      game.isPlaying = false;
      canvas.clear();
    }
    io.emit('project:userChange', userList);
  });
});

server.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});