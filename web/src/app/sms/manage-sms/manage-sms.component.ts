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

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public barChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      // datalabels: {
      //   anchor: 'end',
      //   align: 'end'
      // }
    },
  };
  public barChartType: ChartType = "bar";

  public barChartData: ChartData<"bar"> = {
    labels: ["2006", "2007", "2008", "2009", "2010", "2011", "2012"],
    datasets: [{ data: [], label: "Series A" }],
  };

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

  public criteria2: any = {
    page: 1,
    size: 10,
    dates: [new Date(), new Date()],
  };

  public criteria3: any = {
    type: 0,
  };

  smsLog: any = {
    totalRecord: 0,
  };

  master: any = {};

  totalMsg = 0;

  shop;

  ranges: any = [
    {
      value: [new Date(), new Date()],
      label: "??????????????????",
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 7)),
        new Date(),
      ],
      label: "7 ?????????",
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 15)),
        new Date(),
      ],
      label: "15 ?????????",
    },
    {
      value: [
        new Date(new Date().setMonth(new Date().getMonth() - 1)),
        new Date(),
      ],
      label: "1 ???????????????",
    },
    {
      value: [
        new Date(new Date().setMonth(new Date().getMonth() - 3)),
        new Date(),
      ],
      label: "3 ???????????????",
    },
  ];

  get f() {
    return this.formGroup.controls;
  }

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
    await this.searchTransaction();
    await this.searchCharts();
  }

  async search() {
    let res: any = await this.smsService.getSMSCredit();

    this.credit = res.data;
  }

  async searchTransaction() {
    this.spinner.show();

    console.log(this.criteria2);

    let res: any = await this.smsService.searchSms(this.criteria2);

    console.log(res);

    this.smsLog = res;

    this.spinner.hide();
  }

  async searchCharts() {
    this.spinner.show();
    let res: any = await this.smsService.smsCharts(this.criteria3);

    console.log(res);
    this.barChartData.datasets[0].data = [];
    this.barChartData.labels = [];
    for (let index = 0; index < res.data.length; index++) {
      const element = res.data[index];
      this.barChartData.datasets[0].data.push(element.sms);
      this.barChartData.labels.push(element.label);
    }
    console.log(this.barChartData);
    this.chart?.update();
    this.spinner.hide();
  }

  async sendSms() {
    if (this.formGroup.invalid) {
      this.toastr.show("??? ??????????????????????????????????????????????????????????????????????????? ?????????????????????.");
      await this.markFormGroupTouched(this.formGroup);
      return;
    }

    let totalMsg = this.data.tels.length * this.totalMsg;

    // if (this.shop.sms < totalMsg) {
    //   this.messageService.errorPopup(
    //     "????????????????????????????????? SMS ?????????????????????????????? ???????????????????????????????????????????????????????????????????????????????????????????????????."
    //   );
    //   return;
    // }

    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      maxWidth: "1000px",
      minWidth: "300px",
      data: {
        message: "???????????????????????????????????? SMS",
        remark: " ???????????????????????? : ????????? SMS ????????????????????? " + totalMsg + " credit",
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        this.spinner.show();

        let res: any = await this.smsService.sendManual(this.data);

        await this.searchTransaction();
        await this.searchCharts();
        await this.search();

        this.spinner.hide();
        this.toastr.show("?????? ????????????????????????????????????????????????????????????????????????");
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

    let result = totalLength + " ???????????????????????? / " + this.totalMsg + " ?????????????????????";

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

  //     this._snackBar.open("?????? ????????????????????????????????????????????????????????????????????????", undefined, {
  //       duration: 2000,
  //     });
  //   } else {
  //     this._snackBar.open("??? ??????????????????????????????????????????????????????????????????????????????????????????", undefined, {
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
            this.toastr.show("??? ?????????????????????????????????????????????????????????????????????");
            break;
          }
        }
      } else {
        this.toastr.show("?????? ????????????????????????????????????????????????????????????????????????");
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

      this.toastr.show("?????? ????????????????????????????????????????????????????????????????????????");
      this.formGroup.get("tel").updateValueAndValidity();
    };
    reader.readAsBinaryString(file);
  }

  // viewDetail(item) {
  //   this.messageService.infoPopup(item.data);
  // }
}
