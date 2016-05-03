import { Component, OnInit } from '@angular/core';
import { SocketService } from "./socket.service";
@Component({
  selector: 'lobby',
  template: `
    <div *ngIf="!username">
      <form action="" #nameForm="ngForm" (ngSubmit)="setUsername(nameForm.value.username)">
        <input type="text" placeholder="username" ngControl="username" required>
        <button type="submit" [disabled]="!nameForm.valid">set</button>
      </form>
    </div>
    <button (click)="ready()">I'm Ready</button>
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
  public socket;

  constructor(private _socketService: SocketService) {
    this.socket = _socketService.socket;

  }

  public ngOnInit() {
    this.socket.on('project:userChange', (userList) => {
      this.userList = userList;
    });
  }

  public setUsername(name) {
    this.username = name;
    this.socket.emit('project:userChange', name);
  }

  public ready() {
    this.socket.emit('game:ready');
  }
}
