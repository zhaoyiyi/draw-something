import { Component } from 'angular2/core';
import * as io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

@Component({
  selector: 'app',
  template: `
    <h1>hello</h1>
    <h2>{{msg}}</h2>
  `
})
export class AppComponent {
  public socket;
  public msg: string;
  constructor() {
    this.socket = io.connect(SERVER_URL);
    this.socket.on('hello', (data) => {
      this.msg = data;
    });
  }
}
