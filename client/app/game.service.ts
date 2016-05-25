import { Injectable } from '@angular/core';
import { SocketService } from "./socket.service";
import { Player } from "./player.model";

@Injectable()
export class GameService {
  public player: Player;
  private socket;

  constructor(private socketService: SocketService) {
    this.socket = socketService.socket;
    // server emits player obj after player sets username
    this.socket.on('game:user', (player: Player) => this.player = player);
  }
  
  changeList(list: string) {
    this.socket.emit('game:useList', list);
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

  onReceiveStatusMessage() {
    return this.socketService.toObservable('game:status');
  }

  ready() {
    this.socket.emit('game:ready');
  }

  setUsername(name: string): string {
    this.socket.emit('game:setUsername', name);
    return name;
  }

  timeLeft() {
    return this.socketService.toObservable('game:timeLeft');
  }

}
