import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SocketService } from "./socket.service";
import { PaperService } from './paper.service';

@Component({
  selector: 'paper',
  template: `
    <div *ngIf="isDrawer">
      <button (click)="clearPaper()">clear</button>
    </div>
    <canvas 
      id="paper"
      style="height: 500px; width: 500px; border: 1px solid red">
    </canvas>
  `,
  providers: [PaperService]
})
export class PaperComponent implements OnInit, OnChanges {

  public socket;
  @Input()
  public isDrawer: boolean;

  constructor(private _socketService: SocketService,
              private _paperService: PaperService) {
    this.socket = _socketService.socket;
  }

  public ngOnInit() {
    this._paperService.initPaper('paper');

    // Incoming events
    this.socket.on('drawing:mouseDown', (data) => {
      this._paperService.processMouseDown(data);
    });
    this.socket.on('drawing:mouseDrag', (data) => {
      this._paperService.processDrawing(data);
    });
    this.socket.on('drawing:load', (data) => {
      this._paperService.loadProject(data);
    });
    this.socket.on('drawing:clear', () => {
      this._paperService.clearProject();
    });
  }

  public ngOnChanges() {
    // If is drawer, enable canvas and emit drawing events.
    if (this.isDrawer) {
      this._paperService.tool.onMouseDown = this._onMouseDown.bind(this);
      this._paperService.tool.onMouseDrag = this._onMouseDrag.bind(this);
    }
  }

  public clearPaper() {
    this._paperService.clearProject();
    this.socket.emit('drawing:clear');
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
