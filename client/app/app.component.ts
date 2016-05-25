import { Component, OnInit } from '@angular/core';
import { GameComponent } from './game.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GameService } from './game.service.ts';
import { Player } from "./player.model";
@Component({
  selector: 'app',
  template: `
   <div class="ui container">
     <div *ngIf="!isPlaying">
      <lobby [winner]="winner"> </lobby>
     </div>
     <div *ngIf="isPlaying">
      <game [drawer]="drawer" [word]="word" [timeLeft]="timeLeft"> </game>
     </div>
   </div>
  `,
  directives: [GameComponent, LobbyComponent],
  providers: [GameService]
})
export class AppComponent implements OnInit {
  word: string;
  drawer: Player;
  isPlaying: boolean;
  winner: Object;
  timeLeft: number;

  constructor(private gameService: GameService) {
    // for fun
    window.useList = (list) => gameService.changeList(list);
  }

  public ngOnInit() {

    this.gameService.onGameStart().subscribe((drawer) => {
      this.drawer = drawer;
      this.isPlaying = true;
    });

    this.gameService.onReceiveAnswer().subscribe((word) => {
      this.word = word;
    });

    this.gameService.onGameEnd().subscribe((winner) => {
      this.winner = winner;
      this.isPlaying = false;
      this.word = '';
    });

    this.gameService.timeLeft().subscribe((time: number) => this.timeLeft = time);

  }
}
