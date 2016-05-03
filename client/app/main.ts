import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from "@angular/router-deprecated";
import { AppComponent } from './app.component';
import { SocketService } from "./socket.service";


bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  SocketService
]);
