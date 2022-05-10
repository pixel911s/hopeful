import { Inject, Component, OnInit, Input } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { BaseComponent } from "app/base/base.component";
import { AuthService } from "app/shared/auth/auth.service";
import { ProductService } from "app/shared/services/product.service";
import { NgxSpinnerService } from "ngx-spinner";
import { SelectProductGroupComponent } from "../select-product-group/select-product-group.component";

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
    private spinner: NgxSpinnerService,
    protected dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public params: any
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    if (this.params.isSet) this.criteria.isSet = this.params.isSet;
    if (this.params.productGroupId) this.criteria.productGroupId = this.params.productGroupId;

    await this.search();
  }

  onNoClick(): void {
    this.dialogRef.close();
    if (this.params.isEvent) {
      this.selectProductGroup()
    }
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

  selectProductGroup() {
    this.dialogRef.close(); //close madal product
    const dialogRef = this.dialog.open(SelectProductGroupComponent, {
      maxWidth: "600px",
      minWidth: "300px",
      data: { info: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!this.data.orderDetail) {
          this.data.orderDetail = [];
        }
        let duplicated = false;
        for (let index = 0; index < this.data.orderDetail.length; index++) {
          const product = this.data.orderDetail[index];
          if (product.id == result.id) {
            duplicated = true;
          }
        }
        if (!duplicated) {
          result.qty = 1;
          this.data.orderDetail.push(result);
        }
      }
    });
  }
}
