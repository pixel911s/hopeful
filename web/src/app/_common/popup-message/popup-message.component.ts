import { Inject, Component, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-popup-message",
  templateUrl: "popup-message.component.html",
  styleUrls: ["popup-message.component.scss"],
})
export class PopupMessageComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PopupMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    translate: TranslateService
  ) {
    translate.use("en");
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
