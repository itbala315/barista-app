import { Component, OnInit, signal, inject, PLATFORM_ID, computed } from '@angular/core';
import { CurrencyPipe, NgClass, NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { BaristaService } from '../../services/barista.service';
import { DrinkMenuService } from '../../services/drink-menu.service'; 
import { Drink } from '../../models/drink.model';
import { Ingredient } from '../../models/ingredient.model';

@Component({
  selector: 'app-drink-menu',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, CurrencyPipe],
  templateUrl: './drink-menu.component.html',
  styleUrls: ['./drink-menu.component.scss']
})
export class DrinkMenuComponent implements OnInit {
  expandedDrinkId = signal<string | null>(null);
  showCustomDrinks = signal<boolean>(false);
  private platformId = inject(PLATFORM_ID);
  
  // Signals for the delete confirmation modal
  deleteModalVisible = signal<boolean>(false);
  private drinkIdToDelete = signal<string | null>(null);
  
  // Computed signal to get the drink details for the one being deleted
  drinkToDelete = computed(() => {
    const drinkId = this.drinkIdToDelete();
    if (!drinkId) return null;
    return this.baristaService.drinks().find(drink => drink.id === drinkId);
  });
  
  // Computed signal to check if there are any custom drinks
  hasCustomDrinks = computed(() => {
    return this.baristaService.drinks().some(drink => drink.custom);
  });
  
  constructor(
    public baristaService: BaristaService,
    public drinkMenuService: DrinkMenuService
  ) { }

  ngOnInit(): void {
    // No need to subscribe to signals
  }

  orderDrink(drinkId: string): void {
    this.baristaService.dispenseDrink(drinkId);
  }

  toggleRecipe(drinkId: string): void {
    this.expandedDrinkId.set(this.expandedDrinkId() === drinkId ? null : drinkId);
  }

  toggleShowCustomDrinks(): void {
    this.showCustomDrinks.update(value => !value);
  }

  createNewDrink(): void {
    // Use the safe dispatchDrinkEvent method instead of directly accessing window
    this.dispatchDrinkEvent('create-new-drink', null);
  }

  getIngredientName(ingredientId: string, ingredients: Ingredient[]): string {
    const ingredient = ingredients.find(i => i.id === ingredientId);
    return ingredient ? ingredient.name : 'Unknown Ingredient';
  }
  
  editDrink(drink: Drink, event: MouseEvent): void {
    // Prevent the click from toggling the recipe
    event.stopPropagation();
    
    // Use the safe dispatchDrinkEvent method instead of directly accessing window
    this.dispatchDrinkEvent('edit-drink', drink);
  }
  
  deleteDrink(drinkId: string, event: MouseEvent): void {
    // Prevent the click from toggling the recipe
    event.stopPropagation();
    
    // Set the drink to delete and show the modal
    this.drinkIdToDelete.set(drinkId);
    this.deleteModalVisible.set(true);
  }
  
  confirmDelete(): void {
    const drinkId = this.drinkIdToDelete();
    if (drinkId) {
      this.drinkMenuService.deleteDrink(drinkId);
      this.cancelDelete();
    }
  }
  
  cancelDelete(): void {
    this.deleteModalVisible.set(false);
    this.drinkIdToDelete.set(null);
  }
  
  private dispatchDrinkEvent(eventName: string, drink: Drink | null): void {
    // Only dispatch events in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const event = new CustomEvent(eventName, { 
        bubbles: true, 
        detail: { drink } 
      });
      window.dispatchEvent(event);
    }
  }
}