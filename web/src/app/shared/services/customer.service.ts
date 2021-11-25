import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class CustomerService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getByMobile(mobile) {
    let criteria = {
      mobile: mobile,
    };
    return this.http
      .post(environment.apiUrl + "/customer/getByMobile", criteria)
      .toPromise();
  }

  getById(id) {
    let criteria = {
      id: id,
      userAgents: this.authService.getUser().userAgents,
    };

    if (this.authService.getUser().business.businessType == "H") {
      criteria.userAgents.unshift({ id: 1, name: "HQ" });
    }
    return this.http
      .post(environment.apiUrl + "/customer/get", criteria)
      .toPromise();
  }

  updateProfile(data) {
    data.username = this.authService.getUser().username;

    return this.http
      .post(environment.apiUrl + "/customer/updateProfile", data)
      .toPromise();
  }
}
