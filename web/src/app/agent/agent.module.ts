import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { AgentRoutingModule } from "./agent-routing.module";
import { SearchAgentComponent } from "./search/search-agent.component";
import { AgentDetailComponent } from "./includes/agent-detail.component";
import { CreateAgentComponent } from "./create/create-agent.component";
import { UpdateAgentComponent } from "./update/update-agent.component";
import { ViewAgentComponent } from "./view/view-agent.component";

@NgModule({
  imports: [CommonModule, SharedModule, AgentRoutingModule],
  declarations: [
    SearchAgentComponent,
    CreateAgentComponent,
    AgentDetailComponent,
    ViewAgentComponent,
    UpdateAgentComponent,
  ],
  entryComponents: [],
})
export class AgentModule {}
