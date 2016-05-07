import { Component, Input, OnChanges } from '@angular/core';
import { PaperComponent } from './paper.component';
import { ChatComponent } from './chat.component';
@Component({
  selector: 'game',
  template: `
    <p>{{word}}</p>
    <paper [isDrawer]="isDrawer"> </paper>
    <chat [isDrawer]="isDrawer"> </chat>
  `,
  directives: [PaperComponent, ChatComponent]
})
export class GameComponent {
  @Input() public word: string;
  @Input() public isDrawer: boolean;

}
