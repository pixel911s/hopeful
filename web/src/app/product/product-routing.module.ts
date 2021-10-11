import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "app/shared/auth/auth-guard.service";
import { CreateProductComponent } from "./create/create-product.component";
import { SearchProductComponent } from "./search/search-product.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: SearchProductComponent,
        data: { name: "จัดการข้อมูลสินค้า", id: "MANAGE_PRODUCT" },
        canActivate: [AuthGuard],
      },
      {
        path: "create",
        component: CreateProductComponent,
        data: { name: "เพิ่มข้อมูลสินค้า", id: "CREATE_PRODUCT" },
        canActivate: [AuthGuard],
      },
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

export const ProductRoutingModule = RouterModule.forChild(routes);
