const socketio = require('socket.io');

let io;

exports.initIo = function initIo(httpServer) {
  io = socketio(httpServer);
  return io;
}

exports.getIo = function getIo() {
  if (!io) throw 'io is not initialized';

  return io;
}
