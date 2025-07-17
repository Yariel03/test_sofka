import { SwBancoService } from './swBanco.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ICreditCard, IResponse } from '../interfaces/IProducts.interface';
import { environment } from '../../environments/environment';

jest.mock('@angular/common/http');

describe('SwBancoService (Jest)', () => {
  let service: SwBancoService;
  let httpClientMock: jest.Mocked<HttpClient>;
  const SERVER = environment.SERVER_URL;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as any;
    service = new SwBancoService();
    // @ts-ignore
    service._http = httpClientMock;
    service.SERVER = SERVER;
  });

  it('debe obtener todos los productos', (done) => {
    const mockResponse: IResponse<ICreditCard[]> = { data: [], message: 'ok' };
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.getProductos().subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClientMock.get).toHaveBeenCalledWith(`${SERVER}/bp/products`);
      done();
    });
  });

  it('debe obtener un producto por id', (done) => {
    const mockResponse: IResponse<ICreditCard> = {
      data: {} as ICreditCard,
      message: 'ok',
    };
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.getProduct('123').subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${SERVER}/bp/products/123`
      );
      done();
    });
  });

  it('debe validar un id', (done) => {
    const mockResponse: IResponse<ICreditCard> = {
      data: {} as ICreditCard,
      message: 'ok',
    };
    httpClientMock.get.mockReturnValue(of(mockResponse));
    service.validationId('123').subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${SERVER}/bp/products/verification/123`
      );
      done();
    });
  });

  it('debe guardar un producto', (done) => {
    const product = { id: '1' } as ICreditCard;
    const mockResponse: IResponse<ICreditCard> = {
      data: product,
      message: 'ok',
    };
    httpClientMock.post.mockReturnValue(of(mockResponse));
    service.saveProduct(product).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClientMock.post).toHaveBeenCalledWith(
        `${SERVER}/bp/products`,
        product
      );
      done();
    });
  });

  it('debe eliminar un producto', (done) => {
    const mockResponse: IResponse<ICreditCard> = {
      data: {} as ICreditCard,
      message: 'ok',
    };
    httpClientMock.delete.mockReturnValue(of(mockResponse));
    service.deleteProduct('1').subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClientMock.delete).toHaveBeenCalledWith(
        `${SERVER}/bp/products/1`
      );
      done();
    });
  });

  it('debe actualizar un producto', (done) => {
    const product = { id: '1' } as ICreditCard;
    const mockResponse: IResponse<ICreditCard> = {
      data: product,
      message: 'ok',
    };
    httpClientMock.put.mockReturnValue(of(mockResponse));
    service.updateProduct(product).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClientMock.put).toHaveBeenCalledWith(
        `${SERVER}/bp/products/1`,
        product
      );
      done();
    });
  });
});
