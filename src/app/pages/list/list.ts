import { Component, inject, signal } from '@angular/core';
import { ICreditCard } from '../../interfaces/IProducts.interface';
import { SwBancoService } from '../../services/swBanco.service';
import { CAvatar } from '../../shared/c-avatar/c-avatar';

@Component({
  selector: 'app-list',
  imports: [CAvatar],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export default class List {
  swBancoService = inject(SwBancoService);
  lstProductos = signal([] as ICreditCard[]);
  ngOnInit() {
    this.swBancoService.getProductos().subscribe({
      next: (res) => {
        this.lstProductos.set(res.data);
        console.log(this.lstProductos());
      },
    });
  }
}
