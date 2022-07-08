import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { OrderRoutingModule } from './order-routing.module';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';



@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    OrderRoutingModule
  ],
  exports: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  // providers: [LoggingService]
})
export class OrderModule { }
