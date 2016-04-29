import { Component } from 'angular2/core';
import * as io from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs/Rx';

const SERVER_URL = 'http://localhost:3000';

@Component({
  selector: 'app',
  template: `
    <h1>hello</h1>
    <h2>current users: {{msg}}</h2>
    <canvas 
      (mousedown)="emitMouseMove()"
      style="height: 500px; width: 500px; border: 1px solid red">
    </canvas>
    
  `
})
export class AppComponent {
  public msg: string;
  public socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io.connect(SERVER_URL);

    this.socket.on('test', (data) => this.msg = data);
    this.socket.on('drawing', mousePos => console.log(mousePos));

  }

  public emitMouseMove() {
    let mousedown = Observable.fromEvent(document, 'mousedown');
    let mouseup = Observable.fromEvent(document, 'mouseup');
    let mousemove = Observable.fromEvent(document, 'mousemove');

    mousedown
        .mergeMap(() => mousemove)
        .takeUntil(mouseup)
        .map((data: MouseEvent) => ({ x: data.clientX, y: data.clientY }))
        .subscribe(data => {
          // console.log(data);
          this.socket.emit('drawing', data);
        });
  }
}
