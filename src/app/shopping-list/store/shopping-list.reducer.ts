import { Action } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
import { AddIngredient, ADD_INGREDIENT } from "./shopping-list.action";

const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ]
};


// current state befire it was changed, action that triggers reducer
// and in the end, the state update
export function shoppingListReducer(state = initialState, action: AddIngredient):any {
    switch(action.type) {
        case ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
    }
}