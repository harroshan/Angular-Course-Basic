import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs/operators';

import { Recipe } from './recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.action';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]> {
    // constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService, private store: Store<fromApp.AppState>, private actions$: Action) { }

    constructor(
        private store: Store<fromApp.AppState>,
        private actions$: Actions
      ) {}

    // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //     const recipes = this.recipeService.getRecipes();

    //     if(recipes.length === 0){
    //         return this.dataStorageService.fetchRecipes();   
    //     } else {
    //         return recipes;
    //     }
    // }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // return this.dataStorageService.fetchRecipes();
        this.store.dispatch(new RecipesActions.FetchRecipes());
        return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1)
        );
    }


}