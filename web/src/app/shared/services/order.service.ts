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

  searchUpload(criteria) {
    criteria.username = this.authService.getUser().username;

    return this.http
      .post(environment.apiUrl + "/order/searchUpload", criteria)
      .toPromise();
  }

  deleteUpload(item) {
    return this.http
      .post(environment.apiUrl + "/order/deleteByUpload", item)
      .toPromise();
  }

  delete(id) {
    let criteria = {
      id: id,
      username: this.authService.getUser().username,
    };

    return this.http
      .post(environment.apiUrl + "/order/deleteOrder", criteria)
      .toPromise();
  }

  updateStatus(data) {
    data.username = this.authService.getUser().username;
    data.ownerId = this.authService.getUser().businessId;

    return this.http
      .post(environment.apiUrl + "/order/updateStatus", data)
      .toPromise();
  }

  save(data) {
    data.username = this.authService.getUser().username;

    const fd = new FormData();
    if (data.newImageFlag) {
      fd.append("image", data.tmpNewImage);
      data.tmpNewImage = undefined;
      data.imageUrl = undefined;
    }

    fd.append("data", JSON.stringify(data));

    return this.http.post(environment.apiUrl + "/order/update", fd).toPromise();
  }

  create(data) {
    data.ownerId = this.authService.getUser().businessId;
    data.username = this.authService.getUser().username;

    const fd = new FormData();
    if (data.newImageFlag) {
      fd.append("image", data.tmpNewImage);
      data.tmpNewImage = undefined;
      data.imageUrl = undefined;
    }

    data.userAgents = this.authService.getUser().userAgents;

    if (this.authService.getUser().business.businessType == "H") {
      data.userAgents.unshift({ id: 1, name: "HQ" });
    }

    fd.append("data", JSON.stringify(data));

    return this.http.post(environment.apiUrl + "/order/create", fd).toPromise();
  }

  upload(data) {
    data.ownerId = this.authService.getUser().businessId;
    data.username = this.authService.getUser().username;
    data.userAgents = this.authService.getUser().userAgents;

    if (this.authService.getUser().business.businessType == "H") {
      data.userAgents.unshift({ id: 1, name: "HQ" });
    }

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

  public exportOrderStatusTemplate() {
    const url = "/order/exportOrderStatusTemplate";
    this.export(url, null, "ORDER_STATUS_TEMPLATE.xlsx");
  }

  public exportKerry(criteria) {
    const url = "/order/exportKerry";
    this.export(url, criteria, "KERRY.xlsx");
  }

  public exportKA(criteria) {
    const url = "/order/exportKA";
    this.export(url, criteria, "KA-SYSTEM.xlsx");
  }

  public exportJT(criteria) {
    const url = "/order/exportJT";
    this.export(url, criteria, "JT.xlsx");
  }

  public exportNinjaVan(criteria) {
    const url = "/order/exportNinjaVanTransaction";
    this.export(url, criteria, "NinjaVan.xlsx");
  }

  public exportOrder(criteria) {
    const url = "/order/exportOrder";
    this.export(url, criteria, "ExportOrder.xlsx");
  }
}
