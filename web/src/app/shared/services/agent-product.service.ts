import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class AgentProductService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  gets() {
    return this.http
      .post(environment.apiUrl + "/agent-product/gets", null)
      .toPromise();
  }

  search(criteria) {
    criteria.agentId = this.authService.getUser().businessId;

    return this.http
      .post(environment.apiUrl + "/agent-product/search", criteria)
      .toPromise();
  }

  save(data) {
    data.updateUser = this.authService.getUser().username;
    data.agentId = this.authService.getUser().businessId;

    return this.http
      .post(environment.apiUrl + "/agent-product/save", data)
      .toPromise();
  }

  get(code) {
    let criteria = {
      id: code,
      agentId: this.authService.getUser().businessId,
    };

    return this.http
      .post(environment.apiUrl + "/agent-product/get", criteria)
      .toPromise();
  }

  getByBarcode(code) {
    let criteria = {
      barcode: code,
    };
    return this.http
      .post(environment.apiUrl + "/agent-product/getByBarcode", criteria)
      .toPromise();
  }
}
