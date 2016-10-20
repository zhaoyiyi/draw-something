import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GameModule } from './game.module';
import { LobbyModule } from './lobby.module';
import { GameService } from './game.service';
import { SocketService } from './socket.service';
import { ChatService } from "./chat.service";


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    GameModule,
    LobbyModule
  ],
  bootstrap: [ AppComponent ],
  providers: [ GameService, SocketService, ChatService ],
  declarations: [ AppComponent ]
})
export class AppModule {}
