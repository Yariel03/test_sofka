import { Component, computed, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  isSave = signal(false);
  fechaActual = signal(new Date());

  fechaFuture = computed(() => {
    return new Date(
      this.fechaActual().setFullYear(this.fechaActual().getFullYear() + 1)
    );
  });

  frmProduct = this.fb.group(
    {
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
          Validators.pattern(/^\S.*$/),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^\S.*$/),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/^\S.*$/),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', [Validators.required]],
      date_release: [
        Utils.formatDateToYYYYMMDD(this.fechaActual()),
        [Validators.required],
      ],
      date_revision: [
        Utils.formatDateToYYYYMMDD(this.fechaFuture()),
        [Validators.required],
      ],
    },
    {
      validators: [
        (formGroup: AbstractControl) => {
          const fecha_Actual = formGroup.get('date_release');

          return fecha_Actual?.value >= Utils.formatDateToYYYYMMDD(new Date())
            ? null
            : { dateNotNow: true };
        },
      ],
    }
  );

  ngOnInit() {
    if (this.id() == 0) {
    } else {
      this.swProducts.getProduct(this.id().toString()).subscribe({
        next: (res) => {
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
    this.isSave.set(false);
    this.frmProduct.reset();
  }
  idValidation() {
    setTimeout(() => {
      const id = this.frmProduct.value!.id || '';
      if (id.trim().length > 0) {
        this.swProducts.validationId(id).subscribe((res) => {
          this.isExist.set(res ? true : false);
          // this.isxist = res.data ? true : false;
        });
      }
    }, 800);
  }

  dateValidation() {
    this.fechaActual.set(new Date(this.frmProduct.value?.date_release || ''));

    // Aumentar un día a la fecha de revisión antes de asignar
    const fechaRevision = this.fechaFuture();
    fechaRevision.setDate(fechaRevision.getDate() + 1);

    this.frmProduct.patchValue({
      date_revision: Utils.formatDateToYYYYMMDD(fechaRevision),
    });
  }

  save() {
    if (this.frmProduct.invalid) {
      console.log('Invalid form');
      return;
    }
    this.isSave.set(true);
    const payload = this.frmProduct.value as ICreditCard;
    if (this.id() == 0) {
      this.swProducts.saveProduct(payload).subscribe({
        next: (res) => {
          this.isSave.set(false);

          this.router.navigate(['/list']);
        },
        error: (err) => {
          this.isSave.set(false);
        },
      });
    } else {
      this.swProducts.updateProduct(this.id(), payload).subscribe({
        next: (res) => {
          this.isSave.set(false);

          this.router.navigate(['/list']);
        },
        error: (err) => {
          this.isSave.set(false);
        },
      });
    }
  }
}
