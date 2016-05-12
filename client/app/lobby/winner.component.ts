import { Component, Input } from '@angular/core';

@Component({
  selector: 'winner',
  template: `
    <div *ngIf="winner" class="ui center aligned segment">
      <p *ngIf="winner.user">Winner is {{winner.user.name}}</p>
      <p>{{winner.message}}</p>
    </div>
  `
})
export class WinnerComponent {
  @Input() winner;
}
