import { OnInit, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { ActivityService } from "app/shared/services/activity.service";
import { AgentService } from "app/shared/services/agent.service";
import { CustomerService } from "app/shared/services/customer.service";
import { MasterService } from "app/shared/services/master.service";
import { OrderService } from "app/shared/services/order.service";
import { TaskService } from "app/shared/services/task.service";
import { UserConfigService } from "app/shared/services/user-config.service";
import { UserService } from "app/shared/services/user.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-main-crm",
  templateUrl: "./main-crm.component.html",
  styleUrls: ["./main-crm.component.scss"],
})
export class MainCRMComponent implements OnInit {
  public data: any = {};
  public criteria: any = {
    page: 1,
    size: 10,
    selectBtnIndex: 0,
  };

  public orderCriteria: any = {
    page: 1,
    size: 10,
  };

  public master: any = {
    agents: [],
    activityDate: [],
  };

  user;
  customer;
  date = new Date();

  openTasks: any = [];
  closeTasks: any = [];

  isTodoCollapsed1 = false;
  isTodoCollapsed2 = false;
  isASCollapsed = false;
  isNoteCollapsed = false;
  isTransactionCollapsed = false;

  loadingCustomer = false;
  loadingActivitiesList = false;
  loadingOrder = false;

  constructor(
    private activityService: ActivityService,
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService,
    translate: TranslateService,
    private spinner: NgxSpinnerService,
    private masterService: MasterService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private activeRoute: ActivatedRoute
  ) {
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    this.user = this.authService.getUser();

    let session = JSON.parse(sessionStorage.getItem("HOPEFUL_CRITERIA"));

    console.log(session);

    if (session) {
      this.criteria = session;
      this.criteria.customerId = this.activeRoute.snapshot.params.id;
    }

    this.criteria.size = 10;
    this.orderCriteria.customerId = this.activeRoute.snapshot.params.id;
    this.orderCriteria.userAgents = this.criteria.userAgents;

    await this.loadCustomer(this.criteria.customerId);
    await this.loadOrderHistories();

    // await this.loadAgents();
    // await this.loadStatus();
    await this.loadActivityDate();
    // await this.search();
    await this.loadTasks();
    await this.searchDate(this.criteria.selectBtnIndex);
  }

  async loadCustomer(id) {
    this.loadingCustomer = true;
    let res: any = await this.customerService.getById(id);
    this.customer = res.data;
    this.loadingCustomer = false;
  }

  async loadOrderHistories() {
    this.loadingOrder = true;

    let res: any = await this.orderService.search(this.orderCriteria);
    this.customer.orders = res.data;
    this.loadingOrder = false;
  }

  // async loadAgents() {
  //   this.spinner.show();
  //   this.master.agents = this.user.userAgents;

  //   this.criteria.userAgents = this.user.userAgents;

  //   console.log(this.user);
  //   if (this.user.business.businessType == "A") {
  //     this.criteria.exceptHQ = true;
  //   } else {
  //     this.master.agents.unshift({ id: 1, name: "HQ" });
  //   }
  //   this.spinner.hide();
  // }

  // async loadStatus() {
  //   this.spinner.show();
  //   let res: any = await this.masterService.getActivityStatus();
  //   this.master.status = res.data;

  //   this.criteria.status = [
  //     this.master.status[0],
  //     this.master.status[1],
  //     this.master.status[2],
  //   ];
  //   this.spinner.hide();
  // }

  async loadTasks() {
    this.spinner.show();

    let res: any = await this.taskService.getCloseTask();
    this.closeTasks = res.data;

    let res2: any = await this.taskService.getOpenTask();
    this.openTasks = res2.data;

    this.spinner.hide();
  }

  async loadActivityDate() {
    this.spinner.show();

    let res2: any = await this.activityService.getSummaryActivityCount(
      this.criteria
    );

    // let res: any = await this.configService.getActivityDateConfigByUsername();
    this.master.activityDate = res2.data;

    // await this.searchDate(0);

    this.spinner.hide();
  }

  // async advanceSearch() {
  //   await this.loadActivityDate();
  //   await this.search();
  // }

  async searchDate(index) {
    this.criteria.fillterType = this.master.activityDate[index].fillterType;
    this.criteria.dayCondition = this.master.activityDate[index].dayCondition;
    this.criteria.selectBtnIndex = index;
    await this.search();
  }

  async search() {
    this.loadingActivitiesList = true;

    let res: any = await this.activityService.search(this.criteria);
    this.data = res;

    this.loadingActivitiesList = false;
  }

  // view(item) {
  //   sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
  //   this.router.navigateByUrl("/agent/view/" + item.code);
  // }

  // update(item) {
  //   sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
  //   this.router.navigateByUrl("/agent/update/" + item.code);
  // }

  async close(item) {
    await this.taskService.closeTask(item.id);
    await this.loadTasks();
  }

  async reopen(item) {
    await this.taskService.recallTask(item.id);
    await this.loadTasks();
  }
}