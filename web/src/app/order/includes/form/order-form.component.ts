import { OnInit, Component, Input, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog } from "@angular/material/dialog";
import { SelectProductComponent } from "../select-product/select-product.component";
import { BaseComponent } from "app/base/base.component";
import { AuthService } from "app/shared/auth/auth.service";
import { MasterService } from "app/shared/services/master.service";
import { CustomerService } from "app/shared/services/customer.service";

@Component({
  selector: "app-hf-order-form",
  templateUrl: "./order-form.component.html",
  styleUrls: ["./order-form.component.scss"],
})
export class OrderFormComponent extends BaseComponent implements OnInit {
  public master: any = {};

  @Input()
  data: any;

  @Input()
  header = "ข้อมูลการสั่งซื้อ";

  @Input()
  formGroup: FormGroup;

  @Input()
  isEdit: boolean = false;

  @Input()
  isReadOnly: any;

  provinces = [];
  districts = [];
  subdistricts = [];

  salepages: any = {};

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private masterService: MasterService,
    protected dialog: MatDialog,
    private customerService: CustomerService,
    private cdf: ChangeDetectorRef
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  get f() {
    return this.formGroup.controls;
  }

  async ngOnInit(): Promise<void> {
    this.prepareFormGroup();

    let resx: any = await this.masterService.getProvinces();
    this.provinces = resx.data;

    if (this.data.deliveryProvince) {
      let res2: any = await this.masterService.getDistricts(
        this.data.deliveryProvince
      );
      this.districts = res2.data;
    }

    if (this.data.deliveryDistrict) {
      let res3: any = await this.masterService.getSubDistricts(
        this.data.deliveryDistrict
      );
      this.subdistricts = res3.data;
    }
  }

  prepareFormGroup() {
    // this.formGroup.addControl('productName', new FormControl({ value: '', disabled: (this.isReadOnly || this.isEdit) }, [Validators.required,Validators.pattern('^[a-zA-Z0-9]*$')]));

    this.formGroup.addControl(
      "paymentType",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );

    this.formGroup.addControl(
      "name",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );
    this.formGroup.addControl(
      "tel",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );
    this.formGroup.addControl(
      "province",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );
    this.formGroup.addControl(
      "district",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );
    this.formGroup.addControl(
      "subdistrict",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );
    this.formGroup.addControl(
      "zipcode",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );
    this.formGroup.addControl(
      "address",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );
    this.formGroup.addControl(
      "status",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "trackingNo",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "vendor",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "sendSmsFlag",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "sendSms",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
    this.formGroup.addControl(
      "remark",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
  }

  async selectProvince() {
    let res: any = await this.masterService.getDistricts(
      this.data.deliveryProvince
    );
    this.districts = res.data;
    this.data.deliveryDistrict = undefined;
    this.data.deliverySubDistrict = undefined;
    this.data.deliveryZipcode = undefined;

    this.cdf.detectChanges();
  }

  async selectDistrict() {
    let res: any = await this.masterService.getSubDistricts(
      this.data.deliveryDistrict
    );
    this.subdistricts = res.data;
    this.data.deliverySubDistrict = undefined;
    this.data.deliveryZipcode = undefined;

    this.cdf.detectChanges();
  }

  async selectSubDistrict() {
    for (let index = 0; index < this.subdistricts.length; index++) {
      const subdistrict = this.subdistricts[index];

      if (subdistrict.id == this.data.deliverySubDistrict) {
        this.data.deliveryZipcode = subdistrict.zipCode;
      }
    }

    this.cdf.detectChanges();
  }

  selectProduct() {
    const dialogRef = this.dialog.open(SelectProductComponent, {
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
          this.calPrice();
        }
      }
    });
  }

  removeItem(index) {
    this.data.orderDetail.splice(index, 1);
    console.log(index);
    console.log(this.data.orderDetail);
    this.calPrice();
  }

  calPrice() {
    this.data.totalQty = 0;
    this.data.totalAmount = 0;
    this.data.netAmount = 0;
    this.data.billDiscountAmount = Number(this.data.billDiscountAmount) || 0.0;
    this.data.deliveryPrice = Number(this.data.deliveryPrice) || 0.0;

    if (this.data.orderDetail)
      for (let index = 0; index < this.data.orderDetail.length; index++) {
        const product = this.data.orderDetail[index];
        product.discount = 0;
        this.data.totalAmount += product.price * product.qty;
        this.data.totalQty += product.qty;
      }

    this.data.netAmount =
      this.data.totalAmount -
      this.data.billDiscountAmount +
      this.data.deliveryPrice;
  }

  async checkMobile() {
    this.data.customer = undefined;
    this.data.deliveryName = undefined;
    this.data.deliveryAddressInfo = undefined;
    this.data.deliverySubDistrict = undefined;
    this.data.deliveryDistrict = undefined;
    this.data.deliveryProvince = undefined;
    this.data.deliveryZipcode = undefined;

    await this.getCustomer(this.data.deliveryContact);
  }

  async getCustomer(mobile) {
    let res: any = await this.customerService.getByMobile(mobile);
    console.log(res);
    if (res.data) {
      this.data.customer = res.data;
      let address = this.data.customer.addresses[0];
      this.data.deliveryName = address.name;
      this.data.deliveryAddressInfo = address.info;
      this.data.deliverySubDistrict = address.subDistrict;
      this.data.deliveryDistrict = address.district;
      this.data.deliveryProvince = address.province;
      this.data.deliveryZipcode = address.zipcode;

      let res2: any = await this.masterService.getDistricts(
        this.data.deliveryProvince
      );
      this.districts = res2.data;

      let res3: any = await this.masterService.getSubDistricts(
        this.data.deliveryDistrict
      );
      this.subdistricts = res3.data;
    }
  }
}
