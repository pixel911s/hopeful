import { Component } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";

import { Router } from "@angular/router";
import { AuthService } from "app/shared/auth/auth.service";
import { UserService } from "app/shared/services/user.service";
import { BaseComponent } from "app/base/base.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Ng4FilesSelected } from "app/shared/ng4-files";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "user-info",
  templateUrl: "./user-info.component.html",
  styleUrls: ["./user-info.component.scss"],
})
export class UserInfoComponent extends BaseComponent {
  public fromGroup: FormGroup;
  public showError = false;

  public user: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  get f() {
    return this.fromGroup.controls;
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.fromGroup = this.fb.group({});

    this.fromGroup.addControl(
      "nickName",
      new FormControl("", Validators.required)
    );

    this.fromGroup.addControl(
      "lineNotifyToken",
      new FormControl("", Validators.required)
    );
  }

  async save() {
    this.showError = false;
    if (!this.fromGroup.valid) {
      await this.markFormGroupTouched(this.fromGroup);
      return;
    }
    try {
      this.spinner.show();

      await this.userService.updateUserInfo(this.user);

      sessionStorage.setItem("USERLOGIN", JSON.stringify(this.user));

      // this.ngOnInit();
      this.toastr.show("✔️ บันทึกข้อมูลผู้ใช้งานสำเร็จ");
    } catch (error) {
      console.log(error);
      this.showError = true;
    }
    this.spinner.hide();
  }

  public async filesSelect(selectedFiles: Ng4FilesSelected) {
    if (selectedFiles.files.length == 0) return;
    let file = selectedFiles.files[0];
    let maxSize = 10 * 1024 * 2014;
    let fileType = file.type.split("/")[0];

    if (file.size > maxSize) {
      let title = "";
      this.translate
        .get("err.file-large")
        .subscribe((result) => (title = result));
      this.toastr.show(title);
      return;
    }

    if (fileType.toLowerCase() != "image") {
      this.toastr.show("❌ อัปโหลดได้เฉพาะไฟล์รูปภาพเท่านั้น");
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      let image = new Image();
      image.src = event.target.result;
      image.onload = () => {
        this.user.displayImgUrl = event.target.result;
        this.user.newImageFlag = true;
        this.user.tmpNewImage = file;
      };
    };
  }
}
