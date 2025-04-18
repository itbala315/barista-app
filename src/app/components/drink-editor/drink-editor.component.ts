// filepath: c:\Barista\barista-app\src\app\components\drink-editor\drink-editor.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { NgFor, NgIf, NgClass, JsonPipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaristaService } from '../../services/barista.service';
import { DrinkMenuService } from '../../services/drink-menu.service';
import { Drink, DrinkIngredient } from '../../models/drink.model';
import { Ingredient } from '../../models/ingredient.model';

@Component({
  selector: 'app-drink-editor',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule, JsonPipe, CurrencyPipe],
  templateUrl: './drink-editor.component.html',
  styleUrls: ['./drink-editor.component.scss']
})
export class DrinkEditorComponent implements OnInit {
  showEditor = signal<boolean>(false);
  editingDrink = signal<Drink | null>(null);
  estimatedPrice = signal<number>(0);
  showErrorModal = signal<boolean>(false);
  errorMessage = signal<string>('');
  
  // Form model
  newDrink: Drink = {
    id: '',
    name: '',
    recipe: [],
    custom: true
  };
  
  // Temporary recipe item (for the UI)
  newRecipeItem: DrinkIngredient = {
    ingredientId: '',
    quantity: 1
  };
  
  constructor(
    public baristaService: BaristaService,
    private drinkMenuService: DrinkMenuService
  ) { }

  ngOnInit(): void {
    this.resetForm();
  }

  toggleEditor(): void {
    if (this.showEditor()) {
      this.resetForm();
    }
    this.showEditor.update(value => !value);
  }

  editDrink(drink: Drink): void {
    // Only allow editing custom drinks
    if (!drink.custom) {
      return;
    }
    
    this.editingDrink.set(drink);
    this.newDrink = { ...drink };
    this.showEditor.set(true);
    
    // Initialize the estimated price
    this.updateEstimatedPrice();
  }

  deleteDrink(drinkId: string): void {
    if (confirm('Are you sure you want to delete this drink?')) {
      this.drinkMenuService.deleteDrink(drinkId);
      this.resetForm();
    }
  }

  addIngredientToRecipe(): void {
    if (!this.newRecipeItem.ingredientId || this.newRecipeItem.quantity < 1) {
      return;
    }
    
    // Check if ingredient already exists in recipe
    const existingIndex = this.newDrink.recipe.findIndex(
      item => item.ingredientId === this.newRecipeItem.ingredientId
    );
    
    if (existingIndex >= 0) {
      // Update quantity if ingredient exists
      this.newDrink.recipe[existingIndex].quantity += this.newRecipeItem.quantity;
    } else {
      // Add new ingredient
      this.newDrink.recipe.push({ ...this.newRecipeItem });
    }
    
    // Update estimated price
    this.updateEstimatedPrice();
    
    // Reset the form fields
    this.newRecipeItem = {
      ingredientId: '',
      quantity: 1
    };
  }

  removeIngredientFromRecipe(index: number): void {
    this.newDrink.recipe.splice(index, 1);
    this.updateEstimatedPrice();
  }

  saveDrink(): void {
    if (!this.validateDrink()) {
      return;
    }
    
    // Ensure we have a custom flag set
    this.newDrink.custom = true;
    
    if (this.editingDrink()) {
      // Update existing drink
      this.drinkMenuService.updateDrink(this.newDrink);
    } else {
      // Generate a unique ID for new drinks
      this.newDrink.id = 'custom_' + Date.now();
      
      // Add new drink
      this.drinkMenuService.addDrink(this.newDrink);
    }
    
    this.resetForm();
    this.showEditor.set(false);
  }

  getIngredientName(ingredientId: string): string {
    const ingredient = this.baristaService.ingredients().find(i => i.id === ingredientId);
    return ingredient ? ingredient.name : 'Unknown';
  }
  
  getIngredientPrice(ingredientId: string, quantity: number): number {
    const ingredient = this.baristaService.ingredients().find(i => i.id === ingredientId);
    return ingredient ? ingredient.cost * quantity : 0;
  }
  
  cancelEdit(): void {
    this.resetForm();
    this.showEditor.set(false);
  }
  
  private resetForm(): void {
    this.editingDrink.set(null);
    this.newDrink = {
      id: '',
      name: '',
      recipe: [],
      custom: true
    };
    this.newRecipeItem = {
      ingredientId: '',
      quantity: 1
    };
  }
  
  private validateDrink(): boolean {
    if (!this.newDrink.name.trim()) {
      this.errorMessage.set('Please enter a drink name');
      this.showErrorModal.set(true);
      return false;
    }
    
    if (this.newDrink.recipe.length === 0) {
      this.errorMessage.set('Please add at least one ingredient to the recipe');
      this.showErrorModal.set(true);
      return false;
    }
    
    return true;
  }

  closeErrorModal(): void {
    this.showErrorModal.set(false);
  }

  // Calculate and update the estimated price based on recipe ingredients
  updateEstimatedPrice(): void {
    const price = this.calculatePrice(this.newDrink, this.baristaService.ingredients());
    this.estimatedPrice.set(price);
  }
  
  calculatePrice(drink: Drink, ingredients: Ingredient[]): number {
    return drink.recipe.reduce((total, recipeItem) => {
      const ingredient = ingredients.find(i => i.id === recipeItem.ingredientId);
      if (ingredient) {
        return total + (ingredient.cost * recipeItem.quantity);
      }
      return total;
    }, 0);
  }
}