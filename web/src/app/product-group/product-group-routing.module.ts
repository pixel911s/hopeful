import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "app/shared/auth/auth-guard.service";
import { CreateProductGroupComponent } from "./create/create-product-group.component";
import { SearchProductGroupComponent } from "./search/search-product-group.component";
import { UpdateProductGroupComponent } from "./update/update-product-group.component";
import { ViewProductGroupComponent } from "./view/view-product-group.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: SearchProductGroupComponent,
        data: { name: "จัดการกลุ่มสินค้า", id: "MANAGE_PRODUCT_GROUP" },
        canActivate: [AuthGuard],
      },
      {
        path: "create",
        component: CreateProductGroupComponent,
        data: { name: "เพิ่มข้อมูลกลุ่มสินค้า", id: "CREATE_PRODUCT_GROUP" },
        canActivate: [AuthGuard],
      },
      {
        path: "view/:id",
        component: ViewProductGroupComponent,
        data: { name: "ดูข้อมูลกลุ่มสินค้า", id: "VIEW_PRODUCT_GROUP" },
        canActivate: [AuthGuard],
      },
      {
        path: "update/:id",
        component: UpdateProductGroupComponent,
        data: { name: "แก้ไขข้อมูลกลุ่มสินค้า", id: "CREATE_PRODUCT_GROUP" },
        canActivate: [AuthGuard],
      },
    ],
  },
];

export const ProductGroupRoutingModule = RouterModule.forChild(routes);