import { OnInit, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { ProductGroupService } from "app/shared/services/product-group.service";
import { PopupConfirmComponent } from "app/_common/popup-confirm/popup-confirm.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-search-product-group",
  templateUrl: "./search-product-group.component.html",
  styleUrls: ["./search-product-group.component.scss"],
})
export class SearchProductGroupComponent implements OnInit {
  public data: any = {};
  public criteria: any = {
    page: 1,
    size: 20,
  };

  user;

  constructor(
    private productGroupService: ProductGroupService,
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

    let session = JSON.parse(sessionStorage.getItem("HOPEFUL_CRITERIA"));

    if (session) {
      this.criteria = session;
    }

    await this.search();
  }

  async search() {
    this.spinner.show();
    const res: any = await this.productGroupService.search(this.criteria);
    this.data = res;

    this.spinner.hide();
  }

  remove(item) {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      maxWidth: "1000px",
      minWidth: "300px",
      data: {
        message: "ยืนยันการลบข้อมูล",
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        await this.productGroupService.remove(item.id);
        await this.search();
        this.toastr.show("ลบข้อมูลสำเร็จ.");
      }
    });
  }

  view(item) {
    sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
    this.router.navigateByUrl("/product-group/view/" + item.id);
  }

  update(item) {
    sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
    this.router.navigateByUrl("/product-group/update/" + item.id);
  }
}