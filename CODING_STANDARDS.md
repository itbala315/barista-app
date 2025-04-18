# Barista App Coding Standards

*Last updated: April 17, 2025*

This document outlines the coding standards and best practices for the Barista App project. Following these guidelines ensures code consistency, maintainability, and easier collaboration among team members.

## Table of Contents

1. [General Principles](#general-principles)
2. [Angular Specific Guidelines](#angular-specific-guidelines)
3. [TypeScript Standards](#typescript-standards)
4. [HTML and Template Standards](#html-and-template-standards)
5. [SCSS/CSS Standards](#scsscss-standards)
6. [Unit Testing](#unit-testing)
7. [Git Workflow](#git-workflow)
8. [Documentation](#documentation)

## General Principles

- **DRY (Don't Repeat Yourself)**: Avoid code duplication by abstracting common functionality.
- **KISS (Keep It Simple, Stupid)**: Prefer simple, readable solutions over complex ones.
- **Single Responsibility**: Each component, service, or function should have one clear responsibility.
- **Code Readability**: Write code that is easy to understand for other developers.
- **Performance**: Be mindful of performance implications, especially with Observable subscriptions.

## Angular Specific Guidelines

### Project Structure

- Follow the established folder structure:
  - Components in `src/app/components/`
  - Services in `src/app/services/`
  - Models in `src/app/models/`
  - Unit tests alongside their implementation files or in a `tests` subfolder

### Components

- Use the Angular CLI to generate components: `ng generate component`
- Follow a clear naming convention: `feature.component.ts`
- Keep components small and focused on a single responsibility
- Implement the OnDestroy interface and unsubscribe from Observables
- Use `@Input()` and `@Output()` decorators for component communication

```typescript
@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent implements OnInit, OnDestroy {
  @Input() inputData: SomeType;
  @Output() result = new EventEmitter<ResultType>();
  
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    // Initialize component
    this.someService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.handleData(data));
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Services

- Create singleton services that should be provided in the root
- Use proper dependency injection
- Return Observables rather than promises when possible
- Handle errors properly
- Document public API methods

```typescript
@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  /**
   * Fetches data from the API
   * @returns Observable of data array
   */
  getData(): Observable<DataType[]> {
    return this.http.get<DataType[]>('/api/data').pipe(
      catchError(error => {
        console.error('Error fetching data', error);
        return throwError(() => new Error('Failed to fetch data'));
      })
    );
  }
}
```

## TypeScript Standards

- Use TypeScript's type system effectively
- Define interfaces and models for all data structures
- Avoid `any` type when possible
- Use access modifiers (private, public, protected) appropriately
- Use const for values that don't change
- Use string enums for predefined sets of values
- Use optional chaining and nullish coalescing when appropriate

```typescript
// Prefer
const value = data?.property ?? defaultValue;

// Over
const value = data && data.property ? data.property : defaultValue;
```

### Naming Conventions

- **Classes/Interfaces**: PascalCase (`DrinkComponent`, `Ingredient`)
- **Methods/Properties**: camelCase (`getDrink()`, `totalPrice`)
- **Constants**: UPPER_SNAKE_CASE for global constants (`MAX_DRINKS`)
- **Interfaces**: PascalCase, no 'I' prefix (`Drink` not `IDrink`)
- **Files**: kebab-case (`drink-menu.component.ts`)

## HTML and Template Standards

- Use semantic HTML elements
- Follow accessibility best practices (ARIA attributes, proper labels)
- Use Angular's binding syntax consistently
- Limit logic in templates; move complex logic to component class
- Use ng-container for structural directives when no element is needed

```html
<ng-container *ngIf="drinks$ | async as drinks">
  <app-drink-item 
    *ngFor="let drink of drinks; trackBy: trackById" 
    [drink]="drink"
    (select)="onDrinkSelect($event)">
  </app-drink-item>
</ng-container>
```

## SCSS/CSS Standards

- Use Tailwind utility classes where appropriate
- Create custom utility classes for repeated styles
- Use BEM naming convention for custom CSS classes
- Keep styles modular and scoped to components
- Use SCSS variables for colors, fonts, and spacing
- Follow a consistent color scheme and spacing system

```scss
// Good example
.drink-card {
  &__title {
    @apply text-xl font-bold;
    color: var(--primary-color);
  }
  
  &__price {
    @apply text-lg;
    color: var(--secondary-color);
  }
}
```

## Unit Testing

- Aim for high test coverage (minimum 80%)
- Follow the AAA pattern (Arrange, Act, Assert)
- Mock dependencies appropriately
- Test both success and failure paths
- Use descriptive test names that explain the expected behavior

```typescript
describe('BaristaService', () => {
  it('should return a list of available drinks', () => {
    // Arrange
    const service = TestBed.inject(BaristaService);
    const mockDrinks = [{ id: 1, name: 'Espresso' }];
    spyOn(httpClient, 'get').and.returnValue(of(mockDrinks));
    
    // Act
    let result: Drink[] = [];
    service.getAvailableDrinks().subscribe(drinks => {
      result = drinks;
    });
    
    // Assert
    expect(result).toEqual(mockDrinks);
  });
});
```

## Git Workflow

- Use feature branches for all new features and bug fixes
- Name branches descriptively: `feature/add-new-drink`, `fix/dispenser-error`
- Write meaningful commit messages
- Rebase feature branches on main before creating a pull request
- Keep pull requests focused on a single feature or fix
- Squash commits before merging when appropriate

### Commit Message Format

```
<type>(<scope>): <subject>

<body>
```

Where `type` is one of:
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that don't affect the meaning of the code
- refactor: Code change that neither fixes a bug nor adds a feature
- perf: Code change that improves performance
- test: Adding or modifying tests

## Documentation

- Document the purpose of components, services, and complex functions
- Keep the README.md updated with current setup and usage instructions
- Document API endpoints and data models
- Use JSDoc comments for public methods

```typescript
/**
 * Calculates the price of a drink based on its ingredients
 * @param drink The drink to calculate the price for
 * @param applyDiscount Whether to apply any active discounts
 * @returns The calculated price
 */
calculatePrice(drink: Drink, applyDiscount = false): number {
  // Implementation
}
```

---

These standards should be reviewed and updated periodically as the project evolves and new best practices emerge.