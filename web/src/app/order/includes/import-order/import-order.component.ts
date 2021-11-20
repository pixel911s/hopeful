import { Inject, Component, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { BaseComponent } from "app/base/base.component";
import { AuthService } from "app/shared/auth/auth.service";
import { Ng4FilesSelected } from "app/shared/ng4-files";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

import * as XLSX from "xlsx";
import { OrderService } from "app/shared/services/order.service";
import { ProductService } from "app/shared/services/product.service";

@Component({
  selector: "app-import-order",
  templateUrl: "import-order.component.html",
  styleUrls: ["import-order.component.scss"],
})
export class ImportOrderComponent extends BaseComponent implements OnInit {
  public productLists = [];

  displayType = 0;

  public data: any = {
    sendSms: 0,
    items: [],
  };

  public displayData: any = [];

  public criteria: any = {
    page: 1,
    size: 10,
  };

  constructor(
    public dialogRef: MatDialogRef<ImportOrderComponent>,
    private translate: TranslateService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private productService: ProductService
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.data.items.length == 0) {
      this.toastr.show("กรุณาอัพโหลดไฟล์ Excel.");
      return;
    }

    if (this.data.items.filter((item) => item.error.length > 0).length > 0) {
      this.toastr.show(
        "พบข้อมูลบน Excel ผิดพลาดอยู่ กรุณาแก้ไขให้ถูกต้องและอัพโหลดอีกครั้ง."
      );
      return;
    }
    this.dialogRef.close(this.data);
  }

  clear() {
    this.data.items = [];
  }

  calDisplay(type) {
    this.displayType = type;

    this.displayData = [];

    let displayDatas = this.data.items;

    if (this.displayType == 1) {
      displayDatas = this.data.items.filter((data) => data.error.length > 0);
    }

    const startIndex = (this.criteria.page - 1) * this.criteria.size;
    this.displayData = displayDatas.slice(
      startIndex,
      startIndex + this.criteria.size
    );
  }

  public async filesSelect(selectedFiles: Ng4FilesSelected) {
    this.criteria.page = 1;

    if (selectedFiles.files.length == 0) return;
    let file = selectedFiles.files[0];
    let maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      let title = "";
      this.translate
        .get("err.file-large")
        .subscribe((result) => (title = result));
      this.toastr.show("❌ " + title + " 5 MB.");
      return;
    }

    let type = file.name.split(".")[1].toLocaleLowerCase();

    if (type != "xlsx") {
      this.toastr.show("❌ อัปโหลดได้เฉพาะไฟล์ xlsx เท่านั้น");
      return;
    }

    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = async (event) => {
      const data = event.target.result;
      workBook = XLSX.read(data, { type: "binary", cellDates: true });
      console.log(workBook);
      let index = 0;
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[index++] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      console.log(jsonData);

      this.data.items = [];

      for (let index = 0; index < jsonData[0].length; index++) {
        const item = jsonData[0][index];
        let data: any = {
          totalItems: 0,
          billDiscountAmount: 0,
          deliveryPrice: 0,
          netAmount: 0,
          error: [],
          orderDetail: [],
        };
        console.log(item);

        if (item["ลำดับออเดอร์"]) {
          data.orderNo = item["ลำดับออเดอร์"];
          data.deliveryName = item["ชื่อลูกค้า"]
            ? item["ชื่อลูกค้า"].trim()
            : null;
          data.deliveryAddressInfo = item["ที่อยู่จัดส่ง"]
            ? item["ที่อยู่จัดส่ง"].trim()
            : null;
          data.deliverySubDistrict = item["แขวง / ตำบล"]
            ? item["แขวง / ตำบล"].trim()
            : null;
          data.deliveryDistrict = item["เขต / อำเภอ"]
            ? item["เขต / อำเภอ"].trim()
            : null;
          data.deliveryProvince = item["จังหวัด"]
            ? item["จังหวัด"].trim()
            : null;
          data.deliveryZipcode = item["รหัสไปรษณีย์"]
            ? item["รหัสไปรษณีย์"] + ""
            : null;
          data.deliveryContact = item["เบอร์โทรศัพท์"]
            ? item["เบอร์โทรศัพท์"].trim()
            : null;

          data.remark = item["หมายเหตุ"] ? item["หมายเหตุ"].trim() : "";
          data.orderDate = item["วันที่ทำรายการ"]
            ? item["วันที่ทำรายการ"]
            : null;
          data.paymentType = item["วิธีการชำระเงิน"]
            ? item["วิธีการชำระเงิน"].trim()
            : null;

          if (
            this.data.items.filter((item) => item.orderNo == data.orderNo)
              .length > 0
          ) {
            data.error.push("ลำดับออเดอร์ไม่ถูกต้อง.");
          }

          if (!data.orderDate) {
            data.error.push("วันที่ทำรายการบังคับกรอก.");
          } else {
            console.log(data.orderDate);
            data.orderDate.setDate(data.orderDate.getDate() + 1);
            data.orderDate.setHours(0, 0, 0);
          }

          if (!data.paymentType) {
            data.error.push("วิธีการชำระเงินบังคับกรอก.");
          } else {
            if (data.paymentType != "COD" && data.paymentType != "TRANSFER") {
              data.error.push("วิธีการชำระเงินไม่ถูกต้อง.");
            }
          }

          if (!data.deliveryName) {
            data.error.push("ชื่อลูกค้าบังคับกรอก.");
          }

          if (!data.deliveryAddressInfo) {
            data.error.push("ที่อยู่จัดส่งบังคับกรอก.");
          }

          if (!data.deliverySubDistrict) {
            data.error.push("แขวง / ตำบลบังคับกรอก.");
          }

          if (!data.deliveryDistrict) {
            data.error.push("เขต / อำเภอบังคับกรอก.");
          }

          if (!data.deliveryProvince) {
            data.error.push("จังหวัดบังคับกรอก.");
          }

          if (!data.deliveryZipcode) {
            data.error.push("รหัสไปรษณีย์บังคับกรอก.");
          }

          if (!data.deliveryContact) {
            data.error.push("เบอร์โทรศัพท์บังคับกรอก.");
          }

          // data.deliveryPrice = item["ค่าส่ง"] ? item["ค่าส่ง"] : 0;

          this.data.items.push(data);
        } else {
          if (this.data.items.length > 0) {
            data = this.data.items[this.data.items.length - 1];
          } else {
            data.error.push("ลำดับออเดอร์บังคับกรอก.");
            this.data.items.push(data);
          }
        }

        let orderDetail: any = {};

        orderDetail.qty = item["จำนวน"];
        orderDetail.barcode = item["สินค้า"];
        orderDetail.discount = 0;

        if (!orderDetail.qty) {
          data.error.push("จำนวนสินค้าบังคับกรอก.");
        }

        if (!orderDetail.barcode) {
          data.error.push("สินค้าบังคับกรอก.");
        }

        await this.checkBarcode(data, orderDetail);

        data.orderDetail.push(orderDetail);

        data.totalItems += orderDetail.qty;
        data.billDiscountAmount += item["ส่วนลด"] ? item["ส่วนลด"] : 0;
        data.deliveryPrice += item["ค่าส่ง"] ? item["ค่าส่ง"] : 0;

        data.expended = false;
      }

      console.log(this.data);

      this.calDisplay(0);
    };
  }

  async checkBarcode(data, item) {
    let products = this.productLists.filter((p) => p.code == item.barcode);
    let product;
    if (products.length > 0) {
      product = Object.assign({}, products[0]);
    } else {
      let res: any = await this.productService.getByBarcode(item.barcode);
      product = res.data;
      if (product) this.productLists.push(product);
    }

    if (product) {
      item.id = product.id;
      item.code = product.code;
      item.name = product.name;
      item.unit = product.unit;
      item.remainingDay = product.remainingDay;
      item.productId = product.id;
      item.price = product.sellPrice;
      item.itemAmount = product.sellPrice * item.qty;
    } else {
      data.error.push("ไม่พบข้อมูลสินค้า " + item.barcode);
    }
  }
}
