import { OnInit, Component } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { ProductService } from "app/shared/services/product.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-search-product",
  templateUrl: "./search-product.component.html",
  styleUrls: ["./search-product.component.scss"],
})
export class SearchProductComponent implements OnInit {
  public data: any = {};
  public criteria: any = {
    page: 1,
    size: 20,
  };

  user;

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    translate: TranslateService,
    private spinner: NgxSpinnerService
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

    let res: any = await this.productService.search(this.criteria);
    this.data = res;

    this.spinner.hide();
  }

  view(item) {
    sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
    this.router.navigateByUrl("/agent/view/" + item.code);
  }

  update(item) {
    sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
    this.router.navigateByUrl("/agent/update/" + item.code);
  }
}
