import { Inject, Component, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/app/services/auth.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ProductService } from "src/app/services/product.service";

@Component({
  selector: "app-popup-search-product",
  templateUrl: "popup-search-product.component.html",
  styleUrls: ["popup-search-product.component.scss"],
})
export class PopupSearchProductComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public data: any = {
    totalItems: 0,
    items: [],
  };

  public criteria: any = {
    page: 1,
    size: 10,
    status: 1,
  };

  public master: any = {
    branches: [],
  };

  constructor(
    public dialogRef: MatDialogRef<PopupSearchProductComponent>,
    translate: TranslateService,
    private productService: ProductService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public onlyTypeZero: any
  ) {
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  async search() {
    this.blockUI.start();
    console.log(this.onlyTypeZero);
    this.criteria.onlyTypeZero = this.onlyTypeZero;
    let res: any = await this.productService.searchProduct(this.criteria);
    this.data = res;
    this.blockUI.stop();
  }

  async select(item) {
    let res: any = await this.productService.get(item.id);
    this.dialogRef.close(res.data);
  }
}
