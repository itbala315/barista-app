export interface Ingredient {
  id: string;
  name: string;
  cost: number;
  stock: number;
}

export const INITIAL_STOCK = 10;

export const DEFAULT_INGREDIENTS: Ingredient[] = [
  { id: 'coffee', name: 'Coffee', cost: 0.75, stock: INITIAL_STOCK },
  { id: 'decafCoffee', name: 'Decaf Coffee', cost: 0.75, stock: INITIAL_STOCK },
  { id: 'sugar', name: 'Sugar', cost: 0.25, stock: INITIAL_STOCK },
  { id: 'cream', name: 'Cream', cost: 0.25, stock: INITIAL_STOCK },
  { id: 'steamedMilk', name: 'Steamed Milk', cost: 0.35, stock: INITIAL_STOCK },
  { id: 'foamedMilk', name: 'Foamed Milk', cost: 0.35, stock: INITIAL_STOCK },
  { id: 'espresso', name: 'Espresso', cost: 1.10, stock: INITIAL_STOCK },
  { id: 'cocoa', name: 'Cocoa', cost: 0.90, stock: INITIAL_STOCK },
  { id: 'whippedCream', name: 'Whipped Cream', cost: 1.00, stock: INITIAL_STOCK },
  { id: 'cinamon', name: 'cinamon', cost: 0.45, stock: INITIAL_STOCK }
];
