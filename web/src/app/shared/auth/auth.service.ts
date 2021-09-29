import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase/app";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class AuthService {
  private user;

  constructor(
    private http: HttpClient,
    public router: Router,
    private cookieService: CookieService
  ) {}

  async signinUser(id: string, password: string, rememberMe) {
    const authData: any = { username: id, password: password };

    this.user = {};

    let res: any = await this.http
      .post(environment.apiUrl + "/user/login", authData)
      .toPromise();

    this.user = res.data;

    this.user.lang = "en";

    sessionStorage.setItem("USERLOGIN", JSON.stringify(this.user));

    console.log(this.user);

    if (rememberMe) {
      this.cookieService.set("hopeful-auth", JSON.stringify(authData));
    }

    // if (this.user.status == 9) {
    //   this.router.navigate(["/froce-change-password"]);
    // } else {
    this.router.navigate(["/page"]);
    // }
  }

  logout() {
    this.cookieService.delete("hopeful-auth");
    this.router.navigate(["/pages/login"]);
  }

  isAuthenticated() {
    return true;
  }

  getUser() {
    return JSON.parse(sessionStorage.getItem("USERLOGIN"));
  }
}
