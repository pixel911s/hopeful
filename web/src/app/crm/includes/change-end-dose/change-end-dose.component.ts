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
import { UserService } from "app/shared/services/user.service";
import { AuthService } from "app/shared/auth/auth.service";

@Component({
  selector: "app-change-end-dose",
  templateUrl: "change-end-dose.component.html",
  styleUrls: ["change-end-dose.component.scss"],
})
export class ChangeEndDoseComponent extends BaseComponent implements OnInit {
  public formGroup: FormGroup;

  endOfDose;

  get f() {
    return this.formGroup.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<ChangeEndDoseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private authService: AuthService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    console.log(this.data);
    this.endOfDose = new Date(this.data.endOfDose);

    this.formGroup = this.formBuilder.group({});

    this.formGroup.addControl(
      "endOfDose",
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

    this.dialogRef.close(this.endOfDose);
  }
}
