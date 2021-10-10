import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { SearchUserComponent } from "./search/search-user.component";
import { UserRoutingModule } from "./user-routing.module";
import { CreateUserComponent } from "./create/create-user.component";
import { UserDetailComponent } from "./includes/detail/user-detail.component";
import { ViewUserComponent } from "./view/view-user.component";
import { UpdateUserComponent } from "./update/update-user.component";
import { AngularDualListBoxModule } from "angular-dual-listbox";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    AngularDualListBoxModule,
  ],
  declarations: [
    SearchUserComponent,
    CreateUserComponent,
    UserDetailComponent,
    ViewUserComponent,
    UpdateUserComponent,
  ],
  entryComponents: [],
})
export class UserModule {}
