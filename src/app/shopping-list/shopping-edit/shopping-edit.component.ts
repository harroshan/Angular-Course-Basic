import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.action';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  // @ViewChild('nameInput', {static: false}) nameInputRef: ElementRef;
  // @ViewChild('amountInput', {static: false}) amountInputRef: ElementRef;
  // @Output() ingredientAdded = new EventEmitter<Ingredient>();

  subscription: Subscription;
  editMode: boolean = false;
  editItemIndex: number;
  editItem: Ingredient;
  @ViewChild('f', {static: false}) shoppingForm: NgForm;

  constructor(private shoppingService: ShoppingListService, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex > -1){
        this.editMode = true;
        this.editItem = stateData.editedIngredient
        this.shoppingForm.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount
        })
        console.log(this.shoppingForm.value)
      } else {
        this.editMode = false;
      }
    })
    // this.subscription = this.shoppingService.startEditing.subscribe(
    //   (index: number) => {
    //     this.editItemIndex = index
    //     this.editMode = true;
    //     this.editItem = this.shoppingService.getIngredient(index);
    //     this.shoppingForm.setValue({
    //       name: this.editItem.name,
    //       amount: this.editItem.amount
    //     })
    //   }
    // );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onSubmit(form : NgForm){
    // const ingName = this.nameInputRef.nativeElement.value;
    // const ingAmount = this.amountInputRef.nativeElement.value;
    // const newIngredient = new Ingredient(ingName,ingAmount);

    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){
      // this.shoppingService.updateIngredient(this.editItemIndex, newIngredient);
      // this.store.dispatch(new ShoppingListActions.UpdateIngredients({index: this.editItemIndex, ingredient: newIngredient}));
      this.store.dispatch(new ShoppingListActions.UpdateIngredients(newIngredient)) ;
    } else {
      // this.shoppingService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
  }

  onClear(){
    this.shoppingForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete(){
    // this.shoppingService.deleteIngredient(this.editItemIndex);
    // this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editItemIndex));
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

}
