import { Ingredient } from './ingredient.model';

export interface DrinkIngredient {
  ingredientId: string;
  quantity: number;
}

export interface Drink {
  id: string;
  name: string;
  recipe: DrinkIngredient[];
  price?: number;
  available?: boolean;
  custom?: boolean; // Flag to indicate if this is a custom user-created drink
}

// Default drinks provided by the system
export const DEFAULT_DRINKS: Drink[] = [
  {
    id: 'coffee',
    name: 'Coffee',
    recipe: [
      { ingredientId: 'coffee', quantity: 3 },
      { ingredientId: 'sugar', quantity: 1 },
      { ingredientId: 'cream', quantity: 1 }
    ]
  },
  {
    id: 'decafCoffee',
    name: 'Decaf Coffee',
    recipe: [
      { ingredientId: 'decafCoffee', quantity: 3 },
      { ingredientId: 'sugar', quantity: 1 },
      { ingredientId: 'cream', quantity: 1 }
    ]
  },
  {
    id: 'caffeLatte',
    name: 'Caffe Latte',
    recipe: [
      { ingredientId: 'espresso', quantity: 2 },
      { ingredientId: 'steamedMilk', quantity: 1 }
    ]
  },
  {
    id: 'caffeAmericano',
    name: 'Caffe Americano',
    recipe: [
      { ingredientId: 'espresso', quantity: 3 }
    ]
  },
  {
    id: 'caffeMocha',
    name: 'Caffe Mocha',
    recipe: [
      { ingredientId: 'espresso', quantity: 1 },
      { ingredientId: 'cocoa', quantity: 1 },
      { ingredientId: 'steamedMilk', quantity: 1 },
      { ingredientId: 'whippedCream', quantity: 1 }
    ]
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    recipe: [
      { ingredientId: 'espresso', quantity: 2 },
      { ingredientId: 'steamedMilk', quantity: 1 },
      { ingredientId: 'foamedMilk', quantity: 1 }
    ]
  }
];

// All drinks (default + custom)
export const DRINK_MENU: Drink[] = [...DEFAULT_DRINKS];