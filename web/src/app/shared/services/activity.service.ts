import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class ActivityService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  search(data) {
    data.username = this.authService.getUser().username;
    data.businessId =
      this.authService.getUser().business.businessType == "H"
        ? this.authService.getUser().businessId
        : null;
    return this.http
      .post(environment.apiUrl + "/activity/searchList", data)
      .toPromise();
  }

  getSummaryActivityCount(data) {
    data.username = this.authService.getUser().username;
    data.businessId =
      this.authService.getUser().business.businessType == "H"
        ? this.authService.getUser().businessId
        : null;
    return this.http
      .post(environment.apiUrl + "/activity/getSummaryActivityCount", data)
      .toPromise();
  }

  get(id) {
    let criteria = {
      id: id,
      userAgents: this.authService.getUser().userAgents,
    };

    if (this.authService.getUser().business.businessType == "H") {
      criteria.userAgents.unshift({ id: 1, name: "HQ" });
    }

    return this.http
      .post(environment.apiUrl + "/activity/get", criteria)
      .toPromise();
  }

  updateActivityStatus(id, activityStatusId) {
    let criteria = {
      id: id,
      userAgents: this.authService.getUser().userAgents,
      activityStatusId: activityStatusId,
      username: this.authService.getUser().username,
    };

    if (this.authService.getUser().business.businessType == "H") {
      criteria.userAgents.unshift({ id: 1, name: "HQ" });
    }

    return this.http
      .post(environment.apiUrl + "/activity/updateActivityStatus", criteria)
      .toPromise();
  }

  assignActivityOwner(data) {
    data.username = this.authService.getUser().username;
    data.agentId = this.authService.getUser().businessId;
    return this.http
      .post(environment.apiUrl + "/activity/assignActivityOwner", data)
      .toPromise();
  }

  cancelActivityOwner(data) {
    data.username = this.authService.getUser().username;
    data.agentId = this.authService.getUser().businessId;
    return this.http
      .post(environment.apiUrl + "/activity/cancelActivityOwner", data)
      .toPromise();
  }

  updateEndOfDose(data) {
    data.username = this.authService.getUser().username;
    return this.http
      .post(environment.apiUrl + "/activity/updateEndOfDose", data)
      .toPromise();
  }

  searchHistories(criteria) {
    return this.http
      .post(environment.apiUrl + "/activity/searchHistories", criteria)
      .toPromise();
  }
}
