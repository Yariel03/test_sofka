import List from './list';
import { SwBancoService } from '../../services/swBanco.service';
import { ICreditCard, IResponse } from '../../interfaces/IProducts.interface';
import { of } from 'rxjs';

describe('List (Jest)', () => {
  let component: List;
  let swBancoServiceMock: jest.Mocked<SwBancoService>;

  beforeEach(() => {
    swBancoServiceMock = {
      getProductos: jest.fn(),
    } as any;
    component = new List();
    (component as any).swBancoService = swBancoServiceMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe llamar a getProductos y actualizar lstProductos en ngOnInit', () => {
    const mockData: ICreditCard[] = [
      {
        id: '1',
        name: 'Visa',
        description: 'desc',
        logo: 'logo',
        date_release: '2024-01-01',
        date_revision: '2024-06-01',
      },
    ];
    const mockResponse: IResponse<ICreditCard[]> = { data: mockData };
    swBancoServiceMock.getProductos.mockReturnValue(of(mockResponse));
    const setSpy = jest.spyOn(component.lstProductos, 'set');
    component.ngOnInit();
    expect(swBancoServiceMock.getProductos).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalledWith(mockData);
  });
});
