import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CModal } from './c-modal';
import { SwBancoService } from '../../services/swBanco.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { input } from '@angular/core';
import { ICreditCard } from '../../interfaces/IProducts.interface';

// Mock del servicio SwBancoService
const mockSwBancoService = {
  // Agrega métodos o propiedades necesarias del servicio si se usan
};

// Mock del Router
const mockRouter = {
  navigate: jest.fn(),
};

describe('CModal', () => {
  let component: CModal;
  let fixture: ComponentFixture<CModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [
        { provide: SwBancoService, useValue: mockSwBancoService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update isVisible when abrir input changes via effect', () => {
    // Simular cambio en el input 'abrir' usando setInput
    fixture.componentRef.setInput('abrir', true);
    fixture.detectChanges();
    expect(component.isVisible).toBe(true);

    fixture.componentRef.setInput('abrir', false);
    fixture.detectChanges();
    expect(component.isVisible).toBe(false);
  });

  it('should set isVisible to true when open is called', () => {
    component.isVisible = false;
    component.open();
    expect(component.isVisible).toBe(true);
  });

  it('should set isVisible to false when close is called', () => {
    component.isVisible = true;
    component.close();
    expect(component.isVisible).toBe(false);
  });

  it('should emit isDelete event and close modal when delete is called', () => {
    let emittedValue: boolean | undefined;
    component.isDelete.subscribe((value) => (emittedValue = value));

    component.isVisible = true;
    component.delete();

    expect(emittedValue).toBe(true);
    expect(component.isVisible).toBe(false);
  });

});