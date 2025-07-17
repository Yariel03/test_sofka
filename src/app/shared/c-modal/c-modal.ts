import { Component, effect, inject, input, output } from '@angular/core';
import { SwBancoService } from '../../services/swBanco.service';
import { ICreditCard } from '../../interfaces/IProducts.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-c-modal',
  imports: [CommonModule],
  templateUrl: './c-modal.html',
  styleUrl: './c-modal.css',
})
export class CModal {
  isDelete = output<boolean>();
  swProduct = inject(SwBancoService);
  router = inject(Router);

  abrir = input(false);
  isVisible = false;
  producto = input({} as ICreditCard);

  loadingEffect = effect(() => {
    this.isVisible = this.abrir();
  });
  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
    this.isDelete.emit(false);

  }

  delete() {
    this.close();
    this.isDelete.emit(true);
  }
}
