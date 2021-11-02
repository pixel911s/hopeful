import { OnInit, Component, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { UserService } from "app/shared/services/user.service";
import { BaseComponent } from "app/base/base.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { UserConfigService } from "app/shared/services/user-config.service";

@Component({
  selector: "app-update-activity-date-config-detail",
  templateUrl: "./update.component.html",
  styleUrls: ["./update.component.scss"],
})
export class UpdateActivityDateConfigComponent
  extends BaseComponent
  implements OnInit
{
  public data: any;
  public formGroup: FormGroup;
  public isEdit = true;

  constructor(
    private formBuilder: FormBuilder,
    private configService: UserConfigService,
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

    let res: any = await this.configService.getActivityDateConfig(
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
    this.spinner.show();
    await this.configService.saveActivityDateConfig(this.data);
    this.spinner.hide();
    this.toastr.show(this.translate.instant("success.save-complete"));
    this.router.navigateByUrl("/setting/activity-date");
  }
}
