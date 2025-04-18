import { Injectable, signal, computed } from '@angular/core';
import { DEFAULT_INGREDIENTS, INITIAL_STOCK, Ingredient } from '../models/ingredient.model';
import { Drink } from '../models/drink.model';
import { DrinkMenuService } from './drink-menu.service';

@Injectable({
  providedIn: 'root'
})
export class BaristaService {
  // Create signals for state management
  private _ingredients = signal<Ingredient[]>(DEFAULT_INGREDIENTS.map(i => ({ ...i })));
  private _dispensingDrink = signal<string | null>(null);
  
  // Create computed signals for derived state
  public ingredients = computed(() => this._ingredients());
  public dispensingDrink = computed(() => this._dispensingDrink());
  public drinks = computed(() => {
    const currentIngredients = this._ingredients();
    return this.drinkMenuService.drinks().map(drink => ({
      ...drink,
      available: this.isDrinkAvailable(drink, currentIngredients),
      price: this.calculateDrinkPrice(drink, currentIngredients)
    }));
  });

  constructor(private drinkMenuService: DrinkMenuService) { }

  dispenseDrink(drinkId: string): void {
    const drink = this.drinkMenuService.getDrinkById(drinkId);
    if (!drink) return;

    // Check if we have enough stock
    if (!this.hasEnoughStock(drink)) return;

    // Start dispensing
    this._dispensingDrink.set(drink.id);

    // Update stock
    this.updateStock(drink);

    // Finish dispensing after 2 seconds
    setTimeout(() => {
      this._dispensingDrink.set(null);
    }, 2000);
  }

  hasEnoughStock(drink: Drink): boolean {
    const ingredients = this._ingredients();
    return drink.recipe.every(item => {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      return ingredient && ingredient.stock >= item.quantity;
    });
  }

  private updateStock(drink: Drink): void {
    const ingredients = this._ingredients();
    const updatedIngredients = ingredients.map(ingredient => {
      const recipeItem = drink.recipe.find(item => item.ingredientId === ingredient.id);
      if (recipeItem) {
        return {
          ...ingredient,
          stock: ingredient.stock - recipeItem.quantity
        };
      }
      return ingredient;
    });
    this._ingredients.set(updatedIngredients);
  }

  restockIngredients(): void {
    const ingredients = this._ingredients();
    const restockedIngredients = ingredients.map(ingredient => ({
      ...ingredient,
      stock: INITIAL_STOCK
    }));
    this._ingredients.set(restockedIngredients);
  }

  private isDrinkAvailable(drink: Drink, ingredients: Ingredient[]): boolean {
    return drink.recipe.every(recipeItem => {
      const ingredient = ingredients.find(i => i.id === recipeItem.ingredientId);
      return ingredient && ingredient.stock >= recipeItem.quantity;
    });
  }

  private calculateDrinkPrice(drink: Drink, ingredients: Ingredient[]): number {
    return drink.recipe.reduce((total, recipeItem) => {
      const ingredient = ingredients.find(i => i.id === recipeItem.ingredientId);
      if (ingredient) {
        return total + (ingredient.cost * recipeItem.quantity);
      }
      return total;
    }, 0);
  }
}