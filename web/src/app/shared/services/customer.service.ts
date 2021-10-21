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
}
