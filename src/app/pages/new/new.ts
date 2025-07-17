import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Utils } from '../../utils/utils';
import { Router } from '@angular/router';
import { SwBancoService } from '../../services/swBanco.service';
import { ICreditCard } from '../../interfaces/IProducts.interface';

@Component({
  selector: 'app-new',
  imports: [ReactiveFormsModule],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export default class New {
  id = input.required<string | number>();
  fb = inject(FormBuilder);
  isExist = signal(false);
  router = inject(Router);
  swProducts = inject(SwBancoService);
  fechaActual = new Date();

  // Suma un año (agrega 1 al año)
  fechaFuture = new Date(
    this.fechaActual.setFullYear(this.fechaActual.getFullYear() + 1)
  );
  frmProduct = this.fb.group({
    id: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
    ],
    name: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(100)],
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
      ],
    ],
    logo: ['', [Validators.required]],
    date_release: [
      Utils.formatDateToYYYYMMDD(this.fechaActual),
      [Validators.required],
    ],
    date_revision: [
      Utils.formatDateToYYYYMMDD(this.fechaFuture),
      [Validators.required],
    ],
  });

  ngOnInit() {
    console.log(this.id());
    if (this.id() == 0) {
    } else {
      this.swProducts.getProduct(this.id().toString()).subscribe({
        next: (res) => {
          console.log(res);
          const product = res;
          this.frmProduct.patchValue({
            id: product.id,
            name: product.name,
            description: product.description,
            logo: product.logo,
            date_release: product.date_release,
            date_revision: product.date_revision,
          });
          this.frmProduct.get('id')?.disable();
        },
      });
    }
  }

  restartFrm() {
    this.frmProduct.reset();
  }
  idValidation() {
    setTimeout(() => {
      const id = this.frmProduct.value!.id || '';
      this.swProducts.validationId(id).subscribe((res) => {
        this.isExist.set(res ? true : false);
        // this.isxist = res.data ? true : false;
      });
    }, 1500);
  }

  dateValidation() {
    const date_release = this.frmProduct.value!.date_release || '';
    this.fechaActual = new Date(date_release);
    this.fechaFuture = new Date(
      this.fechaActual.setFullYear(this.fechaActual.getFullYear() + 1)
    );

    this.frmProduct.patchValue({
      date_revision: Utils.formatDateToYYYYMMDD(this.fechaFuture),
    });
  }

  save() {
    if (this.frmProduct.invalid) {
      console.log('Invalid form');
      return;
    }
    const payload = this.frmProduct.value as ICreditCard;
    if (this.id() == 0) {
      console.log(payload);
      this.swProducts.saveProduct(payload).subscribe((res) => {
        console.log('Save', res);
        this.router.navigate(['/list']);
      });
    } else {
      this.swProducts.updateProduct(this.id(), payload).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/list']);
        },
      });
    }
  }
}
