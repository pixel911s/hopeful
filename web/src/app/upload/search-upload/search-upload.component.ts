import { OnInit, Component } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "app/shared/auth/auth.service";
import { ProductService } from "app/shared/services/product.service";
import { NgxSpinnerService } from "ngx-spinner";
import { OrderService } from "app/shared/services/order.service";
import { PopupConfirmComponent } from "app/_common/popup-confirm/popup-confirm.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-search-upload",
  templateUrl: "./search-upload.component.html",
  styleUrls: ["./search-upload.component.scss"],
})
export class SearchUploadComponent implements OnInit {
  public data: any = {};
  public criteria: any = {
    page: 1,
    size: 100,
    dates: [new Date(), new Date()],
  };

  user;

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

  master: any = {};

  constructor(
    private transactionService: OrderService,
    private router: Router,
    private authService: AuthService,
    translate: TranslateService,
    private spinner: NgxSpinnerService,
    protected dialog: MatDialog,
    private toastr: ToastrService
  ) {
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getUserWithLoadAgents();

    await this.search();
  }

  async search() {
    this.spinner.show();

    let res: any = await this.transactionService.searchUpload(this.criteria);

    this.data = res;
    this.spinner.hide();
  }

  remove(item) {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      maxWidth: "1000px",
      minWidth: "300px",
      data: {
        message: "ยืนยันการลบรายการ",
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        const dialogRef2 = this.dialog.open(PopupConfirmComponent, {
          maxWidth: "1000px",
          minWidth: "300px",
          data: {
            message:
              "คุณแน่ใจนะว่าต้องการลบ \nข้อมูลที่ถูกลบจะไม่สามารถกู้คืนกลับมาได้แล้ว \nถ้ามีการสร้างกิจกรรมใดใด บนฐานข้อมูลนี้ กิจกรรมนั้นจะหายไป",
          },
        });

        dialogRef2.afterClosed().subscribe(async (result2) => {
          if (result2 === true) {
            await this.transactionService.deleteUpload(item);
            await this.search();
            this.toastr.show("✔️ ยกเลิกรายการสำเร็จ.");
          }
        });
      }
    });
  }
}
