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
