import { Component, Input, OnChanges } from '@angular/core';
import { PaperComponent } from './paper.component';
import { ChatComponent } from './chat.component';
import { Player } from "./player.model";
@Component({
  selector: 'game',
  template: `
    <div class="ui text container">
      <div class="ui center aligned raised teal segment">
        <p *ngIf="word">Please draw <span class="ui blue header">{{word}}</span></p>
        <p *ngIf="!word">
          <img src="/images/{{drawer.imageId}}.jpg" class="ui tiny middle aligned avatar image">
          {{drawer.name}} is drawing
        </p>
        <p>Time left: {{timeLeft}}</p>
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
  @Input() drawer: Player;
  @Input() timeLeft: number;
  isDrawer: boolean;

  ngOnChanges() {
    this.isDrawer = this.word ? true : false;
  }
}
