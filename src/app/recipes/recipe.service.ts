import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({
    providedIn: 'root'
})
export class RecipeService{
    // recipeSelected = new EventEmitter<Recipe>();
    recipeSelected = new Subject<Recipe>();

    constructor(private shoppingService: ShoppingListService){}

    private recipes: Recipe[] = [
        new Recipe('Testing Recipe', 
        'Description for testing recipe', 
        'https://hips.hearstapps.com/delish/assets/17/37/1505333248-goulash-delish-1.jpg',
        [new Ingredient('Meat', 1), new Ingredient('Fries',10)]),
        new Recipe('Another Testing Recipe', 
        'Description for testing recipe', 
        'https://hips.hearstapps.com/delish/assets/17/37/1505333248-goulash-delish-1.jpg',
        [new Ingredient('Buns', 1), new Ingredient('Fries',10)])
    ];

    getRecipes(){
        return this.recipes.slice();
    }

    getRecipe(index: number){
        return this.recipes.slice()[index];
    }

    addToShoppingList(ingredients: Ingredient[]){
        this.shoppingService.addIngredients(ingredients);
    }

}