import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class SocketService {
  public socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io.connect(SERVER_URL);
  }
}
