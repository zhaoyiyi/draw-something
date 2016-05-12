import socketio from 'socket.io';

let io;

export function initIo(httpServer) {
  io = socketio(httpServer);
  return io;
}

export function getIo() {
  if (!io) throw 'io is not initialized';

  return io;
}
