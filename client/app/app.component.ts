import { Component } from 'angular2/core';
import { SocketService } from './socket.service';
import { PaperComponent } from './paper.component';
import { ChatComponent } from './chat.component';
import { InfoComponent } from './info.component';
@Component({
  selector: 'app',
  template: `
    <h1>hello</h1>
    <info></info>
    <paper></paper>
    <chat></chat>
  `,
  providers: [SocketService],
  directives: [PaperComponent, ChatComponent, InfoComponent]
})
export class AppComponent {
  public msg: string;

  constructor(private _socketService: SocketService) {
    this._socketService.socket.on('test', (data) => this.msg = data);
    this._socketService.socket.on('drawing', mousePos => console.log(mousePos));
  }
}
