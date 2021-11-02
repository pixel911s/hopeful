import { OnInit, Component, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { AuthService } from "app/shared/auth/auth.service";
import { UserService } from "app/shared/services/user.service";
import { BaseComponent } from "app/base/base.component";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AgentService } from "app/shared/services/agent.service";
import { UserConfigService } from "app/shared/services/user-config.service";

@Component({
  selector: "app-create-activity-date-config-detail",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class CreateActivityDateConfigComponent
  extends BaseComponent
  implements OnInit
{
  public data: any = {
    condition: 0,
  };
  public formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private configService: UserConfigService,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = this.formBuilder.group({});
  }

  async save() {
    if (this.formGroup.invalid) {
      this.toastr.show(this.translate.instant("error.please-fill-required"));
      await this.markFormGroupTouched(this.formGroup);
      return;
    }
    this.spinner.show();
    await this.configService.saveActivityDateConfig(this.data);
    this.spinner.hide();
    this.toastr.show("✔️ เพิ่มข้อมูลแทปวันที่ใน CRM สำเร็จ");

    this.router.navigateByUrl("/setting/activity-date");
  }
}
