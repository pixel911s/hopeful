import { OnInit, Component, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { AuthService } from "app/shared/auth/auth.service";
import { UserService } from "app/shared/services/user.service";
import { BaseComponent } from "app/ิbase/base.component";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AgentService } from "app/shared/services/agent.service";

@Component({
  selector: "app-create-agent",
  templateUrl: "./create-agent.component.html",
  styleUrls: ["./create-agent.component.scss"],
})
export class CreateAgentComponent extends BaseComponent implements OnInit {
  public data: any = {};
  public formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private agentService: AgentService,
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
    await this.agentService.save(this.data);
    this.spinner.hide();
    this.toastr.show("✔️ เพิ่มข้อมูลตัวแทนจำหน่ายสำเร็จ");

    this.router.navigateByUrl("/agent");
  }
}
