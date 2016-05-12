import express from 'express';
import http from 'http';

import { Drawing, Game } from './server/controllers';
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


io.on('connection', function(socket) {
  let drawingController = new Drawing(io, socket);
  let game = new Game(io, socket);

  game.newUser();

  // Drawing
  socket.on('drawing:clear', () => drawingController.onClear());
  socket.on('drawing:mouseDown', (pos) => drawingController.onMouseDown(pos));
  socket.on('drawing:mouseDrag', (pos) => drawingController.onMouseDrag(pos));

  // Game
  socket.on('game:setUsername', (name) => game.onSetUsername(name));
  socket.on('game:userList', () => game.onUserList());


  // Chat
  socket.on('chat:newMessage', (msg) => {
    if (game.game.match(msg)) {
      game.user.score += 1;
      game.gameEnd(game.user);
    } else {
      socket.broadcast.emit('chat:newMessage', { user: game.user, message: msg });
    }
  });

  // Game
  socket.on('game:ready', () => {

    game.ready();

    if (game.isPlaying()) {
      game.emitDrawer();
      drawingController.load();
    }
    
    game.checkReadyStatus();

    if (game.canStart()) {
      game.gameStart();
      drawingController.notifyDrawer(game.getDrawerId());
    }
  });


  // Disconnect
  socket.on('disconnect', () => game.userQuit());
});


server.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});