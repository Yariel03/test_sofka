import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CModal } from '../c-modal/c-modal';
import { ICreditCard } from '../../interfaces/IProducts.interface';

@Component({
  selector: 'app-c-dropdown',
  imports: [CommonModule, RouterLink, CModal],
  templateUrl: './c-dropdown.html',
  styleUrl: './c-dropdown.css',
})
export class CDropdown {
  producto = input.required<ICreditCard>();
  isDelete = output<boolean>();
  showMenu = false;
  stateModal = false;
  constructor(private el: ElementRef) {}

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.showMenu = false;
    }
  }

  openModal = () => {
    this.stateModal = true;
  };

  closeModal = (isDelete: boolean) => {
    this.isDelete.emit(isDelete);
    this.stateModal = false;
    this.showMenu = false;
  };
}
