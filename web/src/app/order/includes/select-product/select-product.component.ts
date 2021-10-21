import { Inject, Component, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { BaseComponent } from "app/base/base.component";
import { AuthService } from "app/shared/auth/auth.service";
import { ProductService } from "app/shared/services/product.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-select-product",
  templateUrl: "select-product.component.html",
  styleUrls: ["select-product.component.scss"],
})
export class SelectProductComponent extends BaseComponent implements OnInit {
  public data: any = {};

  public criteria: any = {
    page: 1,
    size: 10,
    status: 1,
  };

  constructor(
    public dialogRef: MatDialogRef<SelectProductComponent>,
    private translate: TranslateService,
    private authService: AuthService,
    private productService: ProductService,
    private spinner: NgxSpinnerService
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    await this.search();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  select(item): void {
    if (item.stockFlag == 1 && item.qty == 0) {
    } else {
      this.dialogRef.close(item);
    }
  }

  async search() {
    this.spinner.show();
    let res: any = await this.productService.search(this.criteria);

    this.data = res;

    this.spinner.hide();
  }
}
