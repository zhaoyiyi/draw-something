import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { SocketService } from "./socket.service";
import { Subscriber } from "rxjs/Subscriber";

@Injectable()
export class ChatService {
  private socket: SocketIOClient.Socket;

  constructor(private socketService: SocketService) {
    this.socket = socketService.socket;
  }

  sendMessage(msg) {
    this.socket.emit('chat:newMessage', msg);
  }

  onNewMessage() {
    return Observable.create( (subscriber: Subscriber) => {
      this.socket.on('chat:newMessage', (msg) => subscriber.next(msg));
    });
  }
}
