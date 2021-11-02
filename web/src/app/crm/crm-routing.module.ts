import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "app/shared/auth/auth-guard.service";
import { InqCRMComponent } from "./search/inq-crm.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: InqCRMComponent,
        data: { name: "จัดการข้อมูลCRM", id: "MANAGE_CRM" },
        canActivate: [AuthGuard],
      },
      // {
      //   path: "create",
      //   component: CreateAgentComponent,
      //   data: { name: "เพิ่มข้อมูลตัวแทนจำหน่าย", id: "CREATE_AGENT" },
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: "view/:id",
      //   component: ViewAgentComponent,
      //   data: { name: "ดูข้อมูลตัวแทนจำหน่าย", id: "VIEW_AGENT" },
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: "update/:id",
      //   component: UpdateAgentComponent,
      //   data: { name: "แก้ไขข้อมูลตัวแทนจำหน่าย", id: "CREATE_AGENT" },
      //   canActivate: [AuthGuard],
      // },
    ],
  },
];

export const CRMRoutingModule = RouterModule.forChild(routes);
