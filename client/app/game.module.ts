import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { GameComponent } from './game.component';
import { PaperComponent } from './paper.component';
import { ChatComponent } from './chat.component';

@NgModule({
  imports: [ CommonModule, FormsModule ],
  declarations: [ GameComponent, PaperComponent, ChatComponent ],
  exports: [ GameComponent ]
})
export class GameModule {}
