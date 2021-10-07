import { Routes, RouterModule } from "@angular/router";
import { SearchUserComponent } from "./search/search-user.component";
import { CreateUserComponent } from "./create/create-user.component";
import { ViewUserComponent } from "./view/view-user.component";
import { UpdateUserComponent } from "./update/update-user.component";
import { AuthGuard } from "app/shared/auth/auth-guard.service";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: SearchUserComponent,
        data: { name: "จัดการข้อมูลผู้ใช้งาน", id: "MANAGE_USER" },
        canActivate: [AuthGuard],
      },
      {
        path: "create",
        component: CreateUserComponent,
        data: { name: "เพิ่มผู้ใช้งาน", id: "CREATE_USER" },
        canActivate: [AuthGuard],
      },
      {
        path: "view/:id",
        component: ViewUserComponent,
        data: { name: "ข้อมูลผู้ใช้งาน", id: "VIEW_USER" },
        canActivate: [AuthGuard],
      },
      {
        path: "update/:id",
        component: UpdateUserComponent,
        data: { name: "แก้ไขผู้ใช้งาน", id: "CREATE_USER" },
        canActivate: [AuthGuard],
      },
    ],
  },
];

export const UserRoutingModule = RouterModule.forChild(routes);
