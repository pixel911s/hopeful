import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { CRMRoutingModule } from "./crm-routing.module";
import { InqCRMComponent } from "./search/inq-crm.component";
import { MainCRMComponent } from "./main/main-crm.component";
import { CreateNoteComponent } from "./includes/create-note/create-notecomponent";
import { ManageTodoComponent } from "./includes/manage-todo/manage-todo.component";
import { UpdateCustomerComponent } from "./includes/update-customer/update-customer.component";
import { ChangeOwnerComponent } from "./includes/change-owner/change-owner.component";
import { ChangeEndDoseComponent } from "./includes/change-end-dose/change-end-dose.component";
import { ManageAddressComponent } from "./includes/manage-address/manage-address.component";
import { FromAddressComponent } from "./includes/from-address/from-address.component";

@NgModule({
  imports: [CommonModule, SharedModule, CRMRoutingModule],
  declarations: [
    InqCRMComponent,
    MainCRMComponent,
    CreateNoteComponent,
    ManageTodoComponent,
    UpdateCustomerComponent,
    ChangeOwnerComponent,
    ChangeEndDoseComponent,
    ManageAddressComponent,
    FromAddressComponent,
  ],
  entryComponents: [
    CreateNoteComponent,
    ManageTodoComponent,
    UpdateCustomerComponent,
    ChangeOwnerComponent,
    ChangeEndDoseComponent,
    ManageAddressComponent,
    FromAddressComponent,
  ],
})
export class CRMModule {}
