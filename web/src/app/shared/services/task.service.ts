import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class TaskService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  save(data) {
    data.username = this.authService.getUser().username;

    return this.http.post(environment.apiUrl + "/task/save", data).toPromise();
  }

  getOpenTask(customerId = null) {
    let data = {
      username: this.authService.getUser().username,
      customerId: customerId,
    };
    return this.http
      .post(environment.apiUrl + "/task/getOpenTask", data)
      .toPromise();
  }

  getCloseTask(customerId = null) {
    let data = {
      username: this.authService.getUser().username,
      customerId: customerId,
    };
    return this.http
      .post(environment.apiUrl + "/task/getCloseTask", data)
      .toPromise();
  }

  closeTask(id) {
    let data = {
      username: this.authService.getUser().username,
      id: id,
    };

    return this.http
      .post(environment.apiUrl + "/task/closeTask", data)
      .toPromise();
  }

  recallTask(id) {
    let data = {
      username: this.authService.getUser().username,
      id: id,
    };

    return this.http
      .post(environment.apiUrl + "/task/recallTask", data)
      .toPromise();
  }
}
