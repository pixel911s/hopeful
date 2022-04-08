import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase/app";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { UserService } from "../services/user.service";

@Injectable()
export class AuthService {
  private user;

  constructor(private http: HttpClient, public router: Router) {}

  async signinUser(id: string, password: string, rememberMe) {
    const authData: any = { username: id, password: password };

    this.user = {};

    let res: any = await this.http
      .post(environment.apiUrl + "/user/login", authData)
      .toPromise();

    this.user = res.data;

    this.user.lang = "en";

    sessionStorage.setItem("USERLOGIN", JSON.stringify(this.user));

    if (rememberMe) {
      localStorage.setItem("hopeful-auth", JSON.stringify(authData));
    }

    if (this.user.status == 9) {
      this.router.navigate(["/pages/froce-change-password"]);
    } else {
      this.router.navigate(["/page"]);
    }
  }

  logout() {
    sessionStorage.removeItem("NAV");
    localStorage.removeItem("hopeful-auth");
    sessionStorage.removeItem("USERLOGIN");
    this.router.navigate(["/pages/login"]);
  }

  isAuthenticated() {
    return true;
  }

  getUser() {
    let user = JSON.parse(sessionStorage.getItem("USERLOGIN"));
    if (!user) {
      sessionStorage.removeItem("NAV");
      this.router.navigate(["/pages/login"]);
    } else {
      return user;
    }
  }

  async getUserWithLoadAgents() {
    let user = JSON.parse(sessionStorage.getItem("USERLOGIN"));
    if (!user) {
      sessionStorage.removeItem("NAV");
      this.router.navigate(["/pages/login"]);
    } else {
      let res: any = await this.getAgentsByUser(user.username);
      user.userAgents = res.data;
      sessionStorage.setItem("USERLOGIN", JSON.stringify(user));
      return user;
    }
  }

  getAgentsByUser(username) {
    let criteria = {
      username: username,
    };
    return this.http
      .post(environment.apiUrl + "/user/getAgentsByUser", criteria)
      .toPromise();
  }
}
