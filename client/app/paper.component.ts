import { Component, OnInit } from '@angular/core';
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
export class PaperComponent implements OnInit {

  constructor( private paperService: PaperService) { }

  ngOnInit() {
    this.paperService.initPaper('paper');
    this.paperService.subscribeEvent();
  }

  clearPaper() {
    this.paperService.clearProject();
  }
}
