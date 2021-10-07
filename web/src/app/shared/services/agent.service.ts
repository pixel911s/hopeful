import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class AgentService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  gets() {
    return this.http.post(environment.apiUrl + "/agent/gets", null).toPromise();
  }

  search(criteria) {
    return this.http
      .post(environment.apiUrl + "/agent/search", criteria)
      .toPromise();
  }

  save(data) {
    data.updateUser = this.authService.getUser().username;

    return this.http.post(environment.apiUrl + "/agent/save", data).toPromise();
  }

  get(code) {
    let criteria = {
      code: code,
    };
    return this.http
      .post(environment.apiUrl + "/agent/get", criteria)
      .toPromise();
  }
}
