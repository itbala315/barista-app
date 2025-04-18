import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DispenserComponent } from './dispenser.component';
import { BaristaService } from '../../services/barista.service';
import { signal, WritableSignal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgIf } from '@angular/common';

describe('DispenserComponent', () => {
  let component: DispenserComponent;
  let fixture: ComponentFixture<DispenserComponent>;
  let mockBaristaService: jasmine.SpyObj<BaristaService>;
  let dispensingDrinkSignal: WritableSignal<string | null>;

  beforeEach(async () => {
    dispensingDrinkSignal = signal('coffee');
    mockBaristaService = jasmine.createSpyObj('BaristaService', [], {
      dispensingDrink: dispensingDrinkSignal
    });

    await TestBed.configureTestingModule({
      imports: [DispenserComponent, HttpClientTestingModule, NgIf],
      providers: [
        { provide: BaristaService, useValue: mockBaristaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DispenserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show dispensing message when a drink is being dispensed', () => {
    fixture.detectChanges();
    const dispenserElement = fixture.nativeElement.querySelector('.dispenser-message');
    expect(dispenserElement).toBeTruthy();
    expect(dispenserElement.textContent).toContain('Dispensing');
  });

  it('should not show message when no drink is being dispensed', () => {
    dispensingDrinkSignal.set(null);
    fixture.detectChanges();
    const dispenserElement = fixture.nativeElement.querySelector('.dispenser-message');
    expect(dispenserElement).toBeNull();
  });
});