import { Component } from 'angular2/core';
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
    <div>
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

  constructor(private _socketService: SocketService) {
    this.socket = _socketService.socket;
    this.socket.on('project:userChange', (userList) => {
      console.log(userList);
      this.userList = userList;
    });
  }

  public setUsername(name) {
    this.username = name;
    this.socket.emit('project:userChange', name);
  }
}
