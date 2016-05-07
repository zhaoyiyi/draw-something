import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
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

  @Input() isDrawer: boolean;
  constructor( private paperService: PaperService) { }

  ngOnInit() {
    this.paperService.initPaper('paper');
    this.paperService.subscribeEvent();
  }

  ngOnChanges() {
    console.log('on changes', this.isDrawer);
    // If is drawer, enable canvas and emit drawing events.
    if (this.isDrawer) {
      this.paperService.enableDrawing();
    }
  }

  ngOnDestroy() {
    this.paperService.disableDrawing();
  }

  clearPaper() {
    this.paperService.enableDrawing();
    this.paperService.clearProject();
  }
}
