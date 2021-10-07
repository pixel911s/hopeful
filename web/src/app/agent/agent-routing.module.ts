import { Routes, RouterModule } from "@angular/router";
import { SearchAgentComponent } from "./search/search-agent.component";
import { AuthGuard } from "app/shared/auth/auth-guard.service";
import { CreateAgentComponent } from "./create/create-agent.component";
import { UpdateAgentComponent } from "./update/update-agent.component";
import { ViewAgentComponent } from "./view/view-agent.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: SearchAgentComponent,
        data: { name: "จัดการข้อมูลตัวแทนจำหน่าย", id: "MANAGE_AGENT" },
        canActivate: [AuthGuard],
      },
      {
        path: "create",
        component: CreateAgentComponent,
        data: { name: "เพิ่มข้อมูลตัวแทนจำหน่าย", id: "CREATE_AGENT" },
        canActivate: [AuthGuard],
      },
      {
        path: "view/:id",
        component: ViewAgentComponent,
        data: { name: "ดูข้อมูลตัวแทนจำหน่าย", id: "VIEW_AGENT" },
        canActivate: [AuthGuard],
      },
      {
        path: "update/:id",
        component: UpdateAgentComponent,
        data: { name: "แก้ไขข้อมูลตัวแทนจำหน่าย", id: "CREATE_AGENT" },
        canActivate: [AuthGuard],
      },
    ],
  },
];

export const AgentRoutingModule = RouterModule.forChild(routes);
