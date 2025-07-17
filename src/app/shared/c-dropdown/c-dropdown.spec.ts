import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { CDropdown } from './c-dropdown';
import { CModal } from '../c-modal/c-modal';
import { ICreditCard } from '../../interfaces/IProducts.interface';

// Mock del componente CModal
@Component({
  selector: 'app-c-modal',
  template: '<div></div>',
  standalone: true,
})
class MockCModal {
  // Simular propiedades del modal si es necesario
}

// Componente host para testing
@Component({
  template: `
    <app-c-dropdown [producto]="mockProduct" (isDelete)="onDelete($event)">
    </app-c-dropdown>
  `,
  standalone: true,
  imports: [CDropdown],
})
class TestHostComponent {
  mockProduct: ICreditCard = {
    id: '1',
    name: 'Test Credit Card',
    description: 'Test Description',
    logo: 'test-logo.png',
    date_release: '2024-01-01',
    date_revision: '2025-01-01',
  };

  deleteEmitted = false;

  onDelete(isDelete: boolean): void {
    this.deleteEmitted = isDelete;
  }
}

describe('CDropdown', () => {
  let component: CDropdown;
  let fixture: ComponentFixture<CDropdown>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, CDropdown],
      providers: [],
    })
      .overrideComponent(CDropdown, {
        remove: { imports: [CModal] },
        add: { imports: [MockCModal] },
      })
      .compileComponents();

    // Setup para pruebas individuales del componente
    fixture = TestBed.createComponent(CDropdown);
    component = fixture.componentInstance;

    // Setup para pruebas con host component
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      // Necesitamos setear el input requerido
      fixture.componentRef.setInput('producto', {
        id: '1',
        name: 'Test Card',
        description: 'Test Description',
        logo: 'test-logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01',
      });

      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      fixture.componentRef.setInput('producto', hostComponent.mockProduct);

      expect(component.showMenu).toBe(false);
      expect(component.stateModal).toBe(false);
    });
  });

  describe('Input Properties', () => {
    it('should receive producto input correctly', () => {
      fixture.componentRef.setInput('producto', hostComponent.mockProduct);
      fixture.detectChanges();

      expect(component.producto()).toEqual(hostComponent.mockProduct);
    });
  });

  describe('toggleMenu', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('producto', hostComponent.mockProduct);
    });

    it('should toggle showMenu from false to true', () => {
      component.showMenu = false;

      component.toggleMenu();

      expect(component.showMenu).toBe(true);
    });

    it('should toggle showMenu from true to false', () => {
      component.showMenu = true;

      component.toggleMenu();

      expect(component.showMenu).toBe(false);
    });

    it('should toggle showMenu multiple times', () => {
      expect(component.showMenu).toBe(false);

      component.toggleMenu();
      expect(component.showMenu).toBe(true);

      component.toggleMenu();
      expect(component.showMenu).toBe(false);

      component.toggleMenu();
      expect(component.showMenu).toBe(true);
    });
  });

  describe('HostListener - onDocumentClick', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('producto', hostComponent.mockProduct);
      fixture.detectChanges();
    });

    it('should close menu when clicking outside the element', () => {
      component.showMenu = true;

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement });

      component.onDocumentClick(event);

      expect(component.showMenu).toBe(false);

      document.body.removeChild(outsideElement);
    });

    it('should not close menu when clicking inside the element', () => {
      component.showMenu = true;

      const insideElement =
        fixture.nativeElement.querySelector('div') || fixture.nativeElement;
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: insideElement });

      component.onDocumentClick(event);

      expect(component.showMenu).toBe(true);
    });

    it('should handle click event when menu is already closed', () => {
      component.showMenu = false;

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement });

      component.onDocumentClick(event);

      expect(component.showMenu).toBe(false);

      document.body.removeChild(outsideElement);
    });
  });

  describe('openModal', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('producto', hostComponent.mockProduct);
    });

    it('should set stateModal to true', () => {
      component.stateModal = false;

      component.openModal();

      expect(component.stateModal).toBe(true);
    });

    it('should set stateModal to true when already true', () => {
      component.stateModal = true;

      component.openModal();

      expect(component.stateModal).toBe(true);
    });
  });

  describe('closeModal', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('producto', hostComponent.mockProduct);
    });

    it('should reset stateModal and showMenu to false', () => {
      component.stateModal = true;
      component.showMenu = true;

      component.closeModal(true);

      expect(component.stateModal).toBe(false);
      expect(component.showMenu).toBe(false);
    });
  });
});
