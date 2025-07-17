import { CAvatar } from './c-avatar';
import { Utils } from '../../utils/utils';

describe('CAvatar (Jest)', () => {
  let component: CAvatar;

  beforeEach(() => {
    component = new CAvatar();
  });

  it('debe asignar el resultado de Utils.CapitalLeters a avatarUrl si avatar tiene valor', () => {
    const spy = jest.spyOn(Utils, 'CapitalLeters').mockReturnValue('AB');
    component.avatar = 'algo-bueno';
    expect(spy).toHaveBeenCalledWith('algo-bueno');
    expect(component.avatarUrl).toBe('AB');
    spy.mockRestore();
  });

  it('debe asignar "NA" a avatarUrl si avatar es vacío', () => {
    component.avatar = '';
    expect(component.avatarUrl).toBe('NA');
  });

  it('debe asignar "NA" a avatarUrl si avatar es null', () => {
    // @ts-ignore
    component.avatar = null;
    expect(component.avatarUrl).toBe('NA');
  });
});
