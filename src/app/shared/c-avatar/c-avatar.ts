import { Component, Input } from '@angular/core';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'c-avatar',
  imports: [],
  templateUrl: './c-avatar.html',
  styleUrl: './c-avatar.css',
})
export class CAvatar {
  avatarUrl: string = '';
  @Input()
  set avatar(value: string) {
    if (value) {
      this.avatarUrl = Utils.CapitalLeters(value);
    } else {
      this.avatarUrl = 'NA';
    }
  }
}
