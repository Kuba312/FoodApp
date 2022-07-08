import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.sass']
})
export class RecipeEditComponent implements OnInit {

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  editMode!: boolean;
  form!: FormGroup;
  id!: number;

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      )

  }

  private initForm() {
    let recipeName = '';
    let imgUrl = ''
    let description = '';
    let ingredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipeById(this.id);
      recipeName = recipe?.name as string;
      description = recipe?.description as string;
      imgUrl = recipe?.imagePath as string;
      if (recipe?.ingredients) {
        recipe?.ingredients.forEach(ingredient => {
          ingredients.push(new FormGroup({
            'name': new FormControl(ingredient.name, Validators.required),
            'amount': new FormControl(ingredient.amount, [Validators.required, Validators.min(1)])
          }));
        })
      }
    }
    this.form = new FormGroup({
      "name": new FormControl(recipeName, Validators.required),
      "description": new FormControl(description, Validators.required),
      "image": new FormControl(imgUrl, Validators.required),
      "ingredients": ingredients
    });
  }

  addRecipe() {
    const randomId = Math.round(Math.random() * (300 - 3)) + 3;
    const { name, description, image, ingredients } = this.form.value;
    if (this.editMode) {
      this.recipeService.editRecipe(this.id, name, description, image, ingredients)
    } else {
      this.recipeService.addRecipe(new Recipe(randomId, name, description, image, ingredients))
    }
    this.cancel();
  }

  cancel() {
    this.router.navigate([['../'], { relativeTo: this.route }])
    this.form.reset();
  }

  onAddIngredients() {
    (<FormArray>this.form.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.min(1)])
      })
    )
  }
  removeIngridient(index: number) {
    return this.getIngredients().splice(index, 1);

  }


  getIngredients() {
    return (<FormArray>this.form.get('ingredients')).controls;
  }

}
