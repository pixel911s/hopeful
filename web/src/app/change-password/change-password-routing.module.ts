import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChangePasswordComponent } from "./change-password.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: ChangePasswordComponent,
        data: { name: "Change Password" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePasswordRoutingModule {}
