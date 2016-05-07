import { Component, OnInit } from '@angular/core';
import { GameComponent } from './game.component';
import { LobbyComponent } from './lobby.component';
import { SocketService } from "./socket.service";
import { PlayerService } from './player.service';
@Component({
  selector: 'app',
  template: `
    <div *ngIf="!isPlaying">
      <lobby [winner]="winner"> </lobby>
    </div>
    
    <div *ngIf="isPlaying">
      <game [isDrawer]="isDrawer" [word]="word"> </game>
    </div>
  `,
  directives: [GameComponent, LobbyComponent],
  providers: [PlayerService]
})
export class AppComponent implements OnInit {
  public socket;
  public word: string;
  public isDrawer: boolean =  false;
  public isPlaying: boolean;
  public winner: Object;

  constructor(private _socketService: SocketService,
              private _playerService: PlayerService) {
    this.socket = _socketService.socket;
  }

  public ngOnInit() {
    this.socket.on('game:start', () => {
      console.log('game start');
      this.isPlaying = true;
    });

    this.socket.on('game:answer', (word) => {
      console.log('game answer', word);
      this.word = word;
      this.isDrawer = true;
    });

    this.socket.on('game:end', (winner) => {
      console.log('game end');
      console.log(winner);
      this.winner = winner;
      this.isPlaying = false;
      this.isDrawer = false;
      this.word = '';
    });
  }
}
