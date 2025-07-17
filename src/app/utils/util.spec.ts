import { Utils } from './utils';
import { ICreditCard } from '../interfaces/IProducts.interface';

describe('Utils', () => {
  describe('CapitalLeters', () => {
    it('debe devolver las iniciales en mayúscula de cada palabra separada por guion', () => {
      expect(Utils.CapitalLeters('banco-visa')).toBe('BV');
      expect(Utils.CapitalLeters('sofka-bank')).toBe('SB');
      expect(Utils.CapitalLeters('tarjeta-master-card')).toBe('TMC');
    });
  });

  describe('formatDateToYYYYMMDD', () => {
    it('debe formatear la fecha correctamente', () => {
      const date = new Date('2024-06-01');
      expect(Utils.formatDateToYYYYMMDD(date)).toBe('2024-06-01');
    });

    it('debe lanzar un error si el parámetro no es una instancia de Date', () => {
      // @ts-expect-error
      expect(() => Utils.formatDateToYYYYMMDD('2024-06-01')).toThrow(
        'El parámetro debe ser una instancia de Date.'
      );
    });
  });

  describe('filterProducts', () => {
    const products: ICreditCard[] = [
      {
        id: '1',
        name: 'Visa Oro',
        description: 'Tarjeta dorada',
        logo: 'logo1.png',
        date_release: '2024-01-01',
        date_revision: '2024-06-01',
      },
      {
        id: '2',
        name: 'MasterCard Black',
        description: 'Tarjeta negra',
        logo: 'logo2.png',
        date_release: '2023-05-10',
        date_revision: '2024-05-10',
      },
    ];

    it('debe filtrar por nombre', () => {
      const result = Utils.filterProducts(products, 'visa');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Visa Oro');
    });

    it('debe filtrar por descripción', () => {
      const result = Utils.filterProducts(products, 'negra');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('MasterCard Black');
    });

    it('debe filtrar por id', () => {
      const result = Utils.filterProducts(products, '2');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('debe filtrar por fecha de revisión', () => {
      const result = Utils.filterProducts(products, '2024-06-01');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Visa Oro');
    });

    it('debe devolver un array vacío si no hay coincidencias', () => {
      const result = Utils.filterProducts(products, 'no-existe');
      expect(result).toHaveLength(0);
    });
  });
});
