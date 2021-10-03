import { OnInit, Component, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
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

  constructor(
    private authService: AuthService,
    translate: TranslateService,
    private masterService: MasterService
  ) {
    translate.use(this.authService.getUser().lang);
  }

  get f() {
    return this.formGroup.controls;
  }

  async ngOnInit(): Promise<void> {
    this.prepareFormGroup();

    let res: any = await this.masterService.getBranchs();

    this.master.branchs = res.data;
  }

  prepareFormGroup() {
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
      "branchId",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );

    this.formGroup.addControl(
      "selectUser",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectTransaction",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectUpdateTransaction",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectCancelTransaction",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectCustomer",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectPayment",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectRequestDiscount",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectViewDashBoard",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectViewDebtor",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectViewAllBranch",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "selectViewPayment",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
  }
}
