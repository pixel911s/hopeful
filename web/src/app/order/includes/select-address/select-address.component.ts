import { Inject, Component, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { BaseComponent } from "app/base/base.component";
import { AuthService } from "app/shared/auth/auth.service";
import { ProductService } from "app/shared/services/product.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-select-address",
  templateUrl: "select-address.component.html",
  styleUrls: ["select-address.component.scss"],
})
export class SelectAddressComponent extends BaseComponent implements OnInit {
  public data: any = {};

  public criteria: any = {
    page: 1,
    size: 10,
    status: 1,
  };

  constructor(
    public dialogRef: MatDialogRef<SelectAddressComponent>,
    private translate: TranslateService,
    private authService: AuthService,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public params: any
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    console.log(this.params);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  select(item): void {
    this.dialogRef.close(item);
  }
}
