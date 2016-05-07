import { Component, Input, OnChanges } from '@angular/core';
import { PaperComponent } from './paper.component';
import { ChatComponent } from './chat.component';
@Component({
  selector: 'game',
  template: `
    <p *ngIf="word">Please draw {{word}}</p>
    <p *ngIf="!word">{{drawer}} is drawing</p>
    <paper> </paper>
    <chat [isDrawer]="isDrawer"> </chat>
  `,
  directives: [PaperComponent, ChatComponent]
})
export class GameComponent implements OnChanges {
  @Input() word: string;
  @Input() drawer: string;
  isDrawer: boolean;

  ngOnChanges() {
    this.isDrawer = this.word ? true : false;
  }
}
