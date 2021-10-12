
import { Inject, Component, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProductService } from 'src/app/services/product.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-popup-reject',
  templateUrl: 'popup-reject.component.html',
  styleUrls: [
    'popup-reject.component.scss'
  ]
})
export class PopupRejectComponent extends BaseComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public data: any = {};
  public formGroup: FormGroup;

  get f() {
    return this.formGroup.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<PopupRejectComponent>,
    translate: TranslateService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public param: any,
    private authService: AuthService
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = this.formBuilder.group({});
    this.formGroup.addControl('remark', new FormControl(null, [Validators.required]));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async save() {

    console.log(this.formGroup)

    if (this.formGroup.invalid) {
      await this.markFormGroupTouched(this.formGroup);
      return;
    }

    this.dialogRef.close(this.data);
  }

}
