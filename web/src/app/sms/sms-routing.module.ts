import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "app/shared/auth/auth-guard.service";
import { ManageSMSComponent } from "./manage-sms/manage-sms.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: ManageSMSComponent,
        data: { name: "Manual SMS", id: "SENDSMS" },
        canActivate: [AuthGuard],
      },
    ],
  },
];

export const SMSRoutingModule = RouterModule.forChild(routes);
