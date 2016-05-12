import { CanvasInstance } from '../models';

class DrawingController {
  constructor(io, socket) {
    this.canvas = CanvasInstance();
    this.io = io;
    this.socket = socket;
  }

  load() {
    this.socket.emit('drawing:load', this.canvas.exportJSON());
  }

  notifyDrawer(drawerId) {
    this.io.to(drawerId).emit('drawing:drawer');
  }

  onClear() {
    this.canvas.clear();
    this.socket.broadcast.emit('drawing:clear');
  }

  onMouseDown(pos) {
    this.canvas.mouseDown(pos[1], pos[2]);
    this.socket.broadcast.emit('drawing:mouseDown', pos);
  }

  onMouseDrag(pos) {
    this.canvas.mouseDrag(pos[1], pos[2]);
    this.socket.broadcast.emit('drawing:mouseDrag', pos);
  }
}

export default DrawingController;
