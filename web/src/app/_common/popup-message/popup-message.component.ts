
import { Inject, Component, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-popup-message',
  templateUrl: 'popup-message.component.html',
  styleUrls: [
    'popup-message.component.scss'
  ]
})
export class PopupMessageComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<PopupMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    translate: TranslateService,
    private authService: AuthService) {
    translate.use('en');
  }

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
