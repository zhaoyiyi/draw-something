import { Component, Input } from '@angular/core';

@Component({
  selector: 'winner',
  template: `
    <div *ngIf="winner" class="ui center aligned segment">
      <p>Winner is {{winner.user.name}}</p>
      <p>Answer is {{winner.message}}</p>
    </div>
  `
})
export class WinnerComponent {
  @Input() winner;
}
