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
  group?: string; // Optional group for categorizing drinks
  custom?: boolean; // Flag to indicate if this is a custom user-created drink
}

// Default drinks provided by the system
export const DEFAULT_DRINKS: Drink[] = [
  {
    id: 'coffee',
    name: 'Coffee',
    group: 'Coffee',
    recipe: [
      { ingredientId: 'coffee', quantity: 3 },
      { ingredientId: 'sugar', quantity: 1 },
      { ingredientId: 'cream', quantity: 1 }
    ]
  },
  {
    id: 'decafCoffee',
    name: 'Decaf Coffee',
    group: 'Coffee',
    recipe: [
      { ingredientId: 'decafCoffee', quantity: 3 },
      { ingredientId: 'sugar', quantity: 1 },
      { ingredientId: 'cream', quantity: 1 }
    ]
  },
  {
    id: 'caffeLatte',
    name: 'Caffe Latte',
    group: 'Coffee',
    recipe: [
      { ingredientId: 'espresso', quantity: 2 },
      { ingredientId: 'steamedMilk', quantity: 1 }
    ]
  },
  {
    id: 'caffeAmericano',
    name: 'Caffe Americano',
    group: 'Coffee',
    recipe: [
      { ingredientId: 'espresso', quantity: 3 }
    ]
  },
  {
    id: 'caffeMocha',
    name: 'Caffe Mocha',
    group: 'Coffee',
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
    group: 'Coffee',
    recipe: [
      { ingredientId: 'espresso', quantity: 2 },
      { ingredientId: 'steamedMilk', quantity: 1 },
      { ingredientId: 'foamedMilk', quantity: 1 }
    ]
  },
  {
    id: 'mochhito',
    name: 'mochhito',
    group: 'tea',
    recipe: [
      { ingredientId: 'espresso', quantity: 2 },
      { ingredientId: 'steamedMilk', quantity: 1 },
      { ingredientId: 'foamedMilk', quantity: 1 }
    ]
  }
];

// All drinks (default + custom)
export const DRINK_MENU: Drink[] = [...DEFAULT_DRINKS];
