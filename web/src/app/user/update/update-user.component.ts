import { OnInit, Component, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { UserService } from "app/shared/services/user.service";
import { BaseComponent } from "app/ิbase/base.component";

@Component({
  selector: "app-update-user",
  templateUrl: "./update-user.component.html",
  styleUrls: ["./update-user.component.scss"],
})
export class UpdateUserComponent extends BaseComponent implements OnInit {
  public data: any;
  public formGroup: FormGroup;
  public isEdit = true;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private datepipe: DatePipe
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = this.formBuilder.group({});

    let res: any = await this.userService.get(
      this.activeRoute.snapshot.params.id
    );

    this.data = res.data;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  async save() {
    // if (this.formGroup.invalid) {
    //   this.messageService.errorPopup('error.invalid-form');
    //   await this.markFormGroupTouched(this.formGroup);
    //   return;
    // }
    // this.blockUI.start();
    // await this.userService.save(this.data);
    // this.blockUI.stop();
    // this.messageService.successPopup('success.save-data');
    // this.router.navigateByUrl('/user');
  }

  async resetPassword() {
    // this.blockUI.start();
    // let data = {
    //   shopId : this.data.shopId,
    //   username : this.data.username,
    //   password : '1111'
    // };
    // await this.userService.changePassword(data);
    // this.blockUI.stop();
    // this.messageService.successPopup('Reset Password เสร็จสมบูรณ์ รหัสผ่านชั่วคราวของผู้ใช้งานคือ 1111');
    // this.router.navigateByUrl('/user');
  }
}
