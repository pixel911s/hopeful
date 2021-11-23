import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  get(username) {
    let criteria = {
      username: username,
      userAgents: this.authService.getUser().userAgents,
    };

    if (this.authService.getUser().business.businessType == "H") {
      criteria.userAgents.unshift({ id: 1, name: "HQ" });
    }

    return this.http
      .post(environment.apiUrl + "/user/get", criteria)
      .toPromise();
  }

  search(criteria) {
    return this.http
      .post(environment.apiUrl + "/user/search", criteria)
      .toPromise();
  }

  getUseragent(criteria) {
    return this.http
      .post(environment.apiUrl + "/user/getUseragent", criteria)
      .toPromise();
  }

  save(data) {
    data.shopId = this.authService.getUser().shopId;
    data.updateUser = this.authService.getUser().username;

    data.functions = [];

    if (data.selectViewUser) {
      data.functions.push("VIEW_USER");
    }

    if (data.selectCreateUser) {
      data.functions.push("CREATE_USER");
    }

    if (data.selectViewProduct) {
      data.functions.push("VIEW_PRODUCT");
    }

    if (data.selectCreateProduct) {
      data.functions.push("CREATE_PRODUCT");
    }

    if (data.selectViewCustomer) {
      data.functions.push("VIEW_CUSTOMER");
    }

    if (data.selectCreateCustomer) {
      data.functions.push("CREATE_CUSTOMER");
    }

    if (data.selectViewOrder) {
      data.functions.push("VIEW_ORDER");
    }

    if (data.selectCreateOrder) {
      data.functions.push("CREATE_ORDER");
    }

    if (data.selectViewAgent) {
      data.functions.push("VIEW_AGENT");
    }

    if (data.selectCreateAgent) {
      data.functions.push("CREATE_AGENT");
    }

    if (data.selectCRM) {
      data.functions.push("CRM");
    }

    if (data.supervisor) {
      data.functions.push("SUPERVISOR");
    }

    return this.http.post(environment.apiUrl + "/user/save", data).toPromise();
  }

  changePassword(data) {
    return this.http
      .post(environment.apiUrl + "/user/change-password", data)
      .toPromise();
  }

  getAll() {
    let compCode = this.authService.getUser().compCode;
    return this.http
      .get(
        environment.apiUrl + "/product/forDropDown" + "?compcode=" + compCode
      )
      .toPromise();
  }
}
