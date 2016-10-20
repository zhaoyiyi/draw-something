import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
    LobbyComponent,
    NameFormComponent,
    PlayerListComponent,
    WinnerComponent,
    ReadyButtonComponent
} from './lobby/index';

@NgModule({
  imports: [ CommonModule, FormsModule ],
  declarations: [ LobbyComponent, NameFormComponent, PlayerListComponent, WinnerComponent, ReadyButtonComponent ],
  exports: [ LobbyComponent ]
})
export class LobbyModule {}
