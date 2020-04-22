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
        case RecipeAction.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            }
        case RecipeAction.UPDATE_RECIPE:
            const updatedRecipe = {...state.recipes[action.payload.index], ...action.payload.recipe};
            const updateRecipes = [...state.recipes];
            updateRecipes[action.payload.index] = updatedRecipe;
            return {
                ...state,
                recipes: updateRecipes
            }
        case RecipeAction.DELETE_RECIPE:
            return{
                ...state,
                recipes: state.recipes.filter((recipe, index) => {
                    return index !== action.payload;
                })
            }
        default:
            return state;
    }
}