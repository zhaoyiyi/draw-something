import { Injectable } from '@angular/core';
import { SocketService } from "./socket.service";

@Injectable()
export class GameService {
  public name;
  private socket;

  constructor(private socketService: SocketService) {
    this.socket = socketService.socket;
  }

  getPlayerList() {
    this.socket.emit('game:userList');
    return this.socketService.toObservable('game:userList');
  }

  onGameEnd() {
    return this.socketService.toObservable('game:end');
  }

  onGameStart() {
    return this.socketService.toObservable('game:start');
  }

  onReceiveAnswer() {
    return this.socketService.toObservable('game:answer');
  }

  ready() {
    this.socket.emit('game:ready');
  }

  setUsername(name: string): string {
    this.name = name;
    this.socket.emit('game:setUsername', name);
    return this.name;
  }
  
}
