import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DrinkMenuComponent } from './components/drink-menu/drink-menu.component';
import { DispenserComponent } from './components/dispenser/dispenser.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { DrinkEditorComponent } from './components/drink-editor/drink-editor.component';
import { NgIf } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Drink } from './models/drink.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DrinkMenuComponent, 
    DispenserComponent, 
    InventoryComponent, 
    DrinkEditorComponent, 
    NgIf,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Barista-matic Coffee Dispenser';
  @ViewChild(DrinkEditorComponent) drinkEditor?: DrinkEditorComponent;
  private handlers: { event: string; handler: EventListener }[];
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Setup handlers with functions that can be spied on in tests
    this.handlers = [
      { 
        event: 'edit-drink', 
        handler: this.handleEditDrink.bind(this) as EventListener 
      },
      { 
        event: 'create-new-drink', 
        handler: this.handleCreateNewDrink.bind(this) as EventListener 
      }
    ];
  }

  // Separate methods that can be spied on in tests
  handleEditDrink(e: CustomEvent<{ drink: Drink }>): void {
    if (this.drinkEditor) {
      this.drinkEditor.editDrink(e.detail.drink);
    }
  }

  handleCreateNewDrink(): void {
    if (this.drinkEditor) {
      this.drinkEditor.toggleEditor();
    }
  }

  ngOnInit() {
  }

  // Making this public so it can be called from tests
  ngAfterViewInit() {
    if (this.isBrowser) {
      this.handlers.forEach(({ event, handler }) => {
        window.addEventListener(event, handler);
      });
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      this.handlers.forEach(({ event, handler }) => {
        window.removeEventListener(event, handler);
      });
    }
  }
}
