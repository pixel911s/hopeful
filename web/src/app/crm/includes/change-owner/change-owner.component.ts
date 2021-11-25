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
  selector: "app-change-owner",
  templateUrl: "change-owner.component.html",
  styleUrls: ["change-owner.component.scss"],
})
export class ChangeOwnerComponent extends BaseComponent implements OnInit {
  public formGroup: FormGroup;

  public criteria: any = {
    page: 1,
    size: 99999,
    selectBtnIndex: 0,
  };

  public master: any = {
    agents: [],
    activityDate: [],
  };

  user;

  get f() {
    return this.formGroup.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<ChangeOwnerComponent>,
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
    this.formGroup = this.formBuilder.group({});

    this.formGroup.addControl(
      "username",
      new FormControl({ value: "" }, [Validators.required])
    );

    this.user = this.authService.getUser();

    await this.search();
  }

  async search() {
    let criteria = {
      id: this.data.agentId,
    };

    let res: any = await this.userService.getUseragent(criteria);

    this.master.users = res.data;
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
