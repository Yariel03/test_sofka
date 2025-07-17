import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ICreditCard } from '../../interfaces/IProducts.interface';
import { SwBancoService } from '../../services/swBanco.service';
import { CIcon } from '../../shared/c-icon/c-icon';
import { CAvatar } from '../../shared/c-avatar/c-avatar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CDropdown } from '../../shared/c-dropdown/c-dropdown';

@Component({
  selector: 'app-list',
  imports: [CIcon, CAvatar, FormsModule, CDropdown],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class List {
  swBancoService = inject(SwBancoService);
  router = inject(Router);

  lstProductos = signal([] as ICreditCard[]);
  cpyProducts = signal([] as ICreditCard[]);
  dataFilter = signal<string>('');
  viewData = signal<number>(5);

  total = computed(() => {
    return this.cpyProducts().length;
  });

  loadingEffect = effect(() => {
    this.cpyProducts.set(this.lstProductos().slice(0, this.viewData()));
  });

  ngOnInit() {
    this.getProductos();
  }

  getProductos = () => {
    this.swBancoService.getProductos().subscribe({
      next: (res) => {
        this.lstProductos.set(res.data);
      },
    });
  };

  search() {
    if (this.dataFilter().length == 0) {
      this.cpyProducts.set(this.lstProductos().slice(0, this.viewData()));
      return;
    }
    setTimeout(() => {
      this.cpyProducts.set(this.lstProductos());

      const products = this.cpyProducts().filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(this.dataFilter().toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(this.dataFilter().toLowerCase()) ||
          product.id.toString().includes(this.dataFilter()) ||
          product.date_revision.toString().includes(this.dataFilter()) ||
          product.date_release.toString().includes(this.dataFilter())
      );
      this.cpyProducts.set(products.slice(0, this.viewData()));
    }, 800);
  }

  newProduct() {
    this.router.navigate(['/new', 0]);
  }

  delete = (isDelete: boolean, product: ICreditCard) => {
    if (isDelete) {
      this.swBancoService.deleteProduct(product.id).subscribe({
        next: (res) => {
          console.log(res);
          this.getProductos();
        },
      });
    }
  };
}
