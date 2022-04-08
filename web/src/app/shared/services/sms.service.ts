import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class SMSService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  sendManual(data) {
    return this.http
      .post(environment.apiUrl + "/sms/manualSms", data)
      .toPromise();
  }

  smsCharts(data) {
    return this.http
      .post(environment.apiUrl + "/sms/smsCharts", data)
      .toPromise();
  }

  searchSms(data) {
    return this.http
      .post(environment.apiUrl + "/sms/searchSms", data)
      .toPromise();
  }

  getSMSCredit() {
    return this.http
      .post(environment.apiUrl + "/sms/getSMSCredit", null)
      .toPromise();
  }
}
