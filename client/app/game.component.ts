import { Component, Input, OnChanges } from 'angular2/core';
import { PaperComponent } from './paper.component';
import { ChatComponent } from './chat.component';
@Component({
  selector: 'game',
  template: `
    <p>{{word}}</p>
    <paper [isDrawer]="isDrawer"> </paper>
    <chat> </chat>
  `,
  directives: [PaperComponent, ChatComponent]
})
export class GameComponent implements OnChanges {
  @Input()
  public word: string;
  public isDrawer: boolean;

  public ngOnChanges() {
    if (this.word) this.isDrawer = true;
  }
}
