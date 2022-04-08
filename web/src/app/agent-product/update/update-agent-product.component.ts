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
import { ProductService } from "app/shared/services/product.service";
import { AgentProductService } from "app/shared/services/agent-product.service";

@Component({
  selector: "app-update-agent-product",
  templateUrl: "./update-agent-product.component.html",
  styleUrls: ["./update-agent-product.component.scss"],
})
export class UpdateAgentProductComponent
  extends BaseComponent
  implements OnInit
{
  public data: any;
  public formGroup: FormGroup;
  public isEdit = true;

  constructor(
    private formBuilder: FormBuilder,
    private productService: AgentProductService,
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

    let res: any = await this.productService.get(
      this.activeRoute.snapshot.params.id
    );

    this.data = res.data;

    if (this.data.agentRemainingDay != undefined)
      this.data.remainingDay = this.data.agentRemainingDay;
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

    await this.productService.save(this.data);
    this.spinner.hide();
    this.toastr.show(this.translate.instant("success.save-complete"));
    this.router.navigateByUrl("/agent-product");
  }
}
