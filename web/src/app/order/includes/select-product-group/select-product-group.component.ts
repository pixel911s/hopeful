import { Inject, Component, OnInit, Input } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { BaseComponent } from "app/base/base.component";
import { AuthService } from "app/shared/auth/auth.service";
import { ProductGroupService } from "app/shared/services/product-group.service";
import { ProductService } from "app/shared/services/product.service";
import { NgxSpinnerService } from "ngx-spinner";
import { SelectProductComponent } from "../select-product/select-product.component";

@Component({
  selector: "app-select-product-group",
  templateUrl: "select-product-group.component.html",
  styleUrls: ["select-product-group.component.scss"],
})
export class SelectProductGroupComponent extends BaseComponent implements OnInit {
  public data: any = {};

  constructor(
    public dialogRef: MatDialogRef<SelectProductGroupComponent>,
    private translate: TranslateService,
    private authService: AuthService,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    protected dialog: MatDialog,
    private productGroupService: ProductGroupService,
    @Inject(MAT_DIALOG_DATA) public params: any
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    const res: any = await this.productGroupService.getProductGroups();
    this.data = res;
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

  selectProduct(id) {
    const dialogRef = this.dialog.open(SelectProductComponent, {
      maxWidth: "600px",
      minWidth: "300px",
      data: { info: true, productGroupId: id, isEvent: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogRef.close(result);
    });
  }
}