import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SwBancoService } from './swBanco.service';
import { ICreditCard, IResponse } from '../interfaces/IProducts.interface';
import { environment } from '../../environments/environment';

describe('SwBancoService', () => {
  let service: SwBancoService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.SERVER_URL;

  // Mock data
  const mockCreditCard: ICreditCard = {
    id: '1',
    name: 'Test Card',
    description: 'Test Description',
    logo: 'test-logo.png',
    date_release: '2024-01-01',
    date_revision: '2025-01-01',
  };

  const mockResponse: IResponse<ICreditCard[]> = {
    data: [mockCreditCard],
    message: 'Success',
  };

  const mockSingleResponse: IResponse<ICreditCard> = {
    data: mockCreditCard,
    message: 'Success',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SwBancoService],
    });

    service = TestBed.inject(SwBancoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct SERVER URL', () => {
    expect(service.SERVER).toBe(environment.SERVER_URL);
  });

  describe('getProductos', () => {
    it('should return an Observable<IResponse<ICreditCard[]>>', () => {
      service.getProductos().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.data).toHaveLength(1);
        expect(response.data[0]).toEqual(mockCreditCard);
      });

      const req = httpMock.expectOne(`${baseUrl}/bp/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error when getting products', () => {
      const errorMessage = 'Error getting products';

      service.getProductos().subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/bp/products`);
      req.flush(errorMessage, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('getProduct', () => {
    it('should return a single product by id', () => {
      const productId = '1';

      service.getProduct(productId).subscribe((product) => {
        expect(product).toEqual(mockCreditCard);
      });

      const req = httpMock.expectOne(`${baseUrl}/bp/products/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCreditCard);
    });

    it('should handle error when getting single product', () => {
      const productId = '999';

      service.getProduct(productId).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/bp/products/${productId}`);
      req.flush('Product not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('validationId', () => {
    it('should validate product id', () => {
      const productId = '1';

      service.validationId(productId).subscribe((response) => {
        expect(response).toEqual(mockSingleResponse);
      });

      const req = httpMock.expectOne(
        `${baseUrl}/bp/products/verification/${productId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockSingleResponse);
    });

    it('should handle validation error', () => {
      const productId = 'invalid-id';

      service.validationId(productId).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(
        `${baseUrl}/bp/products/verification/${productId}`
      );
      req.flush('Invalid ID', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('saveProduct', () => {
    it('should save a new product', () => {
      service.saveProduct(mockCreditCard).subscribe((response) => {
        expect(response).toEqual(mockSingleResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/bp/products`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreditCard);
      req.flush(mockSingleResponse);
    });

    it('should handle save error', () => {
      service.saveProduct(mockCreditCard).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/bp/products`);
      req.flush('Validation error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by string id', () => {
      const productId = '1';

      service.deleteProduct(productId).subscribe((response) => {
        expect(response).toEqual(mockSingleResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/bp/products/${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockSingleResponse);
    });

    it('should delete a product by number id', () => {
      const productId = 1;

      service.deleteProduct(productId).subscribe((response) => {
        expect(response).toEqual(mockSingleResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/bp/products/${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockSingleResponse);
    });

    it('should handle delete error', () => {
      const productId = '999';

      service.deleteProduct(productId).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/bp/products/${productId}`);
      req.flush('Product not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateProduct', () => {
    it('should update a product with string id', () => {
      const productId = '1';
      const updatedProduct = { ...mockCreditCard, name: 'Updated Card' };

      service.updateProduct(productId, updatedProduct).subscribe((response) => {
        expect(response).toEqual(mockSingleResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/bp/products/${productId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush(mockSingleResponse);
    });

    it('should update a product with number id', () => {
      const productId = 1;
      const updatedProduct = { ...mockCreditCard, name: 'Updated Card' };

      service.updateProduct(productId, updatedProduct).subscribe((response) => {
        expect(response).toEqual(mockSingleResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/bp/products/${productId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush(mockSingleResponse);
    });

    it('should handle update error', () => {
      const productId = '999';
      const updatedProduct = { ...mockCreditCard, name: 'Updated Card' };

      service.updateProduct(productId, updatedProduct).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/bp/products/${productId}`);
      req.flush('Product not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('HTTP Request Headers', () => {
    it('should make requests with default headers', () => {
      service.getProductos().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/bp/products`);
      expect(req.request.headers.get('Content-Type')).toBe(null); // Default behavior
      req.flush(mockResponse);
    });
  });
});
