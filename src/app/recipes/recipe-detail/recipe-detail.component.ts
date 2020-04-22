import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.action';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs/operators';
import * as RecipeAction from '../store/recipe.action';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  // @Input() recipe: Recipe;
  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // this.route.params.subscribe(
    //   (params: Params) => {
    //     this.id = +params['id'];
    //     this.recipe = this.recipeService.getRecipe(this.id);
    //   }
    // )
    // this.route.params.subscribe(
    //   (params: Params) => {
    //     this.id = +params['id'];
    //     this.store.select('recipes').pipe(map(recipeState => {
    //       return recipeState.recipes.find((recipe, index) => {
    //         return index === this.id;
    //       })
    //     }))
    //       .subscribe(recipe => { this.recipe = recipe; }).unsubscribe();
    //   }
    // )

    this.route.params.pipe(map(params => {
      return +params['id']
    }), switchMap(id => {
      this.id = id;
      return this.store.select('recipes');
    }), map(recipeState => {
      return recipeState.recipes.find((recipe, index) => {
        return index === this.id;
      })
    }))
      .subscribe(recipe => {
        this.recipe = recipe;
      })
  }

  toShoppingList() {
    // this.recipeService.addToShoppingList(this.recipe.ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDelete() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipeAction.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
