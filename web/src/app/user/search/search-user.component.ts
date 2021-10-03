import { OnInit, Component } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { MasterService } from "app/shared/services/master.service";
import { UserService } from "app/shared/services/user.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-search-user",
  templateUrl: "./search-user.component.html",
  styleUrls: ["./search-user.component.scss"],
})
export class SearchUserComponent implements OnInit {
  public data: any = {};
  public criteria: any = {
    page: 1,
    size: 10,
  };

  public master: any = {
    branchs: [],
  };

  constructor(
    private userService: UserService,
    private masterService: MasterService,
    private router: Router,
    private authService: AuthService,
    translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    let res: any = await this.masterService.getBranchs();

    this.master.branchs = res.data;

    await this.search();
  }

  async search() {
    this.spinner.show();

    let res: any = await this.userService.search(this.criteria);
    this.data = res;
    console.log(this.data);

    this.spinner.hide();
  }

  view(item) {
    this.router.navigateByUrl("/user/view/" + item.username);
  }

  update(item) {
    this.router.navigateByUrl("/user/update/" + item.username);
  }
}
