import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import { Users, Game, Canvas } from './server/index';


let app = express();
let server = http.createServer(app);
let io = socketio(server);


const PORT = process.env.PORT || 3001;
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/app', express.static(__dirname + '/client/app'));
app.use('/images', express.static(__dirname + '/client/images'));

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
      io.emit('game:end', { user: user, message: `Answer is ${msg}` });
    } else {
      socket.broadcast.emit('chat:newMessage', { user: user, message: msg });
    }
  });

  // Game


  socket.on('game:ready', () => {
    user.isReady = true;
    io.emit('game:userList', users.getUserList());

    if (game.isPlaying) {
      socket.emit('game:start', game.drawer);
      socket.emit('drawing:load', canvas.exportJSON());
    }
    
    if (users.allReady() && !game.isPlaying && users.getUserList().length < 1) {
      socket.emit('game:status', 'Game will start when there are 2 or more players');
    }
    
    if (!users.allReady() && !game.isPlaying) {
      io.emit('game:status', 'Waiting for everyone to get ready');
    }

    if (users.allReady() && !game.isPlaying && users.getUserList().length > 1) {
      game.drawer = users.nextDrawer();
      let drawerId = game.drawer.id;
      game.newWord();
      game.isPlaying = true;
      io.emit('game:start', game.drawer);
      io.to(drawerId).emit('game:answer', game.answer);
      io.to(drawerId).emit('drawing:drawer');
    }
  });

  socket.on('game:setUsername', (name) => {
    user.name = name;
    socket.emit('game:user', user);
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

    if (game.drawer === user) {
      io.emit('game:end', {message: 'Drawer has left the game'})
    }
    io.emit('project:userChange', users.getUserList());
  });
});

server.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});