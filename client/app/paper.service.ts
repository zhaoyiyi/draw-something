import { Injectable } from '@angular/core';
import { SocketService } from "./socket.service";
declare var paper;

@Injectable()
export class PaperService {
  public path;
  public tool;
  private socket;

  constructor(private _socketService: SocketService) {
    this.socket = _socketService.socket;


    console.log('paper service init');
  }

  public initPaper(canvasId) {
    paper.setup(document.querySelector(`#${canvasId}`));
    this.tool = new paper.Tool();
    this.tool.minDistance = 10;
  }

  public clearProject() {
    paper.project.clear();
    this.socket.emit('drawing:clear');
  }

  public enableDrawing() {
    this.tool.onMouseDown = this.onMouseDown;
    this.tool.onMouseDrag = this.onMouseDrag;
  }

  public disableDrawing() {
    this.tool.onMouseDown = () => {};
    this.tool.onMouseDrag = () => {};
    console.log('reset paper');
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
      this.clearProject();
    });
  }

  public onMouseDown = (event) => {
    // Create a new path every time the mouse is clicked
    this.path = new paper.Path();
    this.path.add(event.point);
    this.path.strokeColor = 'black';
    this.socket.emit('drawing:mouseDown', event.point);

  };

  public onMouseDrag = (event) => {
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
    paper.project.importJSON(projectJSON);
  }


}
