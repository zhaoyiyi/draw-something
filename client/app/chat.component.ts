import { Component } from 'angular2/core';
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
    <form action="" #chatForm="ngForm" (ngSubmit)="sendMessage(chatForm.value.msg)">
      <input type="text" [(ngModel)]="msg" ngControl="msg" required>
      <button type="submit" [disabled]="!chatForm.valid">send</button>
    </form>
  `,
  providers: [ChatService]
})
export class ChatComponent {
  public messages: Array<string> = [];
  public msg: string;
  public username: string;
  public socket;

  constructor(private _chatService: ChatService,
              private _socketService: SocketService) {
    this.socket = _socketService.socket;

    this.socket.on('chat:newMessage', (msg) => {
      this.messages.push(msg);
    });
  }

  public sendMessage(value) {
    // rest msg input box
    this.msg = '';

    this.messages.push({user: '_self', message: value});
    this.socket.emit('chat:newMessage', value);
  }
}
