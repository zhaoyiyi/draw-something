import { Component, Input, OnChanges } from '@angular/core';
import { PaperComponent } from './paper.component';
import { ChatComponent } from './chat.component';
@Component({
  selector: 'game',
  template: `
    <div class="ui text container">
      <div class="ui center aligned raised teal segment">
        <p *ngIf="word">Please draw {{word}}</p>
        <p *ngIf="!word">{{drawer}} is drawing</p>
      </div>
    </div>
    <div class="ui center aligned container segment">
        <paper> </paper>
    </div>
    <div class="ui text container segment">
      <chat [isDrawer]="isDrawer"> </chat>
    </div>
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
