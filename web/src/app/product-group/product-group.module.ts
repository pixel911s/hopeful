import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { ProductGroupRoutingModule } from "./product-group-routing.module";
import { SearchProductGroupComponent } from "./search/search-product-group.component";
import { CreateProductGroupComponent } from "./create/create-product-group.component";
import { ProductGroupDetailComponent } from "./includes/detail/product-group-detail.component";
import { ViewProductGroupComponent } from "./view/view-product-group.component";
import { UpdateProductGroupComponent } from "./update/update-product-group.component";

@NgModule({
  imports: [CommonModule, SharedModule, ProductGroupRoutingModule],
  declarations: [
    SearchProductGroupComponent,
    CreateProductGroupComponent,
    ProductGroupDetailComponent,
    ViewProductGroupComponent,
    UpdateProductGroupComponent,
  ],
  entryComponents: [
  ],
})

export class ProductGroupModule {}