import { Component } from '@angular/core';
import { Router } from "@angular/router-deprecated";
import { SocketService } from "./socket.service";

@Component({
  selector: 'info',
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
export class InfoComponent {
  public userList: Array;
  public username: string;
  public socket;
  public isDrawer: boolean;

  constructor(private _socketService: SocketService,
              private _router: Router) {
    this.socket = _socketService.socket;
    this.socket.on('project:userChange', (userList) => {
      this.userList = userList;
    });

    this.socket.on('game:start', () => {
      console.log('game start');
      this._router.navigate(['Game', {isDrawer: this.isDrawer}]);
    });

    this.socket.on('game:drawer', () => {
      console.log('game drawer');
      this.isDrawer = true;
    });

    this.socket.on('game:end', (winner) => {
      console.log('game end');
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
