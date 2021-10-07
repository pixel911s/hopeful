import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ErrorPageComponent } from "./error/error-page.component";
import { FroceChangePasswordComponent } from "./froce-change-password/froce-change-password.component";
import { LoginPageComponent } from "./login/login-page.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "error",
        component: ErrorPageComponent,
        data: {
          title: "Error Page",
        },
      },
      {
        path: "login",
        component: LoginPageComponent,
        data: {
          title: "Login Page",
        },
      },
      {
        path: "froce-change-password",
        component: FroceChangePasswordComponent,
        data: {
          title: "Froce Change Password",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentPagesRoutingModule {}
