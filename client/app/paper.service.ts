import { Injectable } from '@angular/core';
import { SocketService } from "./socket.service";
declare var paper;

@Injectable()
export class PaperService {
  private socket: SocketIOClient.Socket;
  private canvas;

  constructor(private socketService: SocketService) {
    this.socket = socketService.socket;
  }

  public initPaper(canvasId) {
    this.canvas = paper.setup(document.querySelector(`#${canvasId}`));
    this.tool = new this.canvas.Tool();
    this.tool.minDistance = 10;
  }
  
  public clearProject() {
    this.canvas.project.clear();
    this.socket.emit('drawing:clear');
  }

  public subscribeEvent() {
    this.socket.on('drawing:drawer', () => {
      this.enableDrawing();
    });
    this.socket.on('drawing:mouseDown', (data) => {
      this.processMouseDown(data);
    });
    this.socket.on('drawing:mouseDrag', (data) => {
      this.processDrawing(data);
    });
    this.socket.on('drawing:load', (data) => {
      this.loadProject(data);
    });
    this.socket.on('drawing:clear', () => {
      this.canvas.project.clear();
    });
  }



  private enableDrawing() {
    this.tool.onMouseDown = this.onMouseDown;
    this.tool.onMouseDrag = this.onMouseDrag;
  }

  private onMouseDown = (event) => {
    // Create a new path every time the mouse is clicked
    this.path = new this.canvas.Path();
    this.path.add(event.point);
    this.path.strokeColor = 'black';
    this.socket.emit('drawing:mouseDown', event.point);

  };

  private onMouseDrag = (event) => {
    // Add a point to the path every time the mouse is dragged
    this.path.add(event.point);
    this.socket.emit('drawing:mouseDrag', event.point);

  };

  private processMouseDown(point) {
    this.path = new this.canvas.Path();
    this.path.add(new this.canvas.Point(point[1], point[2]));
    this.path.strokeColor = 'black';
    this.canvas.view.draw();
  }

  private processDrawing(point) {
    let p = new this.canvas.Point(point[1], point[2]);
    this.path.add(p);
    this.canvas.view.draw();
  };

  private loadProject(projectJSON) {
    this.canvas.project.importJSON(projectJSON);
  }
}
