import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.sass']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[] = [];
  private cleanIngredients!: Subscription;



  constructor(private shoppingListService: ShoppingListService,
    private loggingService: LoggingService) {

  }


  ngOnInit(): void {
    this.loggingService.printLog('Hello from shoppingListComponent')
    this.cleanIngredients = this.shoppingListService.ingredientItems.subscribe((ingredients: Ingredient[]) => {
      this.ingredients = ingredients;
    })
    this.ingredients = this.shoppingListService.getIngredients();
  }

  ngOnDestroy(): void {
    this.cleanIngredients.unsubscribe();
  }

  onEditItem(ingredientIndex: number){
    this.shoppingListService.startedEditing.next(ingredientIndex);
  }

}
