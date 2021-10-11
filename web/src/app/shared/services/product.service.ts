import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class ProductService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  gets() {
    return this.http
      .post(environment.apiUrl + "/product/gets", null)
      .toPromise();
  }

  search(criteria) {
    return this.http
      .post(environment.apiUrl + "/product/search", criteria)
      .toPromise();
  }

  save(data) {
    data.updateUser = this.authService.getUser().username;

    const fd = new FormData();
    if (data.newImageFlag) {
      fd.append("image", data.tmpNewImage);
      data.tmpNewImage = undefined;
    }

    fd.append("data", JSON.stringify(data));

    return this.http.post(environment.apiUrl + "/product/save", fd).toPromise();
  }

  get(code) {
    let criteria = {
      code: code,
    };
    return this.http
      .post(environment.apiUrl + "/product/get", criteria)
      .toPromise();
  }
}
