import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DrinkEditorComponent } from './components/drink-editor/drink-editor.component';
import { PLATFORM_ID } from '@angular/core';
import { Drink } from './models/drink.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BaristaService } from './services/barista.service';
import { DrinkMenuService } from './services/drink-menu.service';
import { DrinkMenuComponent } from './components/drink-menu/drink-menu.component';
import { DispenserComponent } from './components/dispenser/dispenser.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockDrinkEditor: jasmine.SpyObj<DrinkEditorComponent>;

  beforeEach(async () => {
    mockDrinkEditor = jasmine.createSpyObj('DrinkEditorComponent', ['editDrink', 'toggleEditor']);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientTestingModule,
        DrinkMenuComponent,
        DispenserComponent,
        InventoryComponent,
        NgIf,
        RouterModule.forRoot([])
      ],
      providers: [
        BaristaService,
        DrinkMenuService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    component.drinkEditor = mockDrinkEditor;
    
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect(component.title).toEqual('Barista-matic Coffee Dispenser');
  });

  it('should handle edit-drink event', () => {
    const testDrink: Drink = {
      id: 'test_1',
      name: 'Test Drink',
      recipe: [],
      custom: true
    };

    // Directly test the method with spy implementation
    spyOn(component, 'handleEditDrink').and.callThrough();
    
    // Create the event
    const customEvent = new CustomEvent('edit-drink', {
      detail: { drink: testDrink }
    }) as CustomEvent<{ drink: Drink }>;
    
    // Force the edit method to be called directly
    mockDrinkEditor.editDrink.and.callThrough();
    component.drinkEditor = mockDrinkEditor;
    component.handleEditDrink(customEvent);
    
    expect(component.handleEditDrink).toHaveBeenCalled();
    expect(mockDrinkEditor.editDrink).toHaveBeenCalledWith(testDrink);
  });

  it('should handle create-new-drink event', () => {
    // Directly test the method with spy implementation
    spyOn(component, 'handleCreateNewDrink').and.callThrough();
    
    // Force the toggle method to be called directly
    mockDrinkEditor.toggleEditor.and.callThrough();
    component.drinkEditor = mockDrinkEditor;
    component.handleCreateNewDrink();
    
    expect(component.handleCreateNewDrink).toHaveBeenCalled();
    expect(mockDrinkEditor.toggleEditor).toHaveBeenCalled();
  });

  it('should clean up event listeners on destroy', () => {
    const removeEventListenerSpy = spyOn(window, 'removeEventListener');
    component.ngOnDestroy();

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('edit-drink', jasmine.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('create-new-drink', jasmine.any(Function));
  });
});
