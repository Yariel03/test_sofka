import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import New from './new';
import { SwBancoService } from '../../services/swBanco.service';
import { ICreditCard, IResponse } from '../../interfaces/IProducts.interface';
import { Utils } from '../../utils/utils';

// Mock del servicio SwBancoService
const mockSwBancoService = {
  getProduct: jest.fn(),
  validationId: jest.fn(),
  saveProduct: jest.fn(),
  updateProduct: jest.fn(),
};

// Mock del Router
const mockRouter = {
  navigate: jest.fn(),
};

// Mock de Utils
jest.mock('../../utils/utils', () => ({
  Utils: {
    formatDateToYYYYMMDD: jest.fn(),
  },
}));

describe('New Component', () => {
  let component: New;
  let fixture: ComponentFixture<New>;
  let swBancoService: jest.Mocked<SwBancoService>;
  let router: jest.Mocked<Router>;

  const mockProduct: ICreditCard = {
    id: 'TEST123',
    name: 'Test Credit Card',
    description: 'Test description for credit card',
    logo: 'test-logo.png',
    date_release: '2024-01-01',
    date_revision: '2025-01-01',
  };

  const mockValidationResponse: IResponse<ICreditCard> = {
    data: mockProduct,
    message: 'Success',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, New],
      providers: [
        { provide: SwBancoService, useValue: mockSwBancoService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(New);
    component = fixture.componentInstance;
    swBancoService = TestBed.inject(
      SwBancoService
    ) as jest.Mocked<SwBancoService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;

    // Mock Utils.formatDateToYYYYMMDD
    (Utils.formatDateToYYYYMMDD as jest.Mock).mockReturnValue('2024-01-01');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      fixture.componentRef.setInput('id', 0);
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      fixture.componentRef.setInput('id', 0);

      expect(component.isExist()).toBe(false);
      expect(component.isSave()).toBe(false);
      expect(component.fechaActual()).toBeInstanceOf(Date);
    });

    it('should create form with correct validators', () => {
      fixture.componentRef.setInput('id', 0);

      const form = component.frmProduct;
      expect(form).toBeDefined();
      expect(form.get('id')).toBeDefined();
      expect(form.get('name')).toBeDefined();
      expect(form.get('description')).toBeDefined();
      expect(form.get('logo')).toBeDefined();
      expect(form.get('date_release')).toBeDefined();
      expect(form.get('date_revision')).toBeDefined();
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('id', 0);
    });

    it('should validate id field - required', () => {
      const idControl = component.frmProduct.get('id');
      idControl?.setValue('');
      expect(idControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate id field - minLength', () => {
      const idControl = component.frmProduct.get('id');
      idControl?.setValue('AB');
      expect(idControl?.errors?.['minlength']).toBeTruthy();
    });

    it('should validate id field - maxLength', () => {
      const idControl = component.frmProduct.get('id');
      idControl?.setValue('12345678901');
      expect(idControl?.errors?.['maxlength']).toBeTruthy();
    });

    it('should validate id field - pattern (no leading spaces)', () => {
      const idControl = component.frmProduct.get('id');
      idControl?.setValue(' ABC');
      expect(idControl?.errors?.['pattern']).toBeTruthy();
    });

    it('should validate name field - required', () => {
      const nameControl = component.frmProduct.get('name');
      nameControl?.setValue('');
      expect(nameControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate name field - minLength', () => {
      const nameControl = component.frmProduct.get('name');
      nameControl?.setValue('Test');
      expect(nameControl?.errors?.['minlength']).toBeTruthy();
    });

    it('should validate description field - required', () => {
      const descControl = component.frmProduct.get('description');
      descControl?.setValue('');
      expect(descControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate description field - minLength', () => {
      const descControl = component.frmProduct.get('description');
      descControl?.setValue('Short');
      expect(descControl?.errors?.['minlength']).toBeTruthy();
    });

    it('should validate logo field - required', () => {
      const logoControl = component.frmProduct.get('logo');
      logoControl?.setValue('');
      expect(logoControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate date_release field - required', () => {
      const dateControl = component.frmProduct.get('date_release');
      dateControl?.setValue('');
      expect(dateControl?.errors?.['required']).toBeTruthy();
    });
  });

  describe('Custom Form Validator', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('id', 0);
    });

    it('should validate date is not in the past', () => {
      const pastDate = '2020-01-01';
      (Utils.formatDateToYYYYMMDD as jest.Mock).mockReturnValue('2024-01-01');

      component.frmProduct.get('date_release')?.setValue(pastDate);

      expect(component.frmProduct.errors?.['dateNotNow']).toBeTruthy();
    });

    it('should pass validation for current or future date', () => {
      const currentDate = '2024-01-01';
      (Utils.formatDateToYYYYMMDD as jest.Mock).mockReturnValue('2024-01-01');

      component.frmProduct.get('date_release')?.setValue(currentDate);

      expect(component.frmProduct.errors?.['dateNotNow']).toBeFalsy();
    });
  });

  describe('ngOnInit', () => {
    it('should not load product when id is 0', () => {
      fixture.componentRef.setInput('id', 0);

      component.ngOnInit();

      expect(swBancoService.getProduct).not.toHaveBeenCalled();
    });

    it('should load product when id is not 0', () => {
      fixture.componentRef.setInput('id', 'TEST123');
      swBancoService.getProduct.mockReturnValue(of(mockProduct));

      component.ngOnInit();

      expect(swBancoService.getProduct).toHaveBeenCalledWith('TEST123');
    });
  });

  describe('restartFrm', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('id', 0);
    });

    it('should reset form and isSave signal', () => {
      component.isSave.set(true);
      component.frmProduct.patchValue({ id: 'TEST', name: 'Test Name' });

      component.restartFrm();

      expect(component.isSave()).toBe(false);
      expect(component.frmProduct.value.id).toBe(null);
      expect(component.frmProduct.value.name).toBe(null);
    });
  });

  describe('idValidation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('id', 0);
    });

    it('should call validationId service after timeout', fakeAsync(() => {
      swBancoService.validationId.mockReturnValue(of(mockValidationResponse));
      component.frmProduct.patchValue({ id: 'TEST123' });

      component.idValidation();
      tick(800);

      expect(swBancoService.validationId).toHaveBeenCalledWith('TEST123');
    }));

    it('should set isExist to true when product exists', fakeAsync(() => {
      swBancoService.validationId.mockReturnValue(of(mockValidationResponse));
      component.frmProduct.patchValue({ id: 'TEST123' });

      component.idValidation();
      tick(800);

      expect(component.isExist()).toBe(true);
    }));

    it('should not call service when id is empty', fakeAsync(() => {
      component.frmProduct.patchValue({ id: '' });

      component.idValidation();
      tick(800);

      expect(swBancoService.validationId).not.toHaveBeenCalled();
    }));
  });

  describe('dateValidation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('id', 0);
    });

    it('should update date_revision field', () => {
      const testDate = '2024-06-15';
      component.frmProduct.patchValue({ date_release: testDate });
      (Utils.formatDateToYYYYMMDD as jest.Mock).mockReturnValue('2025-06-16');

      component.dateValidation();

      expect(component.frmProduct.value.date_revision).toBe('2025-06-16');
    });
  });

  describe('save method', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('id', 0);
    });

    it('should not save when form is invalid', () => {
      component.frmProduct.patchValue({ id: '' }); // Invalid form

      component.save();

      expect(swBancoService.saveProduct).not.toHaveBeenCalled();
      expect(swBancoService.updateProduct).not.toHaveBeenCalled();
    });

    it('should save new product when id is 0', () => {
      // Set valid form values
      component.frmProduct.patchValue({
        id: 'TEST123',
        name: 'Test Product Name',
        description: 'Test product description',
        logo: 'test-logo.png',
        date_release: '2024-05-01',
        date_revision: '2025-05-01',
      });

      const mockSaveResponse: IResponse<ICreditCard> = {
        data: mockProduct,
        message: 'Success',
      };

      swBancoService.saveProduct.mockReturnValue(of(mockSaveResponse));

      component.save();

      expect(swBancoService.saveProduct).toHaveBeenCalledWith(
        component.frmProduct.value
      );
    });

    it('should navigate to list after successful save', () => {
      // Set valid form values
      component.frmProduct.patchValue({
        id: 'TEST123',
        name: 'Test Product Name',
        description: 'Test product description',
        logo: 'test-logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01',
      });

      const mockSaveResponse: IResponse<ICreditCard> = {
        data: mockProduct,
        message: 'Success',
      };

      swBancoService.saveProduct.mockReturnValue(of(mockSaveResponse));

      component.save();

      expect(router.navigate).toHaveBeenCalledWith(['/list']);
      expect(component.isSave()).toBe(false);
    });

    it('should update existing product when id is not 0', () => {
      fixture.componentRef.setInput('id', 'TEST123');

      // Set valid form values
      component.frmProduct.patchValue({
        id: 'TEST123',
        name: 'Updated Product Name',
        description: 'Updated product description',
        logo: 'updated-logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01',
      });

      const mockUpdateResponse: IResponse<ICreditCard> = {
        data: mockProduct,
        message: 'Success',
      };

      swBancoService.updateProduct.mockReturnValue(of(mockUpdateResponse));

      component.save();

      expect(swBancoService.updateProduct).toHaveBeenCalledWith(
        'TEST123',
        component.frmProduct.value
      );
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('id', 0);
    });

    it('should calculate fechaFuture correctly', () => {
      const currentDate = new Date('2025-07-17');
      component.fechaActual.set(currentDate);

      const futureDate = component.fechaFuture();

      expect(futureDate.getFullYear()).toBe(2026);
    });
  });
});
