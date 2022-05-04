import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserInfoComponent } from "./user-info.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: UserInfoComponent,
        data: { name: "แก้ไขข้อมูลส่วนตัว" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserInfoRoutingModule {}
