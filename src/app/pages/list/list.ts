import { Component, inject, signal } from '@angular/core';
import { ICreditCard } from '../../interfaces/IProducts.interface';
import { SwBancoService } from '../../services/swBanco.service';
import { CIcon } from '../../shared/c-icon/c-icon';
import { CAvatar } from '../../shared/c-avatar/c-avatar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  imports: [CIcon, CAvatar, FormsModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export default class List {
  swBancoService = inject(SwBancoService);
  lstProductos = signal([] as ICreditCard[]);
  cpyProducts = signal([] as ICreditCard[]);

  dataFilter: string = '';
  viewData: number = 5;

  ngOnInit() {
    this.swBancoService.getProductos().subscribe({
      next: (res) => {
        this.lstProductos.set(res.data);
        this.cpyProducts.set(res.data);
        console.log(this.lstProductos());
      },
    });
  }

  search() {
    if (this.dataFilter.length == 0) {
      this.cpyProducts.set(this.lstProductos());
    }
    // setTimeout(() => {
    console.log('search' + this.dataFilter);
    const products = this.cpyProducts().filter(
      (product) =>
        product.name.toLowerCase().includes(this.dataFilter.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(this.dataFilter.toLowerCase()) ||
        product.id.toString().includes(this.dataFilter) ||
        product.date_revision.toString().includes(this.dataFilter) ||
        product.date_release.toString().includes(this.dataFilter)
    );
    this.cpyProducts.set(products);
    // }, 500);
  }

  selectView() {
    this.lstProductos.set(this.cpyProducts().slice(0, this.viewData));
  }
}
