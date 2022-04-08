import { Routes, RouterModule } from "@angular/router";
import { SetupAgentComponent } from "app/agent/setup/setup-agent.component";
import { AuthGuard } from "app/shared/auth/auth-guard.service";
import { CreateActivityDateConfigComponent } from "./manage-activity-date/create/create.component";
import { ManageActivityDateComponent } from "./manage-activity-date/search/manage-activity-date.component";
import { UpdateActivityDateConfigComponent } from "./manage-activity-date/update/update.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "activity-date",
        component: ManageActivityDateComponent,
        data: { name: "จัดการแทปวันที่ใน CRM", id: "MANAGE_ACTIVITY_DATE" },
        canActivate: [AuthGuard],
      },
      {
        path: "activity-date/create",
        component: CreateActivityDateConfigComponent,
        data: {
          name: "เพิ่มข้อมูลแทปวันที่ใน CRM",
          id: "CREATE_ACTIVITY_DATE",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "activity-date/update/:id",
        component: UpdateActivityDateConfigComponent,
        data: { name: "แก้ไขข้อมูลตัวแทนจำหน่าย", id: "UPDATE_ACTIVITY_DATE" },
        canActivate: [AuthGuard],
      },
      {
        path: "agent",
        component: SetupAgentComponent,
        data: { name: "ตั้งค่าตัวแทนจำหน่าย", id: "SETUP_AGENT" },
        canActivate: [AuthGuard],
      },
    ],
  },
];

export const SettingRoutingModule = RouterModule.forChild(routes);
