import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChangePasswordComponent } from "./change-password.component";
import { ChangePasswordRoutingModule } from "./change-password-routing.module";
import { SharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [CommonModule, SharedModule, ChangePasswordRoutingModule],
  exports: [],
  declarations: [ChangePasswordComponent],
  providers: [],
})
export class ChangePasswordModule {}
