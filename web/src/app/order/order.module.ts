import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { OrderRoutingModule } from "./order-routing.module";
import { SearchOrderComponent } from "./search/search-order.component";
import { SelectProductComponent } from "./includes/select-product/select-product.component";
import { CreateOrderComponent } from "./create/create-order.component";
import { OrderFormComponent } from "./includes/form/order-form.component";
import { UpdateOrderComponent } from "./update/update-order.component";
import { ViewOrderComponent } from "./view/view-order.component";

@NgModule({
  imports: [CommonModule, SharedModule, OrderRoutingModule],
  declarations: [
    CreateOrderComponent,
    SearchOrderComponent,
    OrderFormComponent,
    SelectProductComponent,
    UpdateOrderComponent,
    ViewOrderComponent,
  ],
  entryComponents: [SelectProductComponent],
})
export class OrderModule {}
