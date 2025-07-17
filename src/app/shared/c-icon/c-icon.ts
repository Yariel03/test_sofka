import { Component, Input } from '@angular/core';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'c-icon',
  imports: [],
  templateUrl: './c-icon.html',
  styleUrl: './c-icon.css',
})
export class CIcon {
  avatarUrl: string = '';
  @Input()
  set avatar(value: string) {
    if (value) {
      this.avatarUrl = value;
    } else {
      this.avatarUrl = 'NA';
    }
  }
}
