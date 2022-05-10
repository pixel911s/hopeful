import { OnInit, Component, Input, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog } from "@angular/material/dialog";
import { SelectProductComponent } from "../select-product/select-product.component";
import { SelectProductGroupComponent } from "../select-product-group/select-product-group.component";
import { BaseComponent } from "app/base/base.component";
import { AuthService } from "app/shared/auth/auth.service";
import { MasterService } from "app/shared/services/master.service";
import { CustomerService } from "app/shared/services/customer.service";
import { ToastrService } from "ngx-toastr";
import { Ng4FilesSelected } from "app/shared/ng4-files";
import { SelectAddressComponent } from "../select-address/select-address.component";
import { OperatorFunction, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

@Component({
  selector: "app-hf-order-form",
  templateUrl: "./order-form.component.html",
  styleUrls: ["./order-form.component.scss"],
})
export class OrderFormComponent extends BaseComponent implements OnInit {
  public master: any = {
    subDistrict: [],
  };

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

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private masterService: MasterService,
    protected dialog: MatDialog,
    private customerService: CustomerService,
    private cdf: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  get f() {
    return this.formGroup.controls;
  }

  async ngOnInit(): Promise<void> {
    this.prepareFormGroup();

    this.data.updateStatusDate = new Date(this.data.updateStatusDate);

    let res: any = await this.masterService.getZipCode(null);

    this.master.subDistrict = res.data;
    console.log(this.master.subDistrict);

    this.selectAddressObj();
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
      "saleChannel",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );

    this.formGroup.addControl(
      "saleChannelName",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );

    this.formGroup.addControl(
      "socialName",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
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
      "paymentStatus",
      new FormControl({ value: "", disabled: this.isReadOnly }, [
        Validators.required,
      ])
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

    if (!this.isReadOnly && !this.isEdit) {
      this.formGroup.addControl(
        "orderDate",
        new FormControl(
          { value: "", disabled: this.isReadOnly || this.isEdit },
          [Validators.required]
        )
      );
    }
  }

  // async selectProvince() {
  //   let res: any = await this.masterService.getDistricts(
  //     this.data.deliveryProvince
  //   );
  //   this.districts = res.data;
  //   this.data.deliveryDistrict = undefined;
  //   this.data.deliverySubDistrict = undefined;
  //   this.data.deliveryZipcode = undefined;

  //   this.cdf.detectChanges();
  // }

  // async selectDistrict() {
  //   let res: any = await this.masterService.getSubDistricts(
  //     this.data.deliveryDistrict
  //   );
  //   this.subdistricts = res.data;
  //   this.data.deliverySubDistrict = undefined;
  //   this.data.deliveryZipcode = undefined;

  //   this.cdf.detectChanges();
  // }

  // async selectSubDistrict() {
  //   for (let index = 0; index < this.subdistricts.length; index++) {
  //     const subdistrict = this.subdistricts[index];

  //     if (subdistrict.id == this.data.deliverySubDistrict) {
  //       this.data.deliveryZipcode = subdistrict.zipCode;
  //     }
  //   }

  //   this.cdf.detectChanges();
  // }

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

  selectProductGroup() {
    const dialogRef = this.dialog.open(SelectProductGroupComponent, {
      maxWidth: "600px",
      minWidth: "300px",
      data: { info: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("🚀 ~ result from modal product group", result)
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

    // this.changePaymentType();

    this.data.netAmount =
      this.data.totalAmount -
      this.data.billDiscountAmount +
      this.data.deliveryPrice;
  }

  changePaymentType() {
    if (!this.isEdit) {
      if (
        this.data.orderDetail.length > 0 &&
        this.data.paymentType == "TRANSFER"
      ) {
        this.data.billDiscountAmount = 100 * this.data.orderDetail.length;
      } else {
        this.data.billDiscountAmount = 0;
      }

      this.calPrice();
    }
  }

  async checkMobile() {
    this.data.customer = undefined;
    this.data.deliveryName = undefined;
    this.data.deliveryAddressInfo = undefined;
    this.data.deliverySubDistrict = undefined;
    this.data.deliveryDistrict = undefined;
    this.data.deliveryProvince = undefined;
    this.data.deliveryZipcode = undefined;
    this.data.socialName = undefined;

    await this.getCustomer(this.data.deliveryContact);

    this.selectAddressObj();
    console.log(this.data);

    this.cdf.detectChanges();
  }

  async selectAddress() {
    const dialogRef = this.dialog.open(SelectAddressComponent, {
      maxWidth: "600px",
      minWidth: "300px",
      data: this.data.customer.addresses,
    });

    dialogRef.afterClosed().subscribe((address) => {
      if (address) {
        this.data.deliveryName = address.name;
        this.data.deliveryAddressInfo = address.info;
        this.data.deliverySubDistrict = address.subDistrict;
        this.data.deliveryDistrict = address.district;
        this.data.deliveryProvince = address.province;
        this.data.deliveryZipcode = address.zipcode;
        this.selectAddressObj();
      }
    });
  }

  async getCustomer(mobile) {
    let res: any = await this.customerService.getByMobile(mobile);
    console.log(res);
    if (res.data) {
      this.data.customer = res.data;

      let address = this.data.customer.addresses.find(
        (element) => element.isDefault
      );

      if (!address) {
        address = this.data.customer.addresses[0];
      }

      console.log(address);

      this.data.deliveryName = address.name;
      this.data.deliveryAddressInfo = address.info;
      this.data.deliverySubDistrict = address.subDistrict;
      this.data.deliveryDistrict = address.district;
      this.data.deliveryProvince = address.province;
      this.data.deliveryZipcode = address.zipcode;
      this.data.socialName = this.data.customer.socialName;

      // let res2: any = await this.masterService.getDistricts(
      //   this.data.deliveryProvince
      // );
      // this.districts = res2.data;

      // let res3: any = await this.masterService.getSubDistricts(
      //   this.data.deliveryDistrict
      // );
      // this.subdistricts = res3.data;
    }
  }

  public async filesSelect(selectedFiles: Ng4FilesSelected) {
    if (selectedFiles.files.length == 0) return;
    let file = selectedFiles.files[0];
    let maxSize = 10 * 1024 * 2014;
    let fileType = file.type.split("/")[0];

    if (file.size > maxSize) {
      let title = "";
      this.translate
        .get("err.file-large")
        .subscribe((result) => (title = result));
      this.toastr.show(title);
      return;
    }

    if (fileType.toLowerCase() != "image") {
      this.toastr.show("❌ อัปโหลดได้เฉพาะไฟล์รูปภาพเท่านั้น");
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      let image = new Image();
      image.src = event.target.result;
      image.onload = () => {
        this.data.imageUrl = event.target.result;
        this.data.newImageFlag = true;
        this.data.tmpNewImage = file;
      };
    };
  }

  splitAddress(event) {
    if ((event.ctrlKey || event.metaKey) && event.keyCode == 86) {
      console.log(this.data.deliveryAddressInfo);
    }
  }

  search: OperatorFunction<string, readonly { name; flag }[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term === ""
          ? []
          : this.master.subDistrict
              .filter(
                (v) =>
                  (v.zipCode + "").toLowerCase().indexOf(term.toLowerCase()) >
                  -1
              )
              .slice(0, 40)
      )
    );

  formatter = (x: any) => x.zipCode;

  selectItem(event) {
    console.log(event);
    this.data.deliverySubDistrict = event.item.subdistrict;
    this.data.deliveryDistrict = event.item.district;
    this.data.deliveryProvince = event.item.province;
    this.data.deliveryZipcode = event.item.zipCode;
    console.log(this.data);
  }

  selectAddressObj() {
    this.data.deliveryZipcodeObj = { zipCode: this.data.deliveryZipcode };
  }
}
