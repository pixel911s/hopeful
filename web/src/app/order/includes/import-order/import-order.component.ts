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
  selector: "app-import-order",
  templateUrl: "import-order.component.html",
  styleUrls: ["import-order.component.scss"],
})
export class ImportOrderComponent extends BaseComponent implements OnInit {
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
    public dialogRef: MatDialogRef<ImportOrderComponent>,
    private translate: TranslateService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private productService: ProductService,
    private userService: UserService
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

      try {
        this.unknowProducct = [];

        for (let index = 0; index < jsonData[0].length; index++) {
          const item = jsonData[0][index];
          let data: any = {
            totalItems: 0,
            billDiscountAmount: 0,
            deliveryPrice: 0,
            netAmount: 0,
            error: [],
            orderDetail: [],
            paymentStatus: "W",
          };
          console.log(item);

          if (item["ลำดับออเดอร์"]) {
            data.orderNo = item["ลำดับออเดอร์"];
            data.deliveryName = item["ชื่อลูกค้า"]
              ? item["ชื่อลูกค้า"] + "".trim()
              : null;
            data.deliveryAddressInfo = item["ที่อยู่จัดส่ง"]
              ? item["ที่อยู่จัดส่ง"] + "".trim()
              : null;
            data.deliverySubDistrict = item["แขวง / ตำบล"]
              ? item["แขวง / ตำบล"] + "".trim()
              : null;
            data.deliveryDistrict = item["เขต / อำเภอ"]
              ? item["เขต / อำเภอ"] + "".trim()
              : null;
            data.deliveryProvince = item["จังหวัด"]
              ? item["จังหวัด"] + "".trim()
              : null;
            data.deliveryZipcode = item["รหัสไปรษณีย์"]
              ? item["รหัสไปรษณีย์"] + ""
              : null;

            console.log(item["เบอร์โทรศัพท์"]);

            data.deliveryContact = item["เบอร์โทรศัพท์"]
              ? item["เบอร์โทรศัพท์"] + "".trim()
              : null;

            data.saleChannel = item["ช่องทาง"]
              ? item["ช่องทาง"] + "".toUpperCase().trim()
              : null;

            data.saleChannelName = item["ชื่อช่องทาง"]
              ? item["ชื่อช่องทาง"] + "".trim()
              : null;

            data.sale = item["เซลส์"] ? item["เซลส์"] + "".trim() : null;

            data.crmOwner = item["คนดูแล"] ? item["คนดูแล"] + "".trim() : null;

            data.remark = item["หมายเหตุ"] ? item["หมายเหตุ"] + "".trim() : "";

            data.socialName = item["ชื่อในโซเชียลมีเดีย"]
              ? item["ชื่อในโซเชียลมีเดีย"] + "".trim()
              : "";

            data.activityStatus = item["activityStatus"]
              ? item["activityStatus"]
              : 0;
            data.note = item["note"] ? item["note"] + "".trim() : "";

            data.orderDate = item["วันที่ทำรายการ"]
              ? item["วันที่ทำรายการ"]
              : null;

            data.paymentType = item["วิธีการชำระเงิน"]
              ? item["วิธีการชำระเงิน"] + "".trim()
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
              if (!(data.orderDate instanceof Date)) {
                data.error.push("วันที่ทำรายการผิด format.");
              } else {
                data.orderDate.setDate(data.orderDate.getDate() + 1);
                data.orderDate.setHours(0, 0, 0);
              }
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

            if (!data.saleChannel) {
              data.error.push("ช่องทางบังคับกรอก.");
            } else if (
              data.saleChannel.toUpperCase() != "Facebook".toUpperCase() &&
              data.saleChannel.toUpperCase() != "CRM".toUpperCase() &&
              data.saleChannel.toUpperCase() != "LineAd".toUpperCase() &&
              data.saleChannel.toUpperCase() != "Inbcall".toUpperCase() &&
              data.saleChannel.toUpperCase() != "WEB".toUpperCase() &&
              data.saleChannel.toUpperCase() != "Shopee".toUpperCase() &&
              data.saleChannel.toUpperCase() != "Lazada".toUpperCase() &&
              data.saleChannel.toUpperCase() != "Tiktok".toUpperCase() &&
              data.saleChannel != "แนะนำ" &&
              data.saleChannel != "สวัสดิการ" &&
              data.saleChannel.toUpperCase() != "LINE".toUpperCase() &&
              data.saleChannel.toUpperCase() != "GOOGLEADS".toUpperCase() &&
              data.saleChannel.toUpperCase() != "INSTRAGRAM".toUpperCase() &&
              data.saleChannel != "อื่นๆ"
            ) {
              data.error.push(
                "ช่องทางต้องใส่ Facebook , CRM , LineAd , Inbcall , WEB , Shopee , Lazada , Tiktok , แนะนำ , สวัสดิการ, Line, GoogleAds, Instragram, อื่นๆ  เท่านั้น."
              );
            }

            if (
              data.sale &&
              !this.users.find((user) => {
                return data.sale == user.username;
              })
            ) {
              data.error.push("ไม่พบ username ของเซลส์ในระบบ.");
            }

            if (
              data.crmOwner &&
              !this.users.find((user) => {
                return data.crmOwner == user.username;
              })
            ) {
              data.error.push("ไม่พบ username ของคนดูแลในระบบ.");
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
            orderDetail.qty = 0;
            data.error.push("จำนวนสินค้าบังคับกรอก.");
          }

          if (!orderDetail.barcode) {
            orderDetail.barcode = "UNDEFINED";
            data.error.push("สินค้าบังคับกรอก.");
          } else {
            await this.checkBarcode(data, orderDetail);
          }

          data.orderDetail.push(orderDetail);

          data.totalItems += orderDetail.qty;
          data.billDiscountAmount += item["ส่วนลด"]
            ? !isNaN(item["ส่วนลด"])
              ? item["ส่วนลด"]
              : 0
            : 0;
          data.deliveryPrice += item["ค่าส่ง"]
            ? !isNaN(item["ค่าส่ง"])
              ? item["ค่าส่ง"]
              : 0
            : 0;

          data.expended = false;
        }

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
