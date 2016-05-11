import { Injectable } from '@angular/core';

import { SocketService } from "./socket.service";

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
    return this.socketService.toObservable('chat:newMessage');
  }
  
  
}
