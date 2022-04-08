import { OnInit, Component } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { AgentService } from "app/shared/services/agent.service";
import { MasterService } from "app/shared/services/master.service";
import { UserService } from "app/shared/services/user.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-search-user",
  templateUrl: "./search-user.component.html",
  styleUrls: ["./search-user.component.scss"],
})
export class SearchUserComponent implements OnInit {
  public data: any = {};
  public criteria: any = {
    page: 1,
    size: 20,
  };

  public master: any = {
    agents: [],
  };

  user;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getUserWithLoadAgents();

    this.master.agents = this.user.userAgents;

    let session = JSON.parse(sessionStorage.getItem("HOPEFUL_CRITERIA"));

    if (session) {
      this.criteria = session;
    }

    this.criteria.userAgents = this.user.userAgents;

    // console.log(this.user);
    if (this.user.business.businessType == "A") {
      // this.criteria.businessType = this.user.business.businessType;
      // this.criteria.agent = this.user.business.id;
      this.criteria.exceptHQ = true;
    }

    await this.search();
  }

  async search() {
    this.spinner.show();

    let res: any = await this.userService.search(this.criteria);
    this.data = res;

    this.spinner.hide();
  }

  view(item) {
    sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
    this.router.navigateByUrl("/user/view/" + item.username);
  }

  update(item) {
    sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
    this.router.navigateByUrl("/user/update/" + item.username);
  }
}
