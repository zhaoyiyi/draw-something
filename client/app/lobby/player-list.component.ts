import { Component, Input } from '@angular/core';
import { Player } from '../player.model';

@Component({
  selector: 'player-list',
  template: `
    <div class="ui relaxed list">
      <h2>Current players</h2>
      <div class="item" *ngFor="let player of players">
        <div class="content">
          <p class="header">{{player.name}}</p>
          <div *ngIf="player.name" class="description">
            Score: {{player.score}} Ready: {{player.isReady}}
          </div>
        </div>
      </div>
    </div>
  `
})
export class PlayerListComponent {
  @Input() players: Player[];
}
