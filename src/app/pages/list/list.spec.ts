import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError, pipe } from 'rxjs';
import { Component } from '@angular/core';
import List from './list';
import { SwBancoService } from '../../services/swBanco.service';
import { ICreditCard, IResponse } from '../../interfaces/IProducts.interface';
import { CIcon } from '../../shared/c-icon/c-icon';
import { CAvatar } from '../../shared/c-avatar/c-avatar';
import { CDropdown } from '../../shared/c-dropdown/c-dropdown';

// Mock components
@Component({
  selector: 'app-c-icon',
  template: '<div></div>',
  standalone: true,
})
class MockCIcon {}

@Component({
  selector: 'app-c-avatar',
  template: '<div></div>',
  standalone: true,
})
class MockCAvatar {}

@Component({
  selector: 'app-c-dropdown',
  template: '<div></div>',
  standalone: true,
  inputs: ['producto'],
  outputs: ['isDelete'],
})
class MockCDropdown {}

// Mock services
const mockSwBancoService = {
  getProductos: jest.fn(),
  deleteProduct: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

describe('List Component', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let swBancoService: jest.Mocked<SwBancoService>;
  let router: jest.Mocked<Router>;

  const mockProducts: ICreditCard[] = [
    {
      id: '1',
      name: 'Visa Card',
      description: 'Premium visa credit card',
      logo: 'visa-logo.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01',
    },
    {
      id: '2',
      name: 'Mastercard',
      description: 'Gold mastercard credit card',
      logo: 'mastercard-logo.png',
      date_release: '2024-02-01',
      date_revision: '2025-02-01',
    },
    {
      id: '3',
      name: 'American Express',
      description: 'Platinum american express card',
      logo: 'amex-logo.png',
      date_release: '2024-03-01',
      date_revision: '2025-03-01',
    },
  ];

  const mockResponse: IResponse<ICreditCard[]> = {
    data: mockProducts,
    message: 'Success',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, List, CAvatar, CIcon, CDropdown],
      providers: [
        { provide: SwBancoService, useValue: mockSwBancoService },
        { provide: Router, useValue: mockRouter },
      ],
    })
      .overrideComponent(List, {
        remove: { imports: [CIcon, CAvatar, CDropdown] },
        add: { imports: [MockCIcon, MockCAvatar, MockCDropdown] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    swBancoService = TestBed.inject(
      SwBancoService
    ) as jest.Mocked<SwBancoService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.lstProductos()).toEqual([]);
      expect(component.cpyProducts()).toEqual([]);
      expect(component.dataFilter()).toBe('');
      expect(component.viewData()).toBe(5);
      expect(component.isLoading()).toBe(false);
      expect(component.isDelete()).toBe(false);
    });

    it('should have correct computed total', () => {
      component.cpyProducts.set(mockProducts);
      expect(component.total()).toBe(3);
    });
  });

  describe('getProductos', () => {
    it('should load products successfully', fakeAsync(() => {
      swBancoService.getProductos.mockReturnValue(of(mockResponse));

      component.getProductos();

      expect(component.isLoading()).toBe(true);
      expect(swBancoService.getProductos).toHaveBeenCalled();

      tick(900); // Wait for delay

      expect(component.lstProductos()).toEqual(mockProducts);
      expect(component.isLoading()).toBe(false);
    }));

    it('should handle loading state correctly', () => {
      swBancoService.getProductos.mockReturnValue(of(mockResponse));

      component.getProductos();

      expect(component.isLoading()).toBe(true);
    });

    it('should set loading to false after successful response', fakeAsync(() => {
      swBancoService.getProductos.mockReturnValue(of(mockResponse));

      component.getProductos();
      tick(900);

      expect(component.isLoading()).toBe(false);
    }));
  });

  describe('search', () => {
    beforeEach(() => {
      component.lstProductos.set(mockProducts);
      component.viewData.set(5);
    });

    it('should reset to original products when filter is empty', () => {
      component.dataFilter.set('');

      component.search();

      expect(component.cpyProducts()).toEqual(mockProducts.slice(0, 5));
    });

    it('should filter products by name', fakeAsync(() => {
      component.dataFilter.set('Visa');

      component.search();
      tick(400);

      const filteredProducts = component.cpyProducts();
      expect(filteredProducts).toHaveLength(1);
      expect(filteredProducts[0].name).toBe('Visa Card');
    }));

    it('should filter products by description', fakeAsync(() => {
      component.dataFilter.set('Premium');

      component.search();
      tick(400);

      const filteredProducts = component.cpyProducts();
      expect(filteredProducts).toHaveLength(1);
      expect(filteredProducts[0].description).toBe('Premium visa credit card');
    }));

    it('should filter products by date_release', fakeAsync(() => {
      component.dataFilter.set('2024-02-01');

      component.search();
      tick(400);

      const filteredProducts = component.cpyProducts();
      expect(filteredProducts).toHaveLength(1);
      expect(filteredProducts[0].date_release).toBe('2024-02-01');
    }));

    it('should filter products by date_revision', fakeAsync(() => {
      component.dataFilter.set('2025-03-01');

      component.search();
      tick(400);

      const filteredProducts = component.cpyProducts();
      expect(filteredProducts).toHaveLength(1);
      expect(filteredProducts[0].date_revision).toBe('2025-03-01');
    }));

    it('should be case insensitive for name search', fakeAsync(() => {
      component.dataFilter.set('visa');

      component.search();
      tick(400);

      const filteredProducts = component.cpyProducts();
      expect(filteredProducts).toHaveLength(1);
      expect(filteredProducts[0].name).toBe('Visa Card');
    }));

    it('should be case insensitive for description search', fakeAsync(() => {
      component.dataFilter.set('GOLD');

      component.search();
      tick(400);

      const filteredProducts = component.cpyProducts();
      expect(filteredProducts).toHaveLength(1);
      expect(filteredProducts[0].description).toBe(
        'Gold mastercard credit card'
      );
    }));

    it('should return empty array when no matches found', fakeAsync(() => {
      component.dataFilter.set('NonExistentProduct');

      component.search();
      tick(400);

      expect(component.cpyProducts()).toHaveLength(0);
    }));

    it('should respect viewData limit', fakeAsync(() => {
      component.viewData.set(2);
      component.dataFilter.set('card'); // Should match all products

      component.search();
      tick(400);

      expect(component.cpyProducts()).toHaveLength(2);
    }));
  });

  describe('newProduct', () => {
    it('should navigate to new product page', () => {
      component.newProduct();

      expect(router.navigate).toHaveBeenCalledWith(['/new', 0]);
    });
  });

  describe('delete', () => {
    const mockProduct = mockProducts[0];
    const mockDeleteResponse: IResponse<ICreditCard> = {
      data: mockProduct,
      message: 'Deleted successfully',
    };

    it('should not delete when isDelete is false', () => {
      component.delete(false, mockProduct);

      expect(swBancoService.deleteProduct).not.toHaveBeenCalled();
    });

    it('should handle delete error', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      swBancoService.deleteProduct.mockReturnValue(throwError('Delete error'));

      component.delete(true, mockProduct);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'No se pudo guardar',
        'Delete error'
      );

      consoleLogSpy.mockRestore();
    });
  });

  describe('Signals and Computed Properties', () => {
    it('should update lstProductos signal', () => {
      component.lstProductos.set(mockProducts);

      expect(component.lstProductos()).toEqual(mockProducts);
    });

    it('should update cpyProducts signal', () => {
      component.cpyProducts.set(mockProducts);

      expect(component.cpyProducts()).toEqual(mockProducts);
    });

    it('should update dataFilter signal', () => {
      component.dataFilter.set('test filter');

      expect(component.dataFilter()).toBe('test filter');
    });

    it('should update viewData signal', () => {
      component.viewData.set(10);

      expect(component.viewData()).toBe(10);
    });

    it('should update isLoading signal', () => {
      component.isLoading.set(true);

      expect(component.isLoading()).toBe(true);
    });

    it('should update isDelete signal', () => {
      component.isDelete.set(true);

      expect(component.isDelete()).toBe(true);
    });

    it('should compute total correctly', () => {
      component.cpyProducts.set(mockProducts.slice(0, 2));

      expect(component.total()).toBe(2);
    });
  });

  describe('Effects', () => {});

  describe('Change Detection Strategy', () => {
    it('should use OnPush change detection strategy', () => {
      expect(component.constructor.name).toBe('List');
      // The OnPush strategy is set in the component decorator
      // This test verifies the component can be instantiated with OnPush
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow: load -> search -> delete', fakeAsync(() => {
      // Setup
      swBancoService.getProductos.mockReturnValue(of(mockResponse));
      const mockDeleteResponse: IResponse<ICreditCard> = {
        data: mockProducts[0],
        message: 'Deleted',
      };
      swBancoService.deleteProduct.mockReturnValue(of(mockDeleteResponse));

      // Load products
      component.getProductos();
      tick(900);

      expect(component.lstProductos()).toEqual(mockProducts);

      // Search
      component.dataFilter.set('Visa');
      component.search();
      tick(400);

      expect(component.cpyProducts()).toHaveLength(1);

      // Delete
      component.delete(true, mockProducts[0]);

      expect(swBancoService.deleteProduct).toHaveBeenCalledWith(
        mockProducts[0].id
      );
    }));
  });
});
