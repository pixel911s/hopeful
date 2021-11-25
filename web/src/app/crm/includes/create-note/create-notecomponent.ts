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
  selector: "app-create-note",
  templateUrl: "create-note.component.html",
  styleUrls: ["create-note.component.scss"],
})
export class CreateNoteComponent extends BaseComponent implements OnInit {
  public formGroup: FormGroup;

  get f() {
    return this.formGroup.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<CreateNoteComponent>,
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
      "description",
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
