import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit, OnDestroy {
  // selectedRecipe: Recipe;
  // recipeSubscription: Subscription;

  constructor(private recipeService: RecipeService) { }

  //Can get rid of the subscription as we are using the router which doesn't
  //require such eventEmitter or Subject
  ngOnInit() {
    // this.recipeSubscription = this.recipeService.recipeSelected.subscribe((recipe: Recipe)=>{
    //   this.selectedRecipe = recipe;
    // });
  }

  ngOnDestroy(){
    // this.recipeSubscription.unsubscribe();
  }

}
