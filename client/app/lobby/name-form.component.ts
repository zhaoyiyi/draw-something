import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'name-form',
  template: `
    <form action="" class=""
      #nameForm="ngForm" (ngSubmit)="setUsername(nameForm.value.username)">
      <div class="ui action input">
        <input type="text" placeholder="username" ngControl="username" required>
        <button class="ui button" type="submit" [disabled]="!nameForm.valid">set</button>
      </div>
    </form>
  `
})
export class NameFormComponent {

  @Output() setName = new EventEmitter();

  setUsername(name) {
    this.setName.emit(name);
  }

}
