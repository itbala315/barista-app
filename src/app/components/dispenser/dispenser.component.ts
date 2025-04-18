import { Component, OnInit } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { BaristaService } from '../../services/barista.service';

@Component({
  selector: 'app-dispenser',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './dispenser.component.html',
  styleUrls: ['./dispenser.component.scss']
})
export class DispenserComponent implements OnInit {
  constructor(public baristaService: BaristaService) { }

  ngOnInit(): void {
    // No need to subscribe to signals
  }

  getDrinkColor(): string {
    const drink = this.baristaService.dispensingDrink();
    switch (drink) {
      case 'decafCoffee':
        return 'bg-amber-300';
      case 'coffee':
        return 'bg-coffee-medium';
      case 'caffeLatte':
        return 'bg-amber-200';
      case 'caffeAmericano':
        return 'bg-amber-800';
      case 'caffeMocha':
        return 'bg-amber-900';
      case 'cappuccino':
        return 'bg-amber-100';
      default:
        return 'bg-coffee-medium'; // Default color
    }
  }

  getSteamColor(): string {
    const drink = this.baristaService.dispensingDrink();
    switch (drink) {
      case 'decafCoffee':
        return 'bg-amber-200/70';
      case 'caffeMocha':
        return 'bg-amber-700/70';
      default:
        return 'bg-red-300/70'; // Default steam color
    }
  }

  getAnimationStyle(): string {
    const drink = this.baristaService.dispensingDrink();
    switch (drink) {
      case 'decafCoffee':
        return 'animate-[fillSlow_2.5s_ease-in-out_forwards]';
      case 'caffeAmericano':
        return 'animate-[fillFast_1.5s_ease-in-out_forwards]';
      default:
        return 'animate-[fill_2s_ease-in-out_forwards]';
    }
  }

  getBottomToast(): string {
    const drink = this.baristaService.dispensingDrink();
    switch (drink) {
      case 'decafCoffee':
        return 'bg-amber-600';
      case 'caffeMocha':
        return 'bg-amber-900';
      default:
        return 'bg-coffee-dark';
    }
  }

  getCupColor(): string {
    const drink = this.baristaService.dispensingDrink();
    switch (drink) {
      case 'decafCoffee':
        return 'bg-green-200';
      case 'coffee':
        return 'bg-red-200';
      case 'caffeLatte':
        return 'bg-orange-200';
      case 'caffeAmericano':
        return 'bg-red-300';
      case 'caffeMocha':
        return 'bg-red-400';
      case 'cappuccino':
        return 'bg-yellow-100';
      default:
        return 'bg-red-200'; // Default cup color
    }
  }
}