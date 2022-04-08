import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { SearchAgentProductComponent } from "./search/search-agent-product.component";
import { AgentProductRoutingModule } from "./agent-product-routing.module";
import { UpdateAgentProductComponent } from "./update/update-agent-product.component";
import { AgentProductDetailComponent } from "./includes/detail/agent-product-detail.component";

@NgModule({
  imports: [CommonModule, SharedModule, AgentProductRoutingModule],
  declarations: [
    SearchAgentProductComponent,
    UpdateAgentProductComponent,
    AgentProductDetailComponent,
  ],
  entryComponents: [],
})
export class AgentProductModule {}
