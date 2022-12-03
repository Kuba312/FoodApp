import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  // private recipes: Recipe[] = [
  //   new Recipe(1, 'Burger', 'Burger with salami and cheese',
  //     'https://us.123rf.com/450wm/alexraths/alexraths2002/alexraths200200041/140781570-%C5%9Bwie%C5%BCy-smaczny-burger-na-ciemnym-tle.jpg?ver=6',
  //     [
  //       new Ingredient("bread", 4),
  //       new Ingredient("Meat", 1)
  //     ]),
  //   new Recipe(2, 'Pizza', 'Pizza with cheese a ham', 'https://cdn.sallysbakingaddiction.com/wp-content/uploads/2014/01/whole-wheat-margherita-pizza.jpg',
  //     [
  //       new Ingredient("chicken", 4)

  //     ]),
  //   new Recipe(3, 'Fries', 'Fires made by potatos',
  //     'https://images.unsplash.com/photo-1585109649139-366815a0d713?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlbmNoJTIwZnJpZXN8ZW58MHx8MHx8&w=1000&q=80',

  //       new Ingredient("oil", 4)
  //     ]),
  // ];

  private recipes: Recipe[] = [];
  emitRecipes = new Subject<Recipe[]>();

  constructor() { }

  getRecipes() {
    return this.recipes.slice();
  }


  overrideRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.emitRecipes.next(this.recipes.slice());
  }

  getRecipeById(id: number) {
    return this.recipes.slice().find(recipe => recipe.id === id);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.emitRecipes.next(this.recipes.slice());
  }

  editRecipe(index: number, name: string, description: string, image: string, ingredients: []) {
    const recipes = this.recipes.find(i => i.id === index);
    if (recipes?.name) {
      recipes.name = name
      recipes.description = description
      recipes.imagePath = image
      recipes.ingredients = ingredients
    }
    this.emitRecipes.next(this.recipes.slice());
  }

  deleteRecipeById(index: number) {
    this.recipes.splice(this.recipes.findIndex(recipe => recipe.id === index), 1);
    this.emitRecipes.next(this.recipes.slice());
  }
}
