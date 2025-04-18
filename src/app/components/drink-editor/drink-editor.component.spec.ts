import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrinkEditorComponent } from './drink-editor.component';
import { BaristaService } from '../../services/barista.service';
import { DrinkMenuService } from '../../services/drink-menu.service';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { Drink } from '../../models/drink.model';
import { DEFAULT_INGREDIENTS } from '../../models/ingredient.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgFor, NgIf, NgClass, JsonPipe, CurrencyPipe } from '@angular/common';

describe('DrinkEditorComponent', () => {
  let component: DrinkEditorComponent;
  let fixture: ComponentFixture<DrinkEditorComponent>;
  let mockBaristaService: jasmine.SpyObj<BaristaService>;
  let mockDrinkMenuService: jasmine.SpyObj<DrinkMenuService>;

  beforeEach(async () => {
    mockBaristaService = jasmine.createSpyObj('BaristaService', [], {
      ingredients: signal(DEFAULT_INGREDIENTS),
      calculateDrinkPrice: (drink: Drink) => drink.recipe.reduce((total, item) => {
        const ingredient = DEFAULT_INGREDIENTS.find(i => i.id === item.ingredientId);
        return total + (ingredient?.cost || 0) * item.quantity;
      }, 0)
    });
    
    mockDrinkMenuService = jasmine.createSpyObj('DrinkMenuService', [
      'addDrink',
      'updateDrink',
      'deleteDrink'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        DrinkEditorComponent,
        FormsModule,
        HttpClientTestingModule,
        NgFor,
        NgIf,
        NgClass,
        JsonPipe,
        CurrencyPipe
      ],
      providers: [
        { provide: BaristaService, useValue: mockBaristaService },
        { provide: DrinkMenuService, useValue: mockDrinkMenuService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DrinkEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.newDrink).toBeTruthy();
    expect(component.newDrink.name).toBe('');
    expect(component.newDrink.recipe).toEqual([]);
    expect(component.newDrink.custom).toBeTrue();
  });

  it('should validate drink name is required', () => {
    component.newDrink.name = '';
    component.newDrink.recipe = [{ ingredientId: 'coffee', quantity: 1 }];
    
    component.saveDrink();
    
    expect(component.showErrorModal()).toBeTrue();
    expect(component.errorMessage()).toBe('Please enter a drink name');
    expect(mockDrinkMenuService.addDrink).not.toHaveBeenCalled();
  });

  it('should validate at least one ingredient is required', () => {
    component.newDrink.name = 'Test Drink';
    component.newDrink.recipe = [];
    
    component.saveDrink();
    
    expect(component.showErrorModal()).toBeTrue();
    expect(component.errorMessage()).toBe('Please add at least one ingredient to the recipe');
    expect(mockDrinkMenuService.addDrink).not.toHaveBeenCalled();
  });

  it('should add new ingredient to recipe', () => {
    component.newRecipeItem = { ingredientId: 'coffee', quantity: 2 };
    component.addIngredientToRecipe();
    
    expect(component.newDrink.recipe.length).toBe(1);
    expect(component.newDrink.recipe[0]).toEqual({ ingredientId: 'coffee', quantity: 2 });
  });

  it('should update existing ingredient quantity in recipe', () => {
    component.newRecipeItem = { ingredientId: 'coffee', quantity: 2 };
    component.addIngredientToRecipe();
    
    component.newRecipeItem = { ingredientId: 'coffee', quantity: 1 };
    component.addIngredientToRecipe();
    
    expect(component.newDrink.recipe.length).toBe(1);
    expect(component.newDrink.recipe[0].quantity).toBe(3);
  });

  it('should remove ingredient from recipe', () => {
    component.newDrink.recipe = [
      { ingredientId: 'coffee', quantity: 2 },
      { ingredientId: 'sugar', quantity: 1 }
    ];
    
    component.removeIngredientFromRecipe(0);
    
    expect(component.newDrink.recipe.length).toBe(1);
    expect(component.newDrink.recipe[0].ingredientId).toBe('sugar');
  });

  it('should save new drink', () => {
    const newDrink: Drink = {
      id: '',
      name: 'Test Drink',
      recipe: [{ ingredientId: 'coffee', quantity: 2 }],
      custom: true
    };
    
    component.newDrink = newDrink;
    component.saveDrink();
    
    expect(mockDrinkMenuService.addDrink).toHaveBeenCalled();
    const savedDrink = mockDrinkMenuService.addDrink.calls.first().args[0];
    expect(savedDrink.name).toBe(newDrink.name);
    expect(savedDrink.recipe).toEqual(newDrink.recipe);
    expect((savedDrink as any).custom).toBe(true);
    expect(savedDrink.id).toMatch(/^custom_/);
  });

  it('should update existing drink', () => {
    const existingDrink: Drink = {
      id: 'test_1',
      name: 'Test Drink',
      recipe: [{ ingredientId: 'coffee', quantity: 2 }],
      custom: true
    };
    
    component.editingDrink.set(existingDrink);
    component.newDrink = { ...existingDrink, name: 'Updated Drink' };
    
    component.saveDrink();
    
    expect(mockDrinkMenuService.updateDrink).toHaveBeenCalledWith({
      ...existingDrink,
      name: 'Updated Drink'
    });
  });

  it('should calculate estimated price correctly', () => {
    component.newDrink.recipe = [
      { ingredientId: 'coffee', quantity: 2 }, // 2 * 0.75 = 1.50
      { ingredientId: 'sugar', quantity: 1 }   // 1 * 0.25 = 0.25
    ];
    
    component.updateEstimatedPrice();
    
    expect(component.estimatedPrice()).toBeGreaterThan(0);
  });
});