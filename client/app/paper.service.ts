import { Injectable } from '@angular/core';

import { SocketService } from "./socket.service";
declare var paper;

@Injectable()
export class PaperService {
  private socket: SocketIOClient.Socket;
  private tool;

  constructor(private socketService: SocketService) {
    this.socket = socketService.socket;
  }

  public initPaper(canvasId) {
    paper.projects = [];
    paper.setup(canvasId);
    this.tool = new paper.Tool();
  }

  public clearProject() {
    paper.project.clear();
    this.socket.emit('drawing:clear');
  }

  public isDrawer() {
    return this.socketService.toObservable('drawing:drawer');
  }

  public reset() {
    this.tool.remove();
  }

  public subscribeEvent() {
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
      paper.project.clear();
    });
  }

  public enableDrawing() {
    this.tool.minDistance = 10;
    this.tool.on('mousedown', this.onMouseDown);
    this.tool.on('mousedrag', this.onMouseDrag);
  }

  private onMouseDown = (event) => {
    // Create a new path every time the mouse is clicked
    this.path = new paper.Path();
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
    this.path = new paper.Path();
    this.path.add(new paper.Point(point[1], point[2]));
    this.path.strokeColor = 'black';
    paper.view.draw();
  }

  private processDrawing(point) {
    let p = new paper.Point(point[1], point[2]);
    this.path.add(p);
    paper.view.draw();
  };

  private loadProject(projectJSON) {
    paper.importJSON(projectJSON);
  }
}
