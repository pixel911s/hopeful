import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/shared/auth/auth-guard.service';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: "",
    component: SearchComponent,
    data: { name: "SMS Dashboard", id: "SMS_DASHBOARD" },
    canActivate: [AuthGuard],
  },
];

export const SmsDashboardRoutes = RouterModule.forChild(routes);
