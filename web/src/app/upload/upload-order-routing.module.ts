import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "app/shared/auth/auth-guard.service";
import { SearchUploadComponent } from "./search-upload/search-upload.component";
const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: SearchUploadComponent,
        data: { name: "ประวัติการอัพโหลดออเดอร์", id: "UPLOAD_ORDER" },
        canActivate: [AuthGuard],
      },
    ],
  },
];

export const UploadOrderRoutingModule = RouterModule.forChild(routes);
