import { Component, Input, OnInit } from '@angular/core';
import { NameFormComponent, PlayerListComponent, WinnerComponent, ReadyButtonComponent } from './index';
import { GameService } from "../game.service";
import { Player } from "../player.model";

@Component({
  selector: 'lobby',
  template: `
    <div class="ui text container">
      <div class="ui segments">
      
        <div *ngIf="!username" class="ui center aligned segment">
          <name-form (setName)="setUsername($event)"></name-form>
        </div>

        <div *ngIf="winner" class="ui center aligned segment">
          <winner [winner]="winner"></winner>
        </div>
        
        <div *ngIf="username" class="ui center aligned segment">
          <ready-button (ready)="onReady()"></ready-button>
        </div>
        
        <div *ngIf="players" class="ui center aligned teal segment">
          <player-list [players]="players"></player-list>
        </div>

      </div>
    </div>
  `,
  directives: [NameFormComponent, PlayerListComponent, WinnerComponent, ReadyButtonComponent]
})
export class LobbyComponent implements OnInit {
  @Input() winner;
  username: string;
  players: Player[];

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.getPlayerList()
        .subscribe(players => this.players = players);
    this.username = this.gameService.name;
  }
  
  setUsername(name) {
    this.username = this.gameService.setUsername(name);
  }

  onReady() {
    this.gameService.ready();
  }
}
