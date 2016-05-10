import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ready-button',
  template: `
    <button class="ui teal button"
       (click)="onReady()" [disabled]="isReady">I'm Ready</button>
  `
})
export class ReadyButtonComponent {
  isReady: boolean;
  @Output() ready = new EventEmitter();

  onReady() {
    this.ready.emit(true);
    this.isReady = true;
  }
}
