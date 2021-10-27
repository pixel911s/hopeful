import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { SearchRequestComponent } from "./search/search-request.component";
import { RequestRoutingModule } from "./request-routing.module";
import { ApproveRequestComponent } from "./approve/approve-request.component";
import { ViewRequestComponent } from "./view/view-request.component";

@NgModule({
  imports: [CommonModule, SharedModule, RequestRoutingModule],
  declarations: [
    SearchRequestComponent,
    ApproveRequestComponent,
    ViewRequestComponent,
  ],
  entryComponents: [],
})
export class RequestModule {}
