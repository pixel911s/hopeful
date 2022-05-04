import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "app/shared/shared.module";
import { UserInfoRoutingModule } from "./user-info-routing.module";
import { UserInfoComponent } from "./user-info.component";

@NgModule({
  imports: [CommonModule, SharedModule, UserInfoRoutingModule],
  exports: [],
  declarations: [UserInfoComponent],
  providers: [],
})
export class UserInfoModule {}
