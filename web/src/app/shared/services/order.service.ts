import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

import { saveAs } from "file-saver";

@Injectable({ providedIn: "root" })
export class OrderService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  get(id) {
    let criteria = {
      id: id,
      userAgents: this.authService.getUser().userAgents,
    };

    if (this.authService.getUser().business.businessType == "H") {
      criteria.userAgents.unshift({ id: 1, name: "HQ" });
    }

    return this.http
      .post(environment.apiUrl + "/order/get", criteria)
      .toPromise();
  }

  search(criteria) {
    criteria.shopId = this.authService.getUser().shopId;

    return this.http
      .post(environment.apiUrl + "/order/search", criteria)
      .toPromise();
  }

  delete(id) {
    let criteria = {
      id: id,
    };

    return this.http
      .post(environment.apiUrl + "/order/deleteOrder", criteria)
      .toPromise();
  }

  save(data) {
    data.username = this.authService.getUser().username;
    return this.http
      .post(environment.apiUrl + "/order/update", data)
      .toPromise();
  }

  create(data) {
    data.ownerId = this.authService.getUser().businessId;
    data.username = this.authService.getUser().username;
    return this.http
      .post(environment.apiUrl + "/order/create", data)
      .toPromise();
  }

  upload(data) {
    data.ownerId = this.authService.getUser().businessId;
    data.username = this.authService.getUser().username;
    return this.http
      .post(environment.apiUrl + "/order/upload", data)
      .toPromise();
  }

  private async export(url, param, filename) {
    const res: any = await this.http
      .post(environment.apiUrl + url, param, {
        responseType: "blob",
      })
      .subscribe(
        (data) => saveAs(data, filename),
        (error) => console.log(error)
      );
  }

  public exportTemplate() {
    const url = "/order/exportTemplate";
    this.export(url, null, "ORDER_TEMPLATE.xlsx");
  }
}
