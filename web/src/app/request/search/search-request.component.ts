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
import { RequestService } from "app/shared/services/request.service";

@Component({
  selector: "app-search-request",
  templateUrl: "./search-request.component.html",
  styleUrls: ["./search-request.component.scss"],
})
export class SearchRequestComponent implements OnInit {
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
    private requestService: RequestService,
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

    if (this.user.business.businessType == "A") {
      this.criteria.createBy = this.user.username;
    }

    await this.search();
  }

  async search() {
    this.spinner.show();

    sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
    let res: any = await this.requestService.search(this.criteria);

    this.data = res;
    this.spinner.hide();
  }

  view(item) {
    this.router.navigateByUrl("/request/view/" + item.id);
  }

  update(item) {
    this.router.navigateByUrl("/request/approve/" + item.id);
  }
}
