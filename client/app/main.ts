import { bootstrap } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';
import { SocketService } from "./socket.service";


bootstrap(AppComponent, [
  SocketService
]);
