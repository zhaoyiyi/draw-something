import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { GameComponent } from './game.component';
import { PaperComponent } from './paper.component';
import { ChatComponent } from './chat.component';
import { PaperService } from "./paper.service";

@NgModule({
  imports: [ CommonModule, FormsModule ],
  declarations: [ GameComponent, PaperComponent, ChatComponent ],
  exports: [ GameComponent ],
  providers: [ PaperService]
})
export class GameModule {}
