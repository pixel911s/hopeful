import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let isAuth = this.authService.isAuthenticated();
    if (!isAuth) {
      this.router.navigate(["/pages/login"]);
      this.authService.logout();
    }

    if (
      (("MANAGE_USER" == route.routeConfig.data.id ||
        "VIEW_USER" == route.routeConfig.data.id) &&
        !this.authService.getUser().function.CREATE_USER &&
        !this.authService.getUser().function.VIEW_USER) ||
      ("CREATE_USER" == route.routeConfig.data.id &&
        !this.authService.getUser().function.CREATE_USER)
    ) {
      this.authService.logout();
    }

    if (
      (("MANAGE_AGENT" == route.routeConfig.data.id ||
        "VIEW_AGENT" == route.routeConfig.data.id) &&
        !this.authService.getUser().function.CREATE_AGENT &&
        !this.authService.getUser().function.VIEW_AGENT) ||
      ("CREATE_AGENT" == route.routeConfig.data.id &&
        !this.authService.getUser().function.CREATE_AGENT)
    ) {
      this.authService.logout();
    }

    return true;
  }
}
