import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "app/shared/auth/auth-guard.service";
import { SearchAgentProductComponent } from "./search/search-agent-product.component";
import { UpdateAgentProductComponent } from "./update/update-agent-product.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: SearchAgentProductComponent,
        data: {
          name: "จัดการข้อมูลสินค้าของตัวแทนจำหน่าย",
          id: "AGENT_PRODUCT",
        },
        canActivate: [AuthGuard],
      },
      // {
      //   path: "create",
      //   component: CreateProductComponent,
      //   data: { name: "เพิ่มข้อมูลสินค้า", id: "CREATE_PRODUCT" },
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: "view/:id",
      //   component: ViewProductComponent,
      //   data: { name: "ดูข้อมูลสินค้า", id: "VIEW_PRODUCT" },
      //   canActivate: [AuthGuard],
      // },
      {
        path: "update/:id",
        component: UpdateAgentProductComponent,
        data: { name: "แก้ไขข้อมูลสินค้า", id: "AGENT_PRODUCT" },
        canActivate: [AuthGuard],
      },
    ],
  },
];

export const AgentProductRoutingModule = RouterModule.forChild(routes);
