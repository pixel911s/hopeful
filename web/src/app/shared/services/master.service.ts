import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class MasterService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  async getProvinces() {
    let url = environment.apiUrl + "/master/getProvinces";
    let response = await this.http.post(url, null).toPromise();
    return response;
  }

  async getDistricts(province) {
    let url = environment.apiUrl + "/master/getDistricts";
    let response = await this.http.post(url, { id: province }).toPromise();
    return response;
  }

  async getSubDistricts(id) {
    let url = environment.apiUrl + "/master/getSubDistricts";
    let response = await this.http.post(url, { id: id }).toPromise();
    return response;
  }

  async getZipCode(id) {
    let url = environment.apiUrl + "/master/searchZipCode";
    let response = await this.http.post(url, { id: id }).toPromise();
    return response;
  }

  async getBranchs() {
    let url = environment.apiUrl + "/master/getBranchs";
    let response = await this.http.post(url, null).toPromise();
    return response;
  }

  async getActivityStatus() {
    let url = environment.apiUrl + "/master/getActivityStatus";
    let response = await this.http.post(url, null).toPromise();
    return response;
  }
}
