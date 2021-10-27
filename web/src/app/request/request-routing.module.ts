import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "app/shared/auth/auth-guard.service";
import { ApproveRequestComponent } from "./approve/approve-request.component";
import { SearchRequestComponent } from "./search/search-request.component";
import { ViewRequestComponent } from "./view/view-request.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: SearchRequestComponent,
        data: { name: "จัดการข้อมูลคำขอ", id: "MANAGE_REQUEST" },
        canActivate: [AuthGuard],
      },

      // {
      //   path: "create",
      //   component: CreateOrderComponent,
      //   data: { name: "สร้างคำสั่งซื้อ", id: "CREATE_ORDER" },
      //   canActivate: [AuthGuard],
      // },
      {
        path: "view/:id",
        component: ViewRequestComponent,
        data: { name: "ดูข้อมูลคำขอ", id: "VIEW_REQUEST" },
        canActivate: [AuthGuard],
      },
      {
        path: "approve/:id",
        component: ApproveRequestComponent,
        data: { name: "จัดการคำขอ", id: "APPROVE_REQUEST" },
        canActivate: [AuthGuard],
      },
    ],
  },
];

export const RequestRoutingModule = RouterModule.forChild(routes);
