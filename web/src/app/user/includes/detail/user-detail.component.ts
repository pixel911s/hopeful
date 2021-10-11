import { OnInit, Component, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { DualListComponent } from "angular-dual-listbox";
import { AuthService } from "app/shared/auth/auth.service";
import { AgentService } from "app/shared/services/agent.service";
import { MasterService } from "app/shared/services/master.service";

@Component({
  selector: "app-user-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.scss"],
})
export class UserDetailComponent implements OnInit {
  public master: any = {};

  @Input()
  data: any;

  @Input()
  header = "User";

  @Input()
  formGroup: FormGroup;

  @Input()
  isEdit: boolean = false;

  @Input()
  isReadOnly: any;

  userAgents = [];
  user;
  validate = [];

  constructor(
    private authService: AuthService,
    translate: TranslateService,
    private agentService: AgentService
  ) {
    translate.use(this.authService.getUser().lang);
  }

  get f() {
    return this.formGroup.controls;
  }

  async ngOnInit(): Promise<void> {
    this.user = this.authService.getUser();

    if (this.user.business.businessType == "A") {
      this.data.businessType = this.user.business.businessType;
      this.data.businessId = this.user.business.id;
      this.data.ignoreValidate = true;
    }

    this.prepareFormGroup();

    let res: any = await this.agentService.gets();

    this.master.agents = res.data;
  }

  prepareFormGroup() {
    if (!this.data.ignoreValidate) {
      this.validate = [Validators.required];
    }

    this.formGroup.addControl(
      "username",
      new FormControl({ value: "", disabled: this.isReadOnly || this.isEdit }, [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9]*$"),
        Validators.minLength(6),
        Validators.maxLength(20),
      ])
    );
    this.formGroup.addControl(
      "status",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );

    this.formGroup.addControl(
      "businessType",
      new FormControl({ value: "", disabled: this.isReadOnly }, this.validate)
    );

    this.formGroup.addControl(
      "selectCreateUser",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectViewUser",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectCreateProduct",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectViewProduct",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectCreateOrder",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectViewOrder",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectCreateCustomer",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectViewCustomer",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectCreateAgent",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectViewAgent",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectCRM",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );

    this.changeBusinessType();
  }

  changeBusinessType() {
    this.formGroup.removeControl("businessId");

    if (this.data.businessType == "A") {
      this.data.selectCreateAgent = false;
      this.data.selectViewAgent = false;
      this.data.selectCreateProduct = false;
      this.data.selectViewProduct = false;

      this.formGroup.addControl(
        "businessId",
        new FormControl({ value: "", disabled: this.isReadOnly }, this.validate)
      );
    } else {
      this.data.businessId = undefined;
      this.formGroup.addControl(
        "businessId",
        new FormControl({ value: "", disabled: this.isReadOnly }, [])
      );
    }
  }
}
