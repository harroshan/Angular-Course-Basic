import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Observable, Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';
import * as fromShoppingList from './store/shopping-list.reducer'
import * as fromShopingListAction from '../shopping-list/store/shopping-list.action';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients: Ingredient[]}>;
  shoppingListSubscription: Subscription;

  constructor(private shoppingListService: ShoppingListService, private loggingServie: LoggingService, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList')
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.shoppingSubscription = this.shoppingListService.ingredientsChanged.subscribe(
    //   (ingredient: Ingredient[]) => {
    //     this.ingredients = ingredient;
    // })

    this.loggingServie.printLog("Calling from Shopping List");  
  }

  onEditItem(index: number){
    // this.shoppingListService.startEditing.next(index);
    this.store.dispatch(new fromShopingListAction.StartEdit(index));
  }

  ngOnDestroy(){

  }

}
