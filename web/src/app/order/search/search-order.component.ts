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
  selector: "app-search-order",
  templateUrl: "./search-order.component.html",
  styleUrls: ["./search-order.component.scss"],
})
export class SearchOrderComponent implements OnInit {
  public data: any = {};
  public criteria: any = {
    page: 1,
    size: 100,
    type: 1,
    dates: [new Date(), new Date()],
  };

  public checkAll = false;

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
    this.user = this.authService.getUser();

    let sesion = JSON.parse(sessionStorage.getItem("HOPEFUL_CRITERIA"));

    if (sesion) {
      this.criteria = sesion;

      if (this.criteria.dates && this.criteria.dates.length >= 2) {
        this.criteria.dates[0] = new Date(this.criteria.dates[0]);
        this.criteria.dates[1] = new Date(this.criteria.dates[1]);
      }
    }

    this.master.agents = this.user.userAgents;

    this.criteria.userAgents = this.user.userAgents;

    console.log(this.user);
    if (this.user.business.businessType == "A") {
      this.criteria.businessType = this.user.business.businessType;
      this.criteria.agent = this.user.business.id;
    }

    await this.search();
  }

  async search() {
    this.spinner.show();

    this.checkAll = false;

    sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
    let res: any = await this.transactionService.search(this.criteria);

    this.data = res;
    this.spinner.hide();
  }

  view(item) {
    this.router.navigateByUrl("/order/view/" + item.id);
  }

  update(item) {
    this.router.navigateByUrl("/order/update/" + item.id);
  }

  remove(item) {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      maxWidth: "1000px",
      minWidth: "300px",
      data: {
        message: "ยืนยันการยกเลิกรายการ",
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        await this.transactionService.delete(item.id);
        await this.search();
        this.toastr.show("ยกเลิกรายการสำเร็จ.");
      }
    });
  }
}
