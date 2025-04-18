// filepath: c:\Barista\barista-app\src\app\services\drink-menu.service.ts
import { Injectable, PLATFORM_ID, Inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Drink, DEFAULT_DRINKS } from '../models/drink.model';

@Injectable({
  providedIn: 'root'
})
export class DrinkMenuService {
  private readonly STORAGE_KEY = 'barista_custom_drinks';
  private drinksSignal: WritableSignal<Drink[]> = signal([...DEFAULT_DRINKS]);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadInitialDrinks();
  }

  drinks(): Drink[] {
    return this.drinksSignal();
  }

  async loadDrinks(): Promise<void> {
    try {
      const response = await this.http.get<{ drinks: Drink[] }>('/assets/config/drinks.json').toPromise();
      const defaultDrinks = response?.drinks || DEFAULT_DRINKS;
      const customDrinks = this.loadCustomDrinksFromStorage();
      this.drinksSignal.set([...defaultDrinks, ...customDrinks]);
    } catch (error) {
      console.error('Failed to load drinks:', error);
      this.drinksSignal.set([...DEFAULT_DRINKS]);
    }
  }

  addDrink(drink: Drink): void {
    const drinks = this.drinksSignal();
    this.drinksSignal.set([...drinks, drink]);
    this.saveCustomDrinksToStorage();
  }

  updateDrink(drink: Drink): void {
    const drinks = this.drinksSignal();
    const index = drinks.findIndex(d => d.id === drink.id);
    if (index !== -1) {
      const updatedDrinks = [...drinks];
      updatedDrinks[index] = drink;
      this.drinksSignal.set(updatedDrinks);
      this.saveCustomDrinksToStorage();
    }
  }

  deleteDrink(drinkId: string): void {
    const drinks = this.drinksSignal();
    const drink = drinks.find(d => d.id === drinkId);
    if (drink?.custom) {
      this.drinksSignal.set(drinks.filter(d => d.id !== drinkId));
      this.saveCustomDrinksToStorage();
    }
  }

  getDrinkById(drinkId: string): Drink | undefined {
    return this.drinksSignal().find(drink => drink.id === drinkId);
  }

  private loadInitialDrinks(): void {
    // Load default drinks
    this.drinksSignal.set([...DEFAULT_DRINKS]);

    // Load custom drinks from storage if in browser
    if (isPlatformBrowser(this.platformId)) {
      const customDrinks = this.loadCustomDrinksFromStorage();
      if (customDrinks.length > 0) {
        this.drinksSignal.set([...DEFAULT_DRINKS, ...customDrinks]);
      }
    }

    // Load drinks from config file
    this.loadDrinks();
  }

  private loadCustomDrinksFromStorage(): Drink[] {
    if (isPlatformBrowser(this.platformId)) {
      const storedDrinks = localStorage.getItem(this.STORAGE_KEY);
      if (storedDrinks) {
        try {
          return JSON.parse(storedDrinks);
        } catch (error) {
          console.error('Failed to parse stored drinks:', error);
        }
      }
    }
    return [];
  }

  private saveCustomDrinksToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const customDrinks = this.drinksSignal().filter(drink => drink.custom);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customDrinks));
    }
  }
}