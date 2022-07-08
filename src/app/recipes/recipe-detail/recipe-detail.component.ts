import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.sass']
})
export class RecipeDetailComponent implements OnInit {

  detailsRecipe?: Recipe


  constructor(private shoppingListService: ShoppingListService,
    private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) {
  }


  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.detailsRecipe = this.recipeService.getRecipeById(+params['id']);
        }
      )
    // console.log(this.recipeService.getRecipeByName('Burger'))
  }


  addIngredientsToShoppingList() {
    if (this.detailsRecipe)
      this.shoppingListService.addIngredients(this.detailsRecipe.ingredients);
  }

  deleteRecipe(){
    this.router.navigate(['../'], { relativeTo: this.route })
    this.recipeService.deleteRecipeById(this.detailsRecipe?.id as number);

  }

}
