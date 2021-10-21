import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "app/shared/auth/auth-guard.service";
import { CreateProductComponent } from "./create/create-product.component";
import { SearchProductComponent } from "./search/search-product.component";
import { UpdateProductComponent } from "./update/update-product.component";
import { ViewProductComponent } from "./view/view-product.component";

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
      {
        path: "view/:id",
        component: ViewProductComponent,
        data: { name: "ดูข้อมูลสินค้า", id: "VIEW_PRODUCT" },
        canActivate: [AuthGuard],
      },
      {
        path: "update/:id",
        component: UpdateProductComponent,
        data: { name: "แก้ไขข้อมูลสินค้า", id: "CREATE_PRODUCT" },
        canActivate: [AuthGuard],
      },
    ],
  },
];

export const ProductRoutingModule = RouterModule.forChild(routes);
