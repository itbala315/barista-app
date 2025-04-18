import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryComponent } from './inventory.component';
import { BaristaService } from '../../services/barista.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { DEFAULT_INGREDIENTS } from '../../models/ingredient.model';
import { signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DrinkMenuService } from '../../services/drink-menu.service';

describe('InventoryComponent', () => {
  let component: InventoryComponent;
  let fixture: ComponentFixture<InventoryComponent>;
  let mockBaristaService: jasmine.SpyObj<BaristaService>;

  beforeEach(async () => {
    mockBaristaService = jasmine.createSpyObj('BaristaService', ['restockIngredients'], {
      ingredients: signal(DEFAULT_INGREDIENTS)
    });

    await TestBed.configureTestingModule({
      imports: [InventoryComponent, AsyncPipe, CurrencyPipe, HttpClientTestingModule],
      providers: [
        { provide: BaristaService, useValue: mockBaristaService },
        DrinkMenuService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all ingredients', () => {
    const ingredients = mockBaristaService.ingredients();
    const ingredientElements = fixture.nativeElement.querySelectorAll('[data-test-id="ingredient-item"]');
    expect(ingredientElements.length).toBe(ingredients.length);
  });

  it('should display ingredient details', () => {
    const ingredients = mockBaristaService.ingredients();
    const firstIngredient = ingredients[0];
    
    const ingredientElements = fixture.nativeElement.querySelectorAll('[data-test-id="ingredient-item"]');
    const ingredientElement = ingredientElements[0];
    expect(ingredientElement.textContent).toContain(firstIngredient.name);
    expect(ingredientElement.textContent).toContain(firstIngredient.stock.toString());
    expect(ingredientElement.textContent).toContain(firstIngredient.cost.toString());
  });

  it('should handle restock', () => {
    const restockButton = fixture.nativeElement.querySelector('[data-test-id="restock-button"]');
    restockButton.click();
    expect(mockBaristaService.restockIngredients).toHaveBeenCalled();
  });
});