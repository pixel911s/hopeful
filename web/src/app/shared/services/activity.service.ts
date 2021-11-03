import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class ActivityService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  search(data) {
    data.username = this.authService.getUser().username;
    data.businessId =
      this.authService.getUser().business.businessType == "H"
        ? this.authService.getUser().businessId
        : null;
    return this.http
      .post(environment.apiUrl + "/activity/searchList", data)
      .toPromise();
  }

  getSummaryActivityCount(data) {
    data.username = this.authService.getUser().username;
    data.businessId =
      this.authService.getUser().business.businessType == "H"
        ? this.authService.getUser().businessId
        : null;
    return this.http
      .post(environment.apiUrl + "/activity/getSummaryActivityCount", data)
      .toPromise();
  }
}
