import express from 'express';
import http from 'http';

import { Users, Game, Canvas } from './server/models';
import { DrawingController } from './server/controllers';
import { initIo } from './server/socket-io';


let app = express();
let server = http.createServer(app);
let io = initIo(server);


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
  let drawingController = new DrawingController();
  drawingController.setIo(io, socket);
  drawingController.subscribeAll();

  
  users.addUser(socket.id);
  let user = users.find(socket.id);

  // Chat
  socket.on('chat:newMessage', (msg) => {
    if (game.match(msg)) {
      user.score += 1;
      gameEnd();
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
      game.start(() => gameEnd());
      countDown();
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
      io.emit('game:end', { message: 'Drawer has left the game' })
    }
    io.emit('project:userChange', users.getUserList());
  });
});


// Functions

function gameEnd() {
  users.unReadyAll();
  canvas.clear();
  game.end();
  io.emit('game:end', { user: user, message: `Answer is ${game.answer}` });
}

function countDown() {
  let time = 30000 / 1000 - 1;
  game.interval = setInterval(() => {
    io.emit('game:timeLeft', time);
    time = time - 1;
  }, 1000);
}

server.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});