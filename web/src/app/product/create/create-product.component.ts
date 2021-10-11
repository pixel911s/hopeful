import { OnInit, Component, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ProductService } from "app/shared/services/product.service";
import { BaseComponent } from "app/ิbase/base.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create-product",
  templateUrl: "./create-product.component.html",
  styleUrls: ["./create-product.component.scss"],
})
export class CreateProductComponent extends BaseComponent implements OnInit {
  public data: any = {
    unit: "ชิ้น",
    status: 1,
    weight: 100,
    remainingDay: 0,
  };
  public formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = this.formBuilder.group({});
  }

  async save() {
    if (this.formGroup.invalid) {
      this.toastr.show(this.translate.instant("error.please-fill-required"));
      this.markFormGroupTouched(this.formGroup);
      return;
    }

    if (!this.data.imgUrl) {
      this.data.imgInvalid = true;
      this.toastr.show(this.translate.instant("❌ กรุณาอัพโหลดรูปภาพสินค้า"));
      return;
    }
    this.spinner.show();

    this.data.discount = 0;
    this.data.sellPrice = this.data.price;

    await this.productService.save(this.data);
    this.spinner.hide();
    this.toastr.show("success.save-data");
    this.router.navigateByUrl("/product");
  }
}
