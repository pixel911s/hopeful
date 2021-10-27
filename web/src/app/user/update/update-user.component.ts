import { OnInit, Component, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { UserService } from "app/shared/services/user.service";
import { BaseComponent } from "app/base/base.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

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
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService
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
    if (this.formGroup.invalid) {
      this.toastr.show(this.translate.instant("error.please-fill-required"));
      await this.markFormGroupTouched(this.formGroup);
      return;
    }

    if (!this.data.userAgents || this.data.userAgents.length == 0) {
      this.toastr.show("❌ กรุณาเลือกตัวแทนจำหน่ายอย่างน้อย 1 ตัวแทน");
      await this.markFormGroupTouched(this.formGroup);
      return;
    }

    this.spinner.show();
    await this.userService.save(this.data);
    this.spinner.hide();
    this.toastr.show(this.translate.instant("success.save-complete"));
    this.router.navigateByUrl("/user");
  }

  async resetPassword() {
    this.spinner.show();
    let data = {
      username: this.data.username,
      password: "1111",
    };
    await this.userService.changePassword(data);
    this.spinner.hide();
    this.toastr.show(
      "รหัสผ่านชั่วคราวของผู้ใช้งานคือ 1111",
      "✔️ Reset Password เสร็จสมบูรณ์"
    );
    this.router.navigateByUrl("/user");
  }
}
