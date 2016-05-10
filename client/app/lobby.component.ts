import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from "./socket.service";
import { GameService } from "./game.service.ts";
@Component({
  selector: 'lobby',
  template: `
    <div class="ui text container">
      <div class="ui segments">
      
        <div *ngIf="!username" class="ui center aligned segment">
          <form action="" class=""
            #nameForm="ngForm" (ngSubmit)="setUsername(nameForm.value.username)">
            <div class="ui action input">
              <input type="text" placeholder="username" ngControl="username" required>
              <button class="ui button" type="submit" [disabled]="!nameForm.valid">set</button>
            </div>
          </form>
        </div>
        
        <div *ngIf="winner" class="ui center aligned segment">
          <p>Winner is {{winner.name}}</p>
          <p>Answer is {{winner.message}}</p>
        </div>
        
        <div *ngIf="username" class="ui center aligned segment">
          <button class="ui teal button"
             (click)="ready()" [disabled]="isReady">I'm Ready</button>
        </div>
        
        <div class="ui center aligned teal segment">
          <div *ngIf="userList" class="ui relaxed list">
            <h2>Current Users</h2>
            <div class="item" *ngFor="let user of userList">
              <div class="content">
                <p class="header">{{user.name}}</p>
                <div *ngIf="user.name" class="description">
                  Score: {{user.score}} Ready: {{user.isReady}}
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
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
