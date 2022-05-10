import { OnInit, Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import * as XLSX from "xlsx";
import { MatDialog } from "@angular/material/dialog";
import { BaseComponent } from "app/base/base.component";
import { AuthService } from "app/shared/auth/auth.service";
import { PopupConfirmComponent } from "app/_common/popup-confirm/popup-confirm.component";
import { SMSService } from "app/shared/services/sms.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";

import { ChartConfiguration, ChartData, ChartEvent, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts";

@Component({
  selector: "app-manage-sms",
  templateUrl: "./manage-sms.component.html",
  styleUrls: ["./manage-sms.component.scss"],
})
export class ManageSMSComponent extends BaseComponent implements OnInit {
  sender = "MYSHOP";

  public formGroup: FormGroup;

  public data: any = {
    tels: [],
  };

  selectTab = 1;
  credit = 0;

  public customerList: any = {
    totalRecord: 0,
  };

  public criteria: any = {
    page: 1,
    size: 10,
    type: 1,
  };

  master: any = {};

  totalMsg = 0;

  shop;

  ranges: any = [
    {
      value: [new Date(), new Date()],
      label: "วันนี้",
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 7)),
        new Date(),
      ],
      label: "7 วัน",
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 15)),
        new Date(),
      ],
      label: "15 วัน",
    },
    {
      value: [
        new Date(new Date().setMonth(new Date().getMonth() - 1)),
        new Date(),
      ],
      label: "1 เดือน",
    },
    {
      value: [
        new Date(new Date().setMonth(new Date().getMonth() - 3)),
        new Date(),
      ],
      label: "3 เดือน",
    },
  ];

  get f() {
    return this.formGroup.controls;
  }

  user;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    translate: TranslateService,
    protected dialog: MatDialog,
    private smsService: SMSService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = this.fb.group({});

    this.formGroup.addControl(
      "tel",
      new FormControl("", [Validators.required])
    );
    this.formGroup.addControl(
      "message",
      new FormControl("", [Validators.required])
    );

    this.formGroup.addControl(
      "sender",
      new FormControl({ value: "", disabled: true }, [])
    );

    this.sender = "HOPEFUL";

    await this.search();

    this.user = this.authService.getUser();
    console.log('user ==> ', this.user)
  }

  async search() {
    let res: any = await this.smsService.getSMSCredit();

    this.credit = res.data;
  }

  async sendSms() {
    if (this.formGroup.invalid) {
      this.toastr.show("❌ กรุณากรอกข้อมูลให้ถูกต้อง ครบถ้วน.");
      await this.markFormGroupTouched(this.formGroup);
      return;
    }

    let totalMsg = this.data.tels.length * this.totalMsg;

    // if (this.shop.sms < totalMsg) {
    //   this.messageService.errorPopup(
    //     "จำนวนเครดิต SMS ไม่เพียงพอ กรุณาเติมเครดิตและลองใหม่อีกครั้ง."
    //   );
    //   return;
    // }

    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      maxWidth: "1000px",
      minWidth: "300px",
      data: {
        message: "ยืนยันการส่ง SMS",
        remark: " หมายเหตุ : ใช้ SMS ทั้งหมด " + totalMsg + " credit",
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        this.spinner.show();

        console.log('data: ', this.data);

        // เพิ่ม ข้อมูลผู้ส่ง
        this.data = {
          ...this.data,
          agentId: this.user?.businessId || null,
          createBy: this.user?.username || null
        }

        let res: any = await this.smsService.sendManual(this.data);
        await this.search();

        this.spinner.hide();
        this.toastr.show("✔️ ส่งข้อความหาลูกค้าสำเร็จ");
      }
    });
  }

  messageDisplay(text) {
    if (!text) {
      text = "";
    }

    // let countTracking = (text.match(/#tracking/g) || []).length;
    let totalLength = text.length;

    // if (countTracking > 0) {
    //   totalLength -= "#tracking".length;
    //   totalLength += 12;
    // }

    this.totalMsg = 1;

    if (totalLength > 70 && totalLength <= 133) {
      this.totalMsg = 2;
    } else if (totalLength > 133 && totalLength <= 200) {
      this.totalMsg = 3;
    } else if (totalLength > 200 && totalLength <= 268) {
      this.totalMsg = 4;
    } else if (totalLength > 268 && totalLength <= 335) {
      this.totalMsg = 5;
    } else if (totalLength > 335 && totalLength <= 402) {
      this.totalMsg = 6;
    } else if (totalLength > 402 && totalLength <= 469) {
      this.totalMsg = 7;
    } else if (totalLength > 469) {
      this.totalMsg = 8;
    }

    let result = totalLength + " ตัวอักษร / " + this.totalMsg + " ข้อความ";

    return result;
  }

  // async selectCustomerAll() {
  //   this.blockUI.start();

  //   let criteria = {
  //     page: 1,
  //     size: 100000,
  //     type: this.criteria.type,
  //   };

  //   let res: any = await this.transactionService.searchCustomers(criteria);

  //   this.data.tels = [];

  //   for (let index = 0; index < res.data.length; index++) {
  //     const customer = res.data[index];
  //     this.data.tels.push({ value: customer.tel });
  //   }

  //   this.data.tels = Array.from(
  //     new Set(this.data.tels.map((a) => a.value))
  //   ).map((id) => {
  //     return this.data.tels.find((a) => a.value === id);
  //   });

  //   this.formGroup.get("tel").updateValueAndValidity();

  //   this.blockUI.stop();
  // }

  // selectCustomer(item) {
  //   let duplicated = false;
  //   for (let index = 0; index < this.data.tels.length; index++) {
  //     const element = this.data.tels[index];
  //     if (element.value == item.tel) {
  //       duplicated = true;
  //       break;
  //     }
  //   }

  //   if (!duplicated) {
  //     this.data.tels.push({ value: item.tel });
  //     this.formGroup.get("tel").updateValueAndValidity();

  //     this._snackBar.open("✔️ เพิ่มเบอร์โทรศัพท์สำเร็จ", undefined, {
  //       duration: 2000,
  //     });
  //   } else {
  //     this._snackBar.open("❌ เบอร์โทรศัพท์นี้ถูกเพิ่มไปแล้ว", undefined, {
  //       duration: 2000,
  //     });
  //   }
  // }

  onTagsChanged(event) {
    if (event.change == "add") {
      var ph = new RegExp(/^[0]\d{9}$/);

      if (!ph.test(event.tag.value)) {
        for (let index = 0; index < this.data.tels.length; index++) {
          const element = this.data.tels[index];
          if (element.value == event.tag.value) {
            this.data.tels.splice(index, 1);
            this.toastr.show("❌ เบอร์โทรศัพท์ไม่ถูกต้อง");
            break;
          }
        }
      } else {
        this.toastr.show("✔️ เพิ่มเบอร์โทรศัพท์สำเร็จ");
      }
    }
  }

  filesSelect(event) {
    this.data.tels = [];
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = event.files[0];
    reader.onload = (e) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: "binary" });
      jsonData = XLSX.utils.sheet_to_json(workBook.Sheets["Sheet2"]);

      for (let index = 0; index < jsonData.length; index++) {
        const mobile = jsonData[index].mobile;

        var ph = new RegExp(/^[0]\d{9}$/);

        if (ph.test(mobile)) {
          this.data.tels.push({ value: mobile });
        }
      }

      this.data.tels = Array.from(
        new Set(this.data.tels.map((a) => a.value))
      ).map((id) => {
        return this.data.tels.find((a) => a.value === id);
      });

      this.toastr.show("✔️ เพิ่มเบอร์โทรศัพท์สำเร็จ");
      this.formGroup.get("tel").updateValueAndValidity();
    };
    reader.readAsBinaryString(file);
  }

  // viewDetail(item) {
  //   this.messageService.infoPopup(item.data);
  // }
}
