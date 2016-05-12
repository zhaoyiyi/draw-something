import { Canvas } from '../models';

class DrawingController {
  constructor() {
    this.canvas = new Canvas();
  }

  setIo(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  subscribeAll() {
    this.onClear();
    this.onMouseDown();
    this.onMouseDrag();
  }

  onClear() {
    this.socket.on('drawing:clear', () => {
      this.canvas.clear();
      this.socket.broadcast.emit('drawing:clear');
    });
  }

  onMouseDown() {
    this.socket.on('drawing:mouseDown', (pos) => {
      this.canvas.mouseDown(pos[1], pos[2]);
      this.socket.broadcast.emit('drawing:mouseDown', pos);
    });
  }

  onMouseDrag() {
    this.socket.on('drawing:mouseDrag', (pos) => {
      this.canvas.mouseDrag(pos[1], pos[2]);
      this.socket.broadcast.emit('drawing:mouseDrag', pos);
    });
  }
}

export default DrawingController;
