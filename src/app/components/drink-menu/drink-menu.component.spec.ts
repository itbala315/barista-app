import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrinkMenuComponent } from './drink-menu.component';
import { BaristaService } from '../../services/barista.service';
import { DrinkMenuService } from '../../services/drink-menu.service';
import { PLATFORM_ID } from '@angular/core';
import { signal } from '@angular/core';
import { DEFAULT_DRINKS } from '../../models/drink.model';
import { DEFAULT_INGREDIENTS } from '../../models/ingredient.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';

describe('DrinkMenuComponent', () => {
  let component: DrinkMenuComponent;
  let fixture: ComponentFixture<DrinkMenuComponent>;
  let mockBaristaService: jasmine.SpyObj<BaristaService>;
  let mockDrinkMenuService: jasmine.SpyObj<DrinkMenuService>;

  beforeEach(async () => {
    mockBaristaService = jasmine.createSpyObj('BaristaService', ['dispenseDrink'], {
      drinks: signal(DEFAULT_DRINKS),
      ingredients: signal(DEFAULT_INGREDIENTS)
    });

    mockDrinkMenuService = jasmine.createSpyObj('DrinkMenuService', ['deleteDrink'], {
      drinks: signal(DEFAULT_DRINKS)
    });

    await TestBed.configureTestingModule({
      imports: [
        DrinkMenuComponent,
        HttpClientTestingModule,
        NgFor,
        NgIf,
        NgClass,
        CurrencyPipe
      ],
      providers: [
        { provide: BaristaService, useValue: mockBaristaService },
        { provide: DrinkMenuService, useValue: mockDrinkMenuService },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DrinkMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all drinks', () => {
    const drinks = mockDrinkMenuService.drinks();
    const drinkElements = fixture.nativeElement.querySelectorAll('.drink-item');
    expect(drinkElements.length).toBe(drinks.length);
  });

  it('should call dispenseDrink when ordering a drink', () => {
    const drinkId = 'coffee';
    component.orderDrink(drinkId);
    expect(mockBaristaService.dispenseDrink).toHaveBeenCalledWith(drinkId);
  });

  it('should toggle recipe visibility', () => {
    const drinkId = 'coffee';
    expect(component.expandedDrinkId()).toBeNull();
    
    component.toggleRecipe(drinkId);
    expect(component.expandedDrinkId()).toBe(drinkId);
    
    component.toggleRecipe(drinkId);
    expect(component.expandedDrinkId()).toBeNull();
  });

  it('should toggle custom drinks visibility', () => {
    expect(component.showCustomDrinks()).toBeFalse();
    
    component.toggleShowCustomDrinks();
    expect(component.showCustomDrinks()).toBeTrue();
    
    component.toggleShowCustomDrinks();
    expect(component.showCustomDrinks()).toBeFalse();
  });

  it('should dispatch create-new-drink event', () => {
    spyOn(window, 'dispatchEvent');
    
    component.createNewDrink();
    
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      jasmine.any(CustomEvent)
    );
    const event = (window.dispatchEvent as jasmine.Spy).calls.first().args[0] as CustomEvent;
    expect(event.type).toBe('create-new-drink');
  });

  it('should dispatch edit-drink event', () => {
    spyOn(window, 'dispatchEvent');
    const testDrink = DEFAULT_DRINKS[0];
    const mockEvent = new MouseEvent('click');
    mockEvent.stopPropagation = jasmine.createSpy();
    
    component.editDrink(testDrink, mockEvent);
    
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      jasmine.any(CustomEvent)
    );
    const event = (window.dispatchEvent as jasmine.Spy).calls.first().args[0] as CustomEvent;
    expect(event.type).toBe('edit-drink');
    expect(event.detail.drink).toBe(testDrink);
  });

  it('should get ingredient name correctly', () => {
    const ingredientId = 'coffee';
    const ingredients = DEFAULT_INGREDIENTS;
    
    const result = component.getIngredientName(ingredientId, ingredients);
    
    expect(result).toBe('Coffee');
  });

  it('should return "Unknown Ingredient" for invalid ingredient id', () => {
    const ingredientId = 'invalid';
    const ingredients = DEFAULT_INGREDIENTS;
    
    const result = component.getIngredientName(ingredientId, ingredients);
    
    expect(result).toBe('Unknown Ingredient');
  });

  it('should handle delete drink', () => {
    const drinkId = 'test_drink';
    const mockEvent = new MouseEvent('click');
    mockEvent.stopPropagation = jasmine.createSpy();

    component.deleteDrink(drinkId, mockEvent);
    component.confirmDelete();
    
    expect(mockDrinkMenuService.deleteDrink).toHaveBeenCalledWith(drinkId);
  });

  it('should handle delete drink cancellation', () => {
    const drinkId = 'test_drink';
    const mockEvent = new MouseEvent('click');
    mockEvent.stopPropagation = jasmine.createSpy();

    component.deleteDrink(drinkId, mockEvent);
    component.cancelDelete();
    
    expect(mockDrinkMenuService.deleteDrink).not.toHaveBeenCalled();
  });
});