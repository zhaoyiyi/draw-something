import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChatService } from './chat.service';
import { GameService } from "./game.service";
import { Player } from "./player.model";

@Component({
  selector: 'chat',
  template: `     
    <div style="height: 200px; overflow-y: scroll" id="chat" class="ui relaxed divided list">
      <div *ngFor="let msg of messages" class="item">
        <img src="/images/{{msg.user.imageId}}.jpg" class="ui middle aligned avatar image">
        <div class="content">
          <span class="ui grey sub header">{{msg.user.name}}</span>
          <div class="description">{{msg.message}}</div>
        </div>
      </div>
    </div>
    
    <div *ngIf="!isDrawer" class="ui right aligned container">
      <form action="" class="ui small action input" #chatForm="ngForm" (ngSubmit)="sendMessage(chatForm.value.msg)">
        <input type="text" [(ngModel)]="msg" ngControl="msg" name="msg" required>
        <button type="submit" [disabled]="!chatForm.valid" class="ui teal button">send</button>
      </form>
    </div>
    
    
  `,
  providers: [ChatService]
})
export class ChatComponent implements OnInit {
  @Input() isDrawer: boolean;
  messages: Array<any> = [];
  msg: string;
  player: Player;

  constructor(private chatService: ChatService,
              private gameService: GameService,
              private el: ElementRef) {
  }

  ngOnInit() {
    this.chatService.onNewMessage()
        .subscribe((msg) => {
          this.messages.push(msg);
          this.scrollToBottom();
        });
    this.player = this.gameService.player;
  }

  sendMessage(value: NgForm) {

    // reset msg input box
    this.msg = '';
    this.messages.push({ user: this.player, message: value });
    this.chatService.sendMessage(value);
    this.scrollToBottom();

  }

  scrollToBottom() {
    setTimeout(() => {
      let chat = this.el.nativeElement.querySelector('#chat');
      chat.scrollTop = chat.scrollHeight;
    });
  }
}
