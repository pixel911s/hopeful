import { OnInit, Component, Input } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { PopupConfirmComponent } from "app/_common/popup-confirm/popup-confirm.component";
import { BaseComponent } from "app/base/base.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { ProductService } from "app/shared/services/product.service";
import { SelectProductComponent } from "app/order/includes/select-product/select-product.component";

@Component({
  selector: "app-product-group-detail",
  templateUrl: "./product-group-detail.component.html",
  styleUrls: ["./product-group-detail.component.scss"],
})
export class ProductGroupDetailComponent extends BaseComponent implements OnInit {
  public master: any = {};

  @Input()
  data: any;

  @Input()
  header = "Product";

  @Input()
  formGroup: FormGroup;

  @Input()
  isEdit: boolean = false;

  @Input()
  isReadOnly: any;

  tempProductType;

  details: FormArray;

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    protected dialog: MatDialog,
    private productService: ProductService
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  get f() {
    return this.formGroup.controls;
  }

  async ngOnInit(): Promise<void> {
    this.prepareFormGroup();
  }

  prepareFormGroup() {
    // this.formGroup.addControl(
    //   "productGroupName",
    //   new FormControl(
    //     { value: "", disabled: this.isReadOnly },
    //     Validators.required
    //   )
    // );

    this.formGroup.addControl(
      "no",
      new FormControl(
        { value: "", disabled: this.isReadOnly }, [
        Validators.required,
        Validators.pattern("^[0-9]*$")]
      )
    );

    this.formGroup.addControl(
      "description",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );

    this.formGroup.addControl(
      "status",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
  }

  selectProduct() {
    const dialogRef = this.dialog.open(SelectProductComponent, {
      maxWidth: "600px",
      minWidth: "300px",
      data: { info: true, isSet: false, isEvent: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!this.data.itemInSet) {
          this.data.itemInSet = [];
        }
        let duplicated = false;
        for (let index = 0; index < this.data.itemInSet.length; index++) {
          const product = this.data.itemInSet[index];
          if (product.id == result.id) {
            duplicated = true;
          }
        }
        if (!duplicated) {
          result.qty = 1;
          this.data.itemInSet.push(result);
          console.log("🚀 ~ itemInSet", this.data.itemInSet)
        }
      }
    });
  }

  removeProduct(item, index) {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      maxWidth: "300px",
      minWidth: "300px",
      data: {
        message: "ยืนยันการลบข้อมูล",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.data.itemInSet.splice(index, 1);
      }
    });
  }

  removeItem(index) {
    console.log("Product list", this.data.itemInSet);
    this.data.itemInSet.splice(index, 1);
  }

  changeQty(item, qty) {
    item.qty += qty;

    if (item.qty < 1) {
      item.qty = 1;
    }
  }
}