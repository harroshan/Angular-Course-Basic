import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  shoppingSubscription: Subscription;

  constructor(private shoppingListService: ShoppingListService, private loggingServie: LoggingService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.shoppingSubscription = this.shoppingListService.ingredientsChanged.subscribe(
      (ingredient: Ingredient[]) => {
        this.ingredients = ingredient;
    })

    this.loggingServie.printLog("Calling from Shopping List");  
  }

  onEditItem(index: number){
    this.shoppingListService.startEditing.next(index);
  }

  ngOnDestroy(){
    this.shoppingSubscription.unsubscribe();
  }

}
