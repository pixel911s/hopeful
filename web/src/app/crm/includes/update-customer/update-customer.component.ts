import { Inject, Component, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { BaseComponent } from "app/base/base.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-update-customer",
  templateUrl: "update-customer.component.html",
  styleUrls: ["update-customer.component.scss"],
})
export class UpdateCustomerComponent extends BaseComponent implements OnInit {
  public formGroup: FormGroup;

  get f() {
    return this.formGroup.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<UpdateCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({});

    this.formGroup.addControl(
      "name",
      new FormControl({ value: "" }, [Validators.required])
    );

    this.formGroup.addControl(
      "mobile",
      new FormControl({ value: "" }, [Validators.required])
    );

    this.formGroup.addControl(
      "sex",
      new FormControl({ value: "" }, [Validators.required])
    );

    this.formGroup.addControl("age", new FormControl({ value: "" }, []));

    this.formGroup.addControl("email", new FormControl({ value: "" }, []));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async save(): Promise<void> {
    if (this.formGroup.invalid) {
      this.toastr.show(this.translate.instant("error.please-fill-required"));
      await this.markFormGroupTouched(this.formGroup);
      return;
    }

    this.data.dob = new Date();

    this.dialogRef.close(this.data);
  }
}
