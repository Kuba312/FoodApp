import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {



  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

  shoppingItem = new EventEmitter<Ingredient>();
  ingredientItems = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  constructor() { }

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientItems.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientItems.next(this.ingredients);
  }

  getIngredient(ingredientIndex: number) {
    return this.ingredients[ingredientIndex];

  }

  editIngridient(index: number, newIngridient: Ingredient) {
    this.ingredients[index] = newIngridient;
    this.ingredientItems.next(this.ingredients.slice());
  }

  deleteIngridient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientItems.next(this.ingredients.slice());
  }

}


