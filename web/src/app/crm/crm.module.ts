import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { CRMRoutingModule } from "./crm-routing.module";
import { InqCRMComponent } from "./search/inq-crm.component";
import { MainCRMComponent } from "./main/main-crm.component";

@NgModule({
  imports: [CommonModule, SharedModule, CRMRoutingModule],
  declarations: [InqCRMComponent, MainCRMComponent],
  entryComponents: [],
})
export class CRMModule {}
