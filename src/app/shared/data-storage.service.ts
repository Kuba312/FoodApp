import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  DATA_LINK = 'https://ng-course-recipe-book-1709c-default-rtdb.europe-west1.firebasedatabase.app/recipies.json';

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }


  onSaveRecipies() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.DATA_LINK, recipes).subscribe(response => {
      console.log(response);
    })
  }


// in order to fetch data from database we need to be authenticated. We have to send modified param
// with user token and that's why we are using auth-interceptor.
// In this method we fetch data from appropriate link and we map (modify) our response.
// we return new object with recpie and ingredients where we tell when we have ingridients we pass them otherwise
// we pass empty array
// at the end we are using tap method in order to not modify a chain of respone and we ovveride existing recpipes with new one.
  onFetchRecipes() {
    return this.http
      .get<Recipe[]>(
        this.DATA_LINK
      ).pipe(map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
        tap(recipes => {
          this.recipeService.overrideRecipes(recipes);
        }))
  }
}






