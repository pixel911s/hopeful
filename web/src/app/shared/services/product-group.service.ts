import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class ProductGroupService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  gets() {
    return this.http
      .post(environment.apiUrl + "/product-group/gets", null)
      .toPromise();
  }

  getProductGroups() {
    return this.http
      .post(environment.apiUrl + "/product-group/getProductGroups", null)
      .toPromise();
  }

  search(criteria) {
    return this.http
      .post(environment.apiUrl + "/product-group/search", criteria)
      .toPromise();
  }

  save(data) {
    data.updateUser = this.authService.getUser().username;
    const fd = new FormData();
    fd.append("data", JSON.stringify(data));
    return this.http.post(environment.apiUrl + "/product-group/save", fd).toPromise();
  }

  get(code) {
    let criteria = {
      id: code,
    };
    return this.http
      .post(environment.apiUrl + "/product-group/get", criteria)
      .toPromise();
  }

  remove(code) {
    let criteria = {
      id: code,
    };
    return this.http
      .post(environment.apiUrl + "/product-group/deleteProductGroup", criteria)
      .toPromise();
  }
}
