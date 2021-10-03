import { OnInit, Component, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { AuthService } from "app/shared/auth/auth.service";
import { UserService } from "app/shared/services/user.service";
import { BaseComponent } from "app/ิbase/base.component";

@Component({
  selector: "app-create-user",
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.scss"],
})
export class CreateUserComponent extends BaseComponent implements OnInit {
  public data: any = {
    loginType: "SYSTEM",
  };
  public formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = this.formBuilder.group({});
  }

  async save() {
    if (this.formGroup.invalid) {
      // this.messageService.errorPopup("error.invalid-form");
      await this.markFormGroupTouched(this.formGroup);
      return;
    }
    // this.blockUI.start();
    // await this.userService.save(this.data);
    // this.blockUI.stop();
    // this.messageService.successPopup(
    //   "สร้างผู้ใช้งานสำเร็จ รหัสผ่านชั่วคราวของผู้ใช้งานคือ 1111"
    // );
    // let user = this.authService.getUser();
    // user.users++;
    // sessionStorage.setItem("USERLOGIN", JSON.stringify(user));
    // this.router.navigateByUrl("/user");
  }
}
