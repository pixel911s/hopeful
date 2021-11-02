import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { SettingRoutingModule } from "./setting-routing.module";
import { ManageActivityDateComponent } from "./manage-activity-date/search/manage-activity-date.component";
import { ActivityDateConfigDetailComponent } from "./manage-activity-date/includes/detail.component";
import { CreateActivityDateConfigComponent } from "./manage-activity-date/create/create.component";
import { UpdateActivityDateConfigComponent } from "./manage-activity-date/update/update.component";

@NgModule({
  imports: [CommonModule, SharedModule, SettingRoutingModule],
  declarations: [
    ManageActivityDateComponent,
    ActivityDateConfigDetailComponent,
    CreateActivityDateConfigComponent,
    UpdateActivityDateConfigComponent,
  ],
  entryComponents: [],
})
export class SettingModule {}
