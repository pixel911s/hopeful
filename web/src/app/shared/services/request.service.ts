import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class RequestService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  search(criteria) {
    return this.http
      .post(environment.apiUrl + "/request/search", criteria)
      .toPromise();
  }

  approve(data) {
    data.username = this.authService.getUser().username;

    return this.http
      .post(environment.apiUrl + "/request/approve", data)
      .toPromise();
  }

  get(id) {
    let criteria = {
      id: id,
      businessType: this.authService.getUser().business.businessType,
      username: this.authService.getUser().username,
    };

    return this.http
      .post(environment.apiUrl + "/request/get", criteria)
      .toPromise();
  }
}
