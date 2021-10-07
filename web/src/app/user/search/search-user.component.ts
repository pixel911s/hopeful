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
    private agentService: AgentService,
    private router: Router,
    private authService: AuthService,
    translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    this.user = this.authService.getUser();

    let res: any = await this.agentService.gets();

    this.master.agents = res.data;

    let session = JSON.parse(sessionStorage.getItem("HOPEFUL_CRITERIA"));

    if (session) {
      this.criteria = session;
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
