import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from "./socket.service";
import { GameService } from "./game.service.ts";
@Component({
  selector: 'lobby',
  template: `
    <div *ngIf="!username">
      <form action="" #nameForm="ngForm" (ngSubmit)="setUsername(nameForm.value.username)">
        <input type="text" placeholder="username" ngControl="username" required>
        <button type="submit" [disabled]="!nameForm.valid">set</button>
      </form>
    </div>
    <div *ngIf="winner">
      <p>Winner is {{winner.name}}</p>
      <p>Answer is {{winner.message}}</p>
    </div>
    <button (click)="ready()" [disabled]="isReady">I'm Ready</button>
    <div *ngIf="userList">
      <h2>Current Users</h2>
      <ul>
        <li *ngFor="let user of userList">{{user.name}}</li>
      </ul>
    </div>
  `
})
export class LobbyComponent implements OnInit {
  public userList: Array<any>;
  public username: string;
  public isReady: boolean;
  @Input() public winner: Object;

  constructor(private playerService: GameService) { }

  public ngOnInit() {
    this.playerService.getPlayerList()
        .subscribe(userList => this.userList = userList);
    this.username = this.playerService.name;
  }

  public setUsername(name) {
    this.username = this.playerService.setUsername(name);
  }

  public ready() {
    this.playerService.ready();
    this.isReady = true;
  }
}
