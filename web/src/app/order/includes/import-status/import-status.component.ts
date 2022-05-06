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
import { UserService } from "app/shared/services/user.service";

@Component({
  selector: "app-import-status",
  templateUrl: "import-status.component.html",
  styleUrls: ["import-status.component.scss"],
})
export class ImportStatusComponent extends BaseComponent implements OnInit {
  public productLists = [];
  public unknowProducct = [];

  displayType = 0;

  public data: any = {
    sendSms: 0,
    items: [],
  };

  public displayData: any = [];
  public displayDatas: any = [];

  public criteria: any = {
    page: 1,
    size: 10,
  };

  public users = [];

  constructor(
    public dialogRef: MatDialogRef<ImportStatusComponent>,
    private translate: TranslateService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private productService: ProductService,
    private userService: UserService,
    private orderService: OrderService
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    let res: any = await this.userService.getAllUsername();
    this.users = res.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.data.items.length == 0) {
      this.toastr.show("❌ กรุณาอัพโหลดไฟล์ Excel. ❌");
      return;
    }

    if (this.data.items.filter((item) => item.error.length > 0).length > 0) {
      this.toastr.show(
        "❌❌ พบข้อมูลบน Excel ผิดพลาดอยู่ กรุณาแก้ไขให้ถูกต้องและอัพโหลดอีกครั้ง. ❌❌"
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

    this.displayDatas = this.data.items;

    if (this.displayType == 1) {
      this.displayDatas = this.data.items.filter(
        (data) => data.error.length > 0
      );
    }

    const startIndex = (this.criteria.page - 1) * this.criteria.size;
    this.displayData = this.displayDatas.slice(
      startIndex,
      startIndex + this.criteria.size
    );
  }

  public async filesSelect(selectedFiles: Ng4FilesSelected) {
    this.spinner.show();
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

      let criteria: any = {
        orders: [],
        page: 1,
        size: 9999,
      };

      try {
        this.unknowProducct = [];

        let uploadProduct = [];

        for (let index = 0; index < jsonData[0].length; index++) {
          const item = jsonData[0][index];
          let data: any = {
            error: [],
          };

          data.orderNo = item["รหัสสั่งซื้อ"]
            ? (item["รหัสสั่งซื้อ"] + "").trim()
            : null;
          data.status =
            item["สถานะ"] && item["สถานะ"] != ""
              ? (item["สถานะ"] + "").trim()
              : null;

          data.paymentStatus =
            item["สถานะการชำระเงิน"] && item["สถานะการชำระเงิน"] != ""
              ? (item["สถานะการชำระเงิน"] + "").trim()
              : null;
          data.vendor = item["ขนส่ง"] ? (item["ขนส่ง"] + "").trim() : null;
          data.trackingNo = item["Tracking Order"]
            ? (item["Tracking Order"] + "").trim()
            : null;

          data.updateStatusDate = item["วันที่อัพเดทสถานะ"]
            ? item["วันที่อัพเดทสถานะ"]
            : null;

          data.updateCODDate = item["วันที่อัพเดท COD"]
            ? item["วันที่อัพเดท COD"]
            : null;

          if (data.orderNo) {
            criteria.orders.push(data.orderNo);
          }

          uploadProduct.push(data);
        }

        let user = await this.authService.getUserWithLoadAgents();

        criteria.userAgents = user.userAgents;

        if (user.business.businessType == "A") {
          criteria.exceptHQ = true;
        }

        let res: any = await this.orderService.search(criteria);
        console.log(res);
        this.data.items = res.data;

        for (let index = 0; index < this.data.items.length; index++) {
          const element = this.data.items[index];
          element.vendor = "";
          element.trackingNo = "";
          element.error = [];
          const found = uploadProduct.find(
            (upData) => upData.orderNo == element.orderNo
          );
          if (found) {
            element.status = found.status ? found.status : element.status;
            element.paymentStatus = found.paymentStatus
              ? found.paymentStatus
              : element.paymentStatus;
            element.vendor = found.vendor ? found.vendor : element.vendor;
            element.trackingNo = found.trackingNo
              ? found.trackingNo
              : element.trackingNo;

            if (!found.status && !found.paymentStatus) {
              element.error.push("กรุณากรอกข้อมูล สถานะ และ สถานะการชำระเงิน");
            } else {
              if (found.status) {
                if (
                  found.status != "O" &&
                  found.status != "W" &&
                  found.status != "S" &&
                  found.status != "R" &&
                  found.status != "C"
                ) {
                  element.error.push(
                    "ข้อมูลสถานะกรอกได้เฉพาะ O , W , S , R , C เท่านั้น"
                  );
                } else {
                  if (found.status != "S") {
                    element.vendor = undefined;
                    element.trackingNo = undefined;
                  }
                }

                if (found.status == "S" && !found.vendor && !found.trackingNo) {
                  element.error.push(
                    "กรุณากรอกข้อมูล ขนส่ง และ Tracking Order"
                  );
                }

                if (
                  found.vendor &&
                  found.vendor != "ไปรษณีย์ไทย" &&
                  found.vendor != "Flash Express" &&
                  found.vendor != "J&T Express" &&
                  found.vendor != "Kerry Express" &&
                  found.vendor != "อื่นๆ"
                ) {
                  element.error.push("ข้อมูลขนส่งไม่ถูกต้อง");
                }

                element.updateStatusDate = found.updateStatusDate
                  ? new Date(found.updateStatusDate)
                  : new Date();

                if (!(element.updateStatusDate instanceof Date)) {
                  element.error.push("วันที่ทำรายการผิด format.");
                } else {
                  // element.updateStatusDate.setDate(
                  //   element.updateStatusDate.getDate() + 1
                  // );
                  element.updateStatusDate.setHours(0, 0, 0);
                }
              }

              if (found.paymentStatus) {
                if (found.paymentStatus != "S" && found.paymentStatus != "W") {
                  element.error.push(
                    "ข้อมูลสถานะการชำระเงินกรอกได้เฉพาะ W , S เท่านั้น"
                  );
                }

                if (found.paymentStatus == "S") {
                  element.updateCODDate = found.updateCODDate
                    ? new Date(found.updateCODDate)
                    : new Date();

                  if (!(element.updateCODDate instanceof Date)) {
                    element.error.push("วันที่ทำรายการผิด format.");
                  } else {
                    // element.updateCODDate.setDate(
                    //   element.updateCODDate.getDate() + 1
                    // );
                    element.updateCODDate.setHours(0, 0, 0);
                  }
                }

                if (found.paymentStatus == "W") {
                  element.updateCODDate = null;
                }
              }
            }
          } else {
            element.error.push("ไม่พบรหัสสั่งซื้อ");
          }
        }

        console.log(this.data.items);

        this.calDisplay(0);
      } catch (e) {
        console.log(e.message);
        this.toastr.show(e.message, "❌❌ พบข้อผิดพลาดในการอัพโหลด ❌❌");
      } finally {
        this.spinner.hide();
      }
    };
  }

  async checkBarcode(data, item) {
    let products = this.productLists.filter((p) => p.code == item.barcode);
    let product;
    if (products.length > 0) {
      product = Object.assign({}, products[0]);
    } else {
      let unknow = this.unknowProducct.find((p) => p == item.barcode);

      if (!unknow) {
        let res: any = await this.productService.getByBarcode(item.barcode);
        product = res.data;
        if (product) {
          this.productLists.push(product);
        } else {
          this.unknowProducct.push(item.barcode);

          if (this.unknowProducct.length > 5) {
            throw new Error(
              "ไม่พบสินค้ามากกว่า 5 รายการ กรุณาตรวจบาร์โค้ดสินค้าทั้งหมดอีกครั้ง"
            );
          }
        }
      }

      console.log(this.unknowProducct);
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
