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
  selector: "app-from-address",
  templateUrl: "from-address.component.html",
  styleUrls: ["from-address.component.scss"],
})
export class FromAddressComponent extends BaseComponent implements OnInit {
  public formGroup: FormGroup;

  public data: any;

  get f() {
    return this.formGroup.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<FromAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public param: any,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    super();
  }

  ngOnInit(): void {
    this.data = this.param.data;

    this.formGroup = this.formBuilder.group({});

    this.formGroup.addControl(
      "name",
      new FormControl({ value: "" }, [Validators.required])
    );

    this.formGroup.addControl(
      "info",
      new FormControl({ value: "" }, [Validators.required])
    );

    this.formGroup.addControl(
      "subdistrict",
      new FormControl({ value: "" }, [Validators.required])
    );

    this.formGroup.addControl(
      "district",
      new FormControl({ value: "" }, [Validators.required])
    );

    this.formGroup.addControl(
      "province",
      new FormControl({ value: "" }, [Validators.required])
    );

    this.formGroup.addControl(
      "zipcode",
      new FormControl({ value: "" }, [Validators.required])
    );

    this.formGroup.addControl(
      "tel",
      new FormControl({ value: "" }, [Validators.required])
    );
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

    this.dialogRef.close(this.data);
  }
}
