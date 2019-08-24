import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subscriber } from "rxjs/Rx";

@Injectable()
export class SocketService {
  public socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io.connect('/');
  }

  toObservable(eventName: string): Observable<any> {
    return Observable.create((subscriber: Subscriber<any>) => {
      this.socket.on(eventName, (data) => subscriber.next(data));
    });
  }
}
