import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "app/shared/auth/auth.service";
import { UserService } from "app/shared/services/user.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-froce-change-password",
  templateUrl: "./froce-change-password.component.html",
  styleUrls: ["./froce-change-password.component.scss"],
})
export class FroceChangePasswordComponent {
  loginFormSubmitted = false;
  loginFailed;

  loginForm = new FormGroup({
    newPassword: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(50),
    ]),
    confirmPassword: new FormControl("", [Validators.required]),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) {}

  get lf() {
    return this.loginForm.controls;
  }

  async ngOnInit(): Promise<void> {
    this.loginFailed = null;
    this.loginForm.setValidators(this.checkPasswords);
  }

  async onSubmit() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show();

    try {
      let data = {
        username: this.authService.getUser().username,
        password: this.loginForm.value.newPassword,
      };

      await this.userService.changePassword(data);

      this.router.navigate(["/page"]);
    } catch (error) {
      console.log(error);
      this.loginFailed = error.error;
    } finally {
      this.spinner.hide();
    }
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    let pass = group.get("newPassword").value;
    let confirmPass = group.get("confirmPassword").value;

    if (pass === confirmPass) {
      return null;
    } else {
      group.get("confirmPassword").setErrors({ notSame: true });
      return { notSame: true };
    }
  }
}
