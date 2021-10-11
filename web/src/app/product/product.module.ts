import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { ProductRoutingModule } from "./product-routing.module";
import { SearchProductComponent } from "./search/search-product.component";
import { CreateProductComponent } from "./create/create-product.component";
import { ProductDetailComponent } from "./includes/detail/product-detail.component";

@NgModule({
  imports: [CommonModule, SharedModule, ProductRoutingModule],
  declarations: [
    SearchProductComponent,
    CreateProductComponent,
    ProductDetailComponent,
    // AgentDetailComponent,
    // ViewAgentComponent,
    // UpdateAgentComponent,
  ],
  entryComponents: [],
})
export class ProductModule {}
