import { Component } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";

import { Router } from "@angular/router";
import { AuthService } from "app/shared/auth/auth.service";
import { UserService } from "app/shared/services/user.service";
import { BaseComponent } from "app/ิbase/base.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "my-app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent extends BaseComponent {
  public fromGroup: FormGroup;
  public showError = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    super();
  }

  get f() {
    return this.fromGroup.controls;
  }

  ngOnInit() {
    this.fromGroup = this.fb.group({});

    this.fromGroup.addControl(
      "confirmPassword",
      new FormControl("", Validators.required)
    );
    this.fromGroup.addControl(
      "password",
      new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50),
      ])
    );
    this.fromGroup.setValidators(this.checkPasswords);
    this.fromGroup.markAsUntouched();
  }

  async changePassword() {
    this.showError = false;
    if (!this.fromGroup.valid) {
      await this.markFormGroupTouched(this.fromGroup);
      return;
    }
    try {
      this.spinner.show();

      let data = {
        shopId: this.authService.getUser().shopId,
        username: this.authService.getUser().username,
        password: this.fromGroup.value.password,
      };
      await this.userService.changePassword(data);
      this.ngOnInit();
      this.toastr.show("✔️ เปลี่ยนรหัสผ่านสำเร็จ");
    } catch (error) {
      console.log(error);
      this.showError = true;
    }
    this.spinner.hide();
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    let pass = group.get("password").value;
    let confirmPass = group.get("confirmPassword").value;

    if (pass === confirmPass) {
      return null;
    } else {
      group.get("confirmPassword").setErrors({ notSame: true });
      return { notSame: true };
    }
  }
}
