import { Injectable } from '@angular/core';
import { SocketService } from "./socket.service";

@Injectable()
export class PlayerService {
  public name;
  public socket;

  constructor(private _socketService: SocketService) {
    this.socket = _socketService.socket;
  }

  public setUsername(name: string): string {
    this.name = name;
    this.socket.emit('game:setUsername', name);
    return this.name;
  }

  public ready() {
    this.socket.emit('game:ready');
  }
}
