import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { SocketService } from "./socket.service";

@Component({
  selector: 'chat',
  template: `
    <div style="height: 300px; border: 1px solid black">
      <h2>Chat</h2>
      <p *ngFor="let msg of messages" 
        [ngStyle]="{'text-align': msg.user === '_self' ? 'right' : 'left'}">
        <span *ngIf="msg.user !== '_self'">{{msg.user}}: </span> {{msg.message}}
      </p>
    </div>
    <div *ngIf="!isDrawer">
      <form action="" #chatForm="ngForm" (ngSubmit)="sendMessage(chatForm.value.msg)">
        <input type="text" [(ngModel)]="msg" ngControl="msg" required>
        <button type="submit" [disabled]="!chatForm.valid">send</button>
      </form>
    </div>
  `,
  providers: [ChatService]
})
export class ChatComponent implements OnInit {
  @Input()
  public isDrawer: boolean;
  public messages: Array<any> = [];
  public msg: string;
  public socket;

  constructor(private _chatService: ChatService,
              private _socketService: SocketService) {
    this.socket = _socketService.socket;
  }

  public ngOnInit() {
    this.socket.on('chat:newMessage', (msg) => {
      this.messages.push(msg);
    });
  }

  public sendMessage(value) {
    // rest msg input box
    this.msg = '';

    this.messages.push({ user: '_self', message: value });
    this.socket.emit('chat:newMessage', value);
  }
}
