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
  selector: "app-manage-todo",
  templateUrl: "manage-todo.component.html",
  styleUrls: ["manage-todo.component.scss"],
})
export class ManageTodoComponent extends BaseComponent implements OnInit {
  public formGroup: FormGroup;

  public hours = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  public minutes = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
  ];

  get f() {
    return this.formGroup.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<ManageTodoComponent>,
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

    this.formGroup.addControl(
      "scheduleDate",
      new FormControl({ value: "" }, [Validators.required])
    );

    this.formGroup.addControl(
      "hour",
      new FormControl({ value: "" }, [Validators.required])
    );

    this.formGroup.addControl(
      "minute",
      new FormControl({ value: "" }, [Validators.required])
    );

    this.formGroup.addControl(
      "noticeDay",
      new FormControl({ value: "" }, [Validators.required])
    );

    console.log(this.data);
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

    this.data.scheduleTime = this.data.hour + ":" + this.data.minute;

    this.dialogRef.close(this.data);
  }
}
