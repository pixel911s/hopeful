import { OnInit, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { AgentProductService } from "app/shared/services/agent-product.service";
import { ProductService } from "app/shared/services/product.service";
import { PopupConfirmComponent } from "app/_common/popup-confirm/popup-confirm.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-search-agent-product",
  templateUrl: "./search-agent-product.component.html",
  styleUrls: ["./search-agent-product.component.scss"],
})
export class SearchAgentProductComponent implements OnInit {
  public data: any = {};
  public criteria: any = {
    page: 1,
    size: 20,
  };

  user;

  constructor(
    private productService: AgentProductService,
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

    this.criteria.agentId = this.user.businessId;

    await this.search();
  }

  async search() {
    this.spinner.show();

    let res: any = await this.productService.search(this.criteria);
    this.data = res;

    this.spinner.hide();
  }

  update(item) {
    sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
    this.router.navigateByUrl("/agent-product/update/" + item.id);
  }
}
