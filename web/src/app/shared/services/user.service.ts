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
      shopId: this.authService.getUser().shopId,
    };
    return this.http
      .post(environment.apiUrl + "/user/get", criteria)
      .toPromise();
  }

  search(criteria) {
    return this.http
      .post(environment.apiUrl + "/user/search", criteria)
      .toPromise();
  }

  save(data) {
    data.shopId = this.authService.getUser().shopId;
    data.updateUser = this.authService.getUser().username;

    data.functions = [];

    if (data.selectUser) {
      data.functions.push("MANAGE_USER");
    }

    if (data.selectTransaction) {
      data.functions.push("MANAGE_TRANSACTION");
    }

    if (data.selectUpdateTransaction) {
      data.functions.push("UPDATE_TRANSACTION");
    }

    if (data.selectCancelTransaction) {
      data.functions.push("CANCEL_TRANSACTION");
    }

    if (data.selectCustomer) {
      data.functions.push("MANAGE_CUSTOMER");
    }

    if (data.selectPayment) {
      data.functions.push("PAYMENT");
    }

    if (data.selectRequestDiscount) {
      data.functions.push("APPROVE_DISCOUNT");
    }

    if (data.selectViewDebtor) {
      data.functions.push("VIEW_DEBTOR");
    }

    if (data.selectViewPayment) {
      data.functions.push("VIEW_PAYMENT");
    }

    if (data.selectViewDashBoard) {
      data.functions.push("VIEW_DASHBOARD");
    }

    if (data.selectViewAllBranch) {
      data.functions.push("VIEW_ALLBRANCH");
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
