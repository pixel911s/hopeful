import { OnInit, Component, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { UserService } from "app/shared/services/user.service";
import { BaseComponent } from "app/base/base.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AgentService } from "app/shared/services/agent.service";
import { AuthService } from "app/shared/auth/auth.service";

@Component({
  selector: "app-setup-agent",
  templateUrl: "./setup-agent.component.html",
  styleUrls: ["./setup-agent.component.scss"],
})
export class SetupAgentComponent extends BaseComponent implements OnInit {
  public data: any;
  public formGroup: FormGroup;
  public isEdit = true;

  constructor(
    private formBuilder: FormBuilder,
    private agentService: AgentService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = this.formBuilder.group({});

    let res: any = await this.agentService.get(
      this.authService.getUser().business.code
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
    this.spinner.show();
    await this.agentService.save(this.data);
    this.spinner.hide();
    this.toastr.show(this.translate.instant("success.save-complete"));
    // this.router.navigateByUrl("/agent");
  }
}
