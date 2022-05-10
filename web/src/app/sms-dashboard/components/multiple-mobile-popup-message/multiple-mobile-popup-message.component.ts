import { Inject, Component, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-multiple-mobile-popup-message",
  templateUrl: "multiple-mobile-popup-message.component.html",
  styleUrls: ["multiple-mobile-popup-message.component.scss"],
})
export class MultipleMobilePopupMessageComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MultipleMobilePopupMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
