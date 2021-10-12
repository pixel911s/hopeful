import { Inject, Component, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validator,
} from "@angular/forms";
import { AuthService } from "app/shared/auth/auth.service";
import { BaseComponent } from "app/ิbase/base.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-pricelist-form",
  templateUrl: "pricelist-form.component.html",
  styleUrls: ["pricelist-form.component.scss"],
})
export class PriceListFormComponent extends BaseComponent implements OnInit {
  duplicatedSku = false;
  tempData;

  @Input()
  formGroup: FormGroup;

  get f() {
    return this.formGroup.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<PriceListFormComponent>,
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    this.prepareFormGroup();
  }

  prepareFormGroup() {
    this.formGroup = this.formBuilder.group({});
    this.formGroup.addControl(
      "qty",
      new FormControl("", [Validators.required, this.validateNumber])
    );
    this.formGroup.addControl(
      "price",
      new FormControl("", [Validators.required, this.validateNumber])
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async save() {
    if (this.formGroup.invalid) {
      this.toastr.show(this.translate.instant("error.please-fill-required"));
      await this.markFormGroupTouched(this.formGroup);
      return;
    }

    this.dialogRef.close(this.data);
  }

  validateNumber(control: FormControl) {
    const value = control.value;

    if (isNaN(value)) {
      return { numberInvalid: true };
    } else {
      if (Number(value) < 1) {
        return { numberInvalid: true };
      }
    }
  }
}
