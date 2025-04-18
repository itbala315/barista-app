import { TestBed } from '@angular/core/testing';
import { DrinkMenuService } from './drink-menu.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { Drink, DEFAULT_DRINKS } from '../models/drink.model';

describe('DrinkMenuService', () => {
  let service: DrinkMenuService;
  let httpMock: HttpTestingController;
  let mockLocalStorage: { [key: string]: string } = {};

  beforeEach(() => {
    mockLocalStorage = {};
    
    spyOn(localStorage, 'getItem').and.callFake(key => mockLocalStorage[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => mockLocalStorage[key] = value);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DrinkMenuService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(DrinkMenuService);
    httpMock = TestBed.inject(HttpTestingController);

    // Handle initial load request for service
    const req = httpMock.expectOne('/assets/config/drinks.json');
    req.flush({ drinks: DEFAULT_DRINKS });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default drinks', () => {
    const drinks = service.drinks();
    expect(drinks.length).toBeGreaterThan(0);
    expect(drinks).toEqual(DEFAULT_DRINKS);
  });

  it('should load drinks from config file', async () => {
    const testDrinks: Drink[] = [{
      id: 'test_drink',
      name: 'Test Drink',
      recipe: [{ ingredientId: 'coffee', quantity: 1 }]
    }];

    // Trigger manual load
    const loadPromise = service.loadDrinks();
    const req = httpMock.expectOne('/assets/config/drinks.json');
    req.flush({ drinks: testDrinks });
    
    await loadPromise;
    const drinks = service.drinks();
    expect(drinks).toContain(jasmine.objectContaining({
      id: 'test_drink',
      name: 'Test Drink'
    }));
  });

  it('should add a new custom drink', () => {
    const newDrink: Drink = {
      id: 'custom_1',
      name: 'Custom Drink',
      recipe: [{ ingredientId: 'coffee', quantity: 2 }],
      custom: true
    };

    service.addDrink(newDrink);
    
    const drinks = service.drinks();
    expect(drinks.find(d => d.id === newDrink.id)).toBeTruthy();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should update an existing drink', () => {
    // First add a drink
    const drink: Drink = {
      id: 'custom_1',
      name: 'Custom Drink',
      recipe: [{ ingredientId: 'coffee', quantity: 2 }],
      custom: true
    };
    service.addDrink(drink);

    // Then update it
    const updatedDrink = {
      ...drink,
      name: 'Updated Drink',
      recipe: [{ ingredientId: 'coffee', quantity: 3 }]
    };
    service.updateDrink(updatedDrink);

    const drinks = service.drinks();
    expect(drinks.find(d => d.id === drink.id)).toEqual(updatedDrink);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should delete a custom drink', () => {
    // First add a drink
    const drink: Drink = {
      id: 'custom_1',
      name: 'Custom Drink',
      recipe: [{ ingredientId: 'coffee', quantity: 2 }],
      custom: true
    };
    service.addDrink(drink);

    // Then delete it
    service.deleteDrink(drink.id);

    const drinks = service.drinks();
    expect(drinks.find(d => d.id === drink.id)).toBeFalsy();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should not delete default drinks', () => {
    const defaultDrink = DEFAULT_DRINKS[0];
    const initialCount = service.drinks().length;

    service.deleteDrink(defaultDrink.id);

    const drinks = service.drinks();
    expect(drinks.length).toBe(initialCount);
    expect(drinks.find(d => d.id === defaultDrink.id)).toBeTruthy();
  });

  it('should save custom drinks to localStorage', () => {
    const customDrink: Drink = {
      id: 'custom_1',
      name: 'Custom Drink',
      recipe: [{ ingredientId: 'coffee', quantity: 2 }],
      custom: true
    };

    service.addDrink(customDrink);

    expect(localStorage.setItem).toHaveBeenCalled();
    const savedDrinks = JSON.parse(mockLocalStorage['barista_custom_drinks']);
    expect(savedDrinks[0]).toEqual(jasmine.objectContaining({
      id: customDrink.id,
      name: customDrink.name,
      recipe: customDrink.recipe,
      custom: true
    }));
  });

  it('should load custom drinks from localStorage on initialization', async () => {
    const customDrink: Drink = {
      id: 'custom_1',
      name: 'Custom Drink',
      recipe: [{ ingredientId: 'coffee', quantity: 2 }],
      custom: true
    };

    mockLocalStorage['barista_custom_drinks'] = JSON.stringify([customDrink]);

    // Create a new instance and wait for initialization
    const newService = TestBed.inject(DrinkMenuService);
    const loadPromise = newService.loadDrinks();

    // Handle the HTTP request for default drinks
    const req = httpMock.expectOne('/assets/config/drinks.json');
    req.flush({ drinks: DEFAULT_DRINKS });

    await loadPromise;

    // Verify drinks include both default and custom drinks
    const drinks = newService.drinks();
    expect(drinks.some(d => d.id === customDrink.id)).toBeTrue();
  });
});