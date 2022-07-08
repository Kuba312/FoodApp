import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.sass']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {


  subscription!: Subscription;
  formGroup!: FormGroup;
  showEditForm = false;
  clearMode = false;
  editableIngridient = 0;
  name = '';
  amount = 0;
  deleteMode = false;

  constructor(private shoppingListService: ShoppingListService,
    private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'amount': new FormControl(null, [Validators.required, Validators.min(1)])
    });
    this.subscription = this.shoppingListService.startedEditing.subscribe(id => {
      this.showEditForm = true;
      this.editableIngridient = id;
      const { name, amount } = this.shoppingListService.getIngredient(id);
      this.name = name;
      this.amount = amount;
    })
  }


  onSubmit() {
    const { name, amount } = this.formGroup.value;
    const ingredient = new Ingredient(name, amount);
    if (this.showEditForm) {
      this.shoppingListService.editIngridient(this.editableIngridient, ingredient)
    } else {
      this.shoppingListService.addIngredient(ingredient)
    }
    this.showEditForm = false;
    this.reset();
  }

  onClear() {
    this.reset();
    this.showEditForm = false;
  }

  deleteItem() {
    this.onClear();
    this.shoppingListService.deleteIngridient(this.editableIngridient);
  }


  private reset() {
    this.formGroup.reset();
  }
}
