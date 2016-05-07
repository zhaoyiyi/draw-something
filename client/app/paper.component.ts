import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
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
export class PaperComponent implements OnInit, OnChanges, OnDestroy {

  public socket;
  @Input() public isDrawer: boolean;

  constructor(private _socketService: SocketService,
              private _paperService: PaperService) {
    this.socket = _socketService.socket;
  }

  public ngOnInit() {
    this._paperService.initPaper('paper');
    this._paperService.subscribeEvent();
  }

  public ngOnChanges() {
    console.log('on changes', this.isDrawer);
    // If is drawer, enable canvas and emit drawing events.
    if (this.isDrawer) {
      this._paperService.enableDrawing();
    }
  }

  public ngOnDestroy() {
    // this._paperService.clearProject();
  }

  public clearPaper() {
    this._paperService.clearProject();
  }
}
