import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "app/shared/auth/auth-guard.service";
import { CreateOrderComponent } from "./create/create-order.component";
import { SearchOrderComponent } from "./search/search-order.component";
import { UpdateOrderComponent } from "./update/update-order.component";
import { ViewOrderComponent } from "./view/view-order.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: SearchOrderComponent,
        data: { name: "จัดการข้อมูลคำสั่งซื้อ", id: "MANAGE_ORDER" },
        canActivate: [AuthGuard],
      },
      {
        path: "create",
        component: CreateOrderComponent,
        data: { name: "สร้างคำสั่งซื้อ", id: "CREATE_ORDER" },
        canActivate: [AuthGuard],
      },
      {
        path: "view/:id",
        component: ViewOrderComponent,
        data: { name: "ดูข้อมูลคำสั่งซื้อ", id: "VIEW_ORDER" },
        canActivate: [AuthGuard],
      },
      {
        path: "update/:id",
        component: UpdateOrderComponent,
        data: { name: "แก้ไขคำสั่งซื้อ", id: "CREATE_ORDER" },
        canActivate: [AuthGuard],
      },
    ],
  },
];

export const OrderRoutingModule = RouterModule.forChild(routes);
