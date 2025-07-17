import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CAvatar } from './c-avatar';
import { Utils } from '../../utils/utils';

// Mock de Utils
jest.mock('../../utils/utils', () => ({
  Utils: {
    CapitalLeters: jest.fn((value: string) => value.toUpperCase()),
  },
}));

describe('CAvatar', () => {
  let component: CAvatar;
  let fixture: ComponentFixture<CAvatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
    }).compileComponents();

    fixture = TestBed.createComponent(CAvatar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set avatarUrl to capitalized value when avatar input is provided', () => {
    component.avatar = 'test avatar';
    expect(Utils.CapitalLeters).toHaveBeenCalledWith('test avatar');
    expect(component.avatarUrl).toBe('TEST AVATAR');
  });

  it('should set avatarUrl to "NA" when avatar input is empty', () => {
    component.avatar = '';
    expect(component.avatarUrl).toBe('NA');
  });
});
