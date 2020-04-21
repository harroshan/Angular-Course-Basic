import { Recipe } from '../recipe.model';
import * as RecipeAction from './recipe.action';

export interface State {
    recipes: Recipe[];
}

const intitialState: State = {
    recipes: []
}

export function recipeReducer(state = intitialState, action: RecipeAction.RecipesAction){
    switch(action.type){
        case RecipeAction.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            }
        default:
            return state;
    }
}