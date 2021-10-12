import { Inject, Component, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";

@Component({
  selector: "app-popup-confirm",
  templateUrl: "popup-confirm.component.html",
  styleUrls: ["popup-confirm.component.scss"],
})
export class PopupConfirmComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PopupConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    translate: TranslateService,
    private authService: AuthService
  ) {
    translate.use(this.authService.getUser().lang);
  }

  ngOnInit(): void {}

  no(): void {
    this.dialogRef.close(false);
  }

  yes(): void {
    this.dialogRef.close(true);
  }
}
