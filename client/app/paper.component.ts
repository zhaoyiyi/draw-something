import { Component, OnInit } from 'angular2/core';
import { SocketService } from "./socket.service";
import { PaperService } from './paper.service';

@Component({
  selector: 'paper',
  template: `
    <button (click)="clearPaper()">clear</button>
    <canvas 
      id="paper"
      style="height: 500px; width: 500px; border: 1px solid red">
    </canvas>
  `,
  providers: [PaperService]
})
export class PaperComponent implements OnInit {

  public socket;

  constructor(private _socketService: SocketService,
              private _paperService: PaperService) {
    this.socket = _socketService.socket;
  }

  public ngOnInit() {
    this._paperService.initPaper('paper');
    // Set up emit drawing
    this._paperService.tool.onMouseDown = this._onMouseDown.bind(this);
    this._paperService.tool.onMouseDrag = this._onMouseDrag.bind(this);

    // Incoming events
    this.socket.on('drawing:mouseDown', (data) => {
      this._paperService.processMouseDown(data);
    });
    this.socket.on('drawing:mouseDrag', (data) => {
      this._paperService.processDrawing(data);
    });
    this.socket.on('project:load', (data) => {
      this._paperService.loadProject(data);
    });
    this.socket.on('project:clear', () => {
      this._paperService.clearProject();
    });
  }

  public clearPaper() {
    this._paperService.clearProject();
    this.socket.emit('project:clear');
  }

  private _onMouseDown(event) {
    this._paperService.onMouseDown(event);
    this.socket.emit('drawing:mouseDown', event.point);
  }

  private _onMouseDrag(event) {
    this._paperService.onMouseDrag(event);
    this.socket.emit('drawing:mouseDrag', event.point);
  }

}
