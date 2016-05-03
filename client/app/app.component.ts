import { Component, OnInit } from '@angular/core';
import { GameComponent } from './game.component';
import { LobbyComponent } from './lobby.component';
import { SocketService } from "./socket.service";
@Component({
  selector: 'app',
  template: `
    <div *ngIf="!isPlaying">
      <lobby> </lobby>
    </div>
    
    <div *ngIf="isPlaying">
      <game [word]="word"> </game>
    </div>
  `,
  directives: [GameComponent, LobbyComponent]
})
export class AppComponent implements OnInit {
  public socket;
  public word: string;
  public isPlaying: boolean;

  constructor(private _socketService: SocketService) {
    this.socket = _socketService.socket;
  }

  public ngOnInit() {
    this.socket.on('game:start', () => {
      console.log('game start');
      this.isPlaying = true;
      console.log(this.isPlaying);
    });

    this.socket.on('game:drawer', (word) => {
      console.log('game drawer', word);
      this.word = word;
    });

    this.socket.on('game:end', (winner) => {
      console.log('game end');
    });
  }
}
