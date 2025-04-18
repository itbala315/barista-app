import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgFor, NgClass } from '@angular/common';
import { BaristaService } from '../../services/barista.service';
import { Ingredient } from '../../models/ingredient.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [NgFor, CurrencyPipe, NgClass],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  constructor(public baristaService: BaristaService) { }

  ngOnInit(): void {
    // No need to subscribe to signals
  }

  restock(): void {
    this.baristaService.restockIngredients();
  }
}