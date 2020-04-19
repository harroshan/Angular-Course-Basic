import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable({
    providedIn: 'root'
})
export class RecipeService{
    // recipeSelected = new EventEmitter<Recipe>();
    recipeSelected = new Subject<Recipe>();
    recipeChanged = new Subject<Recipe[]>();

    constructor(private shoppingService: ShoppingListService, private store: Store<fromApp.AppState>){}

    // private recipes: Recipe[] = [
    //     new Recipe('Testing Recipe', 
    //     'Description for testing recipe', 
    //     'https://hips.hearstapps.com/delish/assets/17/37/1505333248-goulash-delish-1.jpg',
    //     [new Ingredient('Meat', 1), new Ingredient('Fries',10)]),
    //     new Recipe('Another Testing Recipe', 
    //     'Description for testing recipe', 
    //     'https://hips.hearstapps.com/delish/assets/17/37/1505333248-goulash-delish-1.jpg',
    //     [new Ingredient('Buns', 1), new Ingredient('Fries',10)])
    // ];

    private recipes: Recipe[] = [];

    getRecipes(){
        return this.recipes.slice();
    }

    getRecipe(index: number){
        return this.recipes.slice()[index];
    }

    addToShoppingList(ingredients: Ingredient[]){
        this.shoppingService.addIngredients(ingredients);
        // this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipeChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number){
        this.recipes.splice(index,1);
        this.recipeChanged.next(this.recipes.slice());
    }

    setRecipes(recipes: Recipe[]){
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes.slice());
    }

}