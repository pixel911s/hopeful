import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "app/shared/auth/auth.service";
import { CookieService } from "ngx-cookie-service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent {
  loginFormSubmitted = false;
  loginFailed;

  loginForm = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    rememberMe: new FormControl(true),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private cdr: ChangeDetectorRef
  ) {}

  get lf() {
    return this.loginForm.controls;
  }

  async ngOnInit(): Promise<void> {
    this.loginFailed = null;
    let cookkieAuth: any = this.cookieService.get("hopeful-auth");
    if (cookkieAuth) {
      cookkieAuth = JSON.parse(cookkieAuth);
      try {
        await this.authService.signinUser(
          cookkieAuth.username,
          cookkieAuth.password,
          true
        );
      } catch (e) {
        this.loginFailed = e.error;
        this.cdr.detectChanges();
      }
    }
  }

  async onSubmit() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show();

    try {
      await this.authService.signinUser(
        this.loginForm.value.username,
        this.loginForm.value.password,
        this.loginForm.value.rememberMe
      );
    } catch (e) {
      console.log(e);
      this.loginFailed = e.error;
      this.cdr.detectChanges();
    } finally {
      this.spinner.hide();
    }
  }
}
