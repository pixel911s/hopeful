import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { ProductRoutingModule } from "./product-routing.module";
import { SearchProductComponent } from "./search/search-product.component";
import { CreateProductComponent } from "./create/create-product.component";
import { ProductDetailComponent } from "./includes/detail/product-detail.component";
import { PriceListFormComponent } from "./includes/pricelist-form/pricelist-form.component";
import { UpdateProductComponent } from "./update/update-product.component";
import { ViewProductComponent } from "./view/view-product.component";

@NgModule({
  imports: [CommonModule, SharedModule, ProductRoutingModule],
  declarations: [
    SearchProductComponent,
    CreateProductComponent,
    ProductDetailComponent,
    PriceListFormComponent,
    ViewProductComponent,
    UpdateProductComponent,
  ],
  entryComponents: [PriceListFormComponent],
})
export class ProductModule {}
