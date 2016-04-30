import { Component, OnInit } from 'angular2/core';
import { SocketService } from "./socket.service";
import { PaperService } from './paper.service';

@Component({
  selector: 'paper',
  template: `
    <canvas 
      id="paper"
      style="height: 500px; width: 500px; border: 1px solid red">
    </canvas>
  `,
  providers: [PaperService]
})
export class PaperComponent implements OnInit {

  constructor(private _socketService: SocketService,
              private _paperService: PaperService) {
  }

  public ngOnInit() {
    this._paperService.initPaper('paper');
    // Set up emit drawing
    this._paperService.tool.onMouseDown = this._onMouseDown.bind(this);
    this._paperService.tool.onMouseDrag = this._onMouseDrag.bind(this);

    // Incoming events
    this._socketService.socket.on('mouseDown', (data) => {
      this._paperService.processMouseDown(data);
    });
    this._socketService.socket.on('mouseDrag', (data) => {
      this._paperService.processDrawing(data);
    });
  }

  private _onMouseDown(event) {
    this._paperService.onMouseDown(event);
    this._socketService.socket.emit('mouseDown', event.point);
  }

  private _onMouseDrag(event) {
    this._paperService.onMouseDrag(event);
    this._socketService.socket.emit('mouseDrag', event.point);
  }

}
