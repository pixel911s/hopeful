import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class UserConfigService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  saveActivityDateConfig(data) {
    data.username = this.authService.getUser().username;
    return this.http
      .post(environment.apiUrl + "/config/activityDate/save", data)
      .toPromise();
  }

  getActivityDateConfigByUsername(type) {
    let data = {
      username: this.authService.getUser().username,
      type: type,
    };

    return this.http
      .post(environment.apiUrl + "/config/activityDate/gets", data)
      .toPromise();
  }

  getActivityDateConfig(id) {
    let criteria = {
      id: id,
    };
    return this.http
      .post(environment.apiUrl + "/config/activityDate/get", criteria)
      .toPromise();
  }

  deleteActivityDateConfig(id) {
    let criteria = {
      id: id,
    };
    return this.http
      .post(environment.apiUrl + "/config/activityDate/delete", criteria)
      .toPromise();
  }
}
