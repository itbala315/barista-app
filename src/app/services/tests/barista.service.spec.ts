import { TestBed } from '@angular/core/testing';
import { BaristaService } from '../barista.service';
import { INITIAL_STOCK } from '../../models/ingredient.model';
import { Ingredient } from '../../models/ingredient.model';
import { DrinkMenuService } from '../drink-menu.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { DEFAULT_DRINKS } from '../../models/drink.model';

describe('BaristaService', () => {
  let service: BaristaService;
  let mockDrinkMenuService: jasmine.SpyObj<DrinkMenuService>;

  beforeEach(() => {
    mockDrinkMenuService = jasmine.createSpyObj('DrinkMenuService', ['getDrinkById'], {
      drinks: signal(DEFAULT_DRINKS)
    });
    mockDrinkMenuService.getDrinkById.and.returnValue(DEFAULT_DRINKS[0]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BaristaService,
        { provide: DrinkMenuService, useValue: mockDrinkMenuService }
      ]
    });
    service = TestBed.inject(BaristaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize ingredients with default stock', () => {
    const ingredients = service.ingredients();
    expect(ingredients.length).toBeGreaterThan(0);
    expect(ingredients.every(ingredient => ingredient.stock === INITIAL_STOCK)).toBeTrue();
  });

  it('should correctly list available drinks', () => {
    const drinks = service.drinks();
    expect(drinks.length).toBeGreaterThan(0);

    const coffee = drinks.find(drink => drink.id === 'coffee');
    expect(coffee).toBeTruthy();
    expect(coffee?.available).toBeTrue();

    const cappuccino = drinks.find(drink => drink.id === 'cappuccino');
    expect(cappuccino).toBeTruthy();
    expect(cappuccino?.available).toBeTrue();
  });

  it('should update ingredient stock when dispensing a drink', () => {
    const testDrink = {
      id: 'test_coffee',
      name: 'Test Coffee',
      recipe: [
        { ingredientId: 'coffee', quantity: 3 },
        { ingredientId: 'sugar', quantity: 1 },
        { ingredientId: 'cream', quantity: 1 }
      ]
    };
    mockDrinkMenuService.getDrinkById.and.returnValue(testDrink);

    // Get initial stock values
    const beforeIngredients = service.ingredients();
    const initialCoffeeStock = beforeIngredients.find(i => i.id === 'coffee')!.stock;
    const initialSugarStock = beforeIngredients.find(i => i.id === 'sugar')!.stock;
    const initialCreamStock = beforeIngredients.find(i => i.id === 'cream')!.stock;

    service.dispenseDrink('test_coffee');

    // Get updated stock values
    const afterIngredients = service.ingredients();
    const finalCoffeeStock = afterIngredients.find(i => i.id === 'coffee')!.stock;
    const finalSugarStock = afterIngredients.find(i => i.id === 'sugar')!.stock;
    const finalCreamStock = afterIngredients.find(i => i.id === 'cream')!.stock;

    // Verify stock reductions
    expect(finalCoffeeStock).toBe(initialCoffeeStock - 3);
    expect(finalSugarStock).toBe(initialSugarStock - 1);
    expect(finalCreamStock).toBe(initialCreamStock - 1);
  });

  it('should handle restock', () => {
    // First dispense a drink to reduce stock
    service.dispenseDrink('coffee');

    // Then restock
    service.restockIngredients();

    // Verify all ingredients are back to initial stock
    const ingredients = service.ingredients();
    expect(ingredients.every(ingredient => ingredient.stock === INITIAL_STOCK)).toBeTrue();
  });
});