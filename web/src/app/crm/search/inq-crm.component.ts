import { OnInit, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { ActivityService } from "app/shared/services/activity.service";
import { AgentService } from "app/shared/services/agent.service";
import { ConfigService } from "app/shared/services/config.service";
import { MasterService } from "app/shared/services/master.service";
import { TaskService } from "app/shared/services/task.service";
import { UserConfigService } from "app/shared/services/user-config.service";
import { UserService } from "app/shared/services/user.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { ChangeOwnerComponent } from "../includes/change-owner/change-owner.component";
import { ManageTodoComponent } from "../includes/manage-todo/manage-todo.component";

@Component({
  selector: "app-inq-crm",
  templateUrl: "./inq-crm.component.html",
  styleUrls: ["./inq-crm.component.scss"],
})
export class InqCRMComponent implements OnInit {
  public data: any = {};
  public criteria: any = {
    page: 1,
    size: 20,
    selectBtnIndex: 0,
  };

  public master: any = {
    agents: [],
    activityDate: [],
  };

  user;
  date = new Date();

  openTasks: any = [];
  closeTasks: any = [];

  isTrue = true;
  isTodoCollapsed1 = false;
  isTodoCollapsed2 = false;
  isASCollapsed = true;

  showLoadingLoadActivityDate = false;
  loadOpenTask = false;
  loadCloseTask = false;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "status",
    selectAllText: "เลือกทั้งหมด",
    unSelectAllText: "นำออกทั้งหมด",
    itemsShowLimit: 5,
    allowSearchFilter: false,
  };

  constructor(
    private activityService: ActivityService,
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private masterService: MasterService,
    protected dialog: MatDialog,
    private toastr: ToastrService,
    private userConfigService: UserConfigService
  ) {
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    this.spinner.show();

    this.user = await this.authService.getUserWithLoadAgents();

    let session = JSON.parse(sessionStorage.getItem("HOPEFUL_CRITERIA"));

    console.log(session);

    if (session) {
      this.criteria = session;
      console.log(this.criteria);
    }

    await this.loadAgents();
    await this.loadStatus();
    await this.getDateTab();

    this.spinner.hide();

    this.loadTasks();
    await this.searchDate(this.criteria.selectBtnIndex);

    this.loadActivityDate();
  }

  async getDateTab() {
    this.master.activityDate = [
      {
        id: 0,
        fillterType: 1,
        condition: 0,
        display: "วันนี้",
        qty: 0,
      },
    ];

    let res: any =
      await this.userConfigService.getActivityDateConfigByUsername();

    for (let index = 0; index < res.data.length; index++) {
      const data = res.data[index];
      data.fillterType = 4;
      data.qty = 0;
      this.master.activityDate.push(data);
    }
  }

  async loadAgents() {
    this.master.agents = this.user.userAgents;

    this.criteria.userAgents = this.user.userAgents;

    console.log(this.user);
    if (this.user.business.businessType == "A") {
      this.criteria.exceptHQ = true;
    } else {
      this.master.agents.unshift({ id: 1, name: "HQ" });
    }
  }

  async loadStatus() {
    this.spinner.show();
    let res: any = await this.masterService.getActivityStatus();
    this.master.status = res.data;

    if (this.criteria.status && this.criteria.status.length > 1) {
      let selected = [];
      for (let index = 0; index < this.criteria.status.length; index++) {
        const status = this.criteria.status[index];
        selected.push(this.master.status[status.id]);
      }
      this.criteria.status = selected;
    } else {
      this.criteria.status = [
        this.master.status[0],
        this.master.status[1],
        this.master.status[2],
      ];
    }

    this.spinner.hide();
  }

  async loadTasks() {
    this.loadCloseTask = true;
    let res: any = await this.taskService.getCloseTask();
    this.closeTasks = res.data;
    this.loadCloseTask = false;

    this.loadOpenTask = true;
    let res2: any = await this.taskService.getOpenTask();
    this.openTasks = res2.data;
    this.loadOpenTask = false;
  }

  async loadActivityDate() {
    this.showLoadingLoadActivityDate = true;
    this.criteria.activityDates = this.master.activityDate;

    let res2: any = await this.activityService.getSummaryActivityCount(
      this.criteria
    );

    this.master.activityDate = res2.data;

    this.showLoadingLoadActivityDate = false;
  }

  async advanceSearch() {
    await this.search();
    this.loadActivityDate();
  }

  async searchDate(index) {
    this.criteria.fillterType = this.master.activityDate[index].fillterType;
    this.criteria.dayCondition = this.master.activityDate[index].condition;
    this.criteria.selectBtnIndex = index;
    await this.search();
  }

  async search() {
    this.spinner.show();

    let res: any = await this.activityService.search(this.criteria);
    this.data = res;

    this.spinner.hide();
  }

  viewByTodo(item) {
    this.criteria.selectedActivityId = item.activityId;
    console.log(item);
    sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
    this.router.navigateByUrl("/CRM/main/" + item.customerId);
  }

  view(item) {
    this.criteria.selectedActivityId = item.id;
    console.log(this.criteria);
    sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
    this.router.navigateByUrl("/CRM/main/" + item.customerId);
  }

  update(item) {
    sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
    this.router.navigateByUrl("/agent/update/" + item.code);
  }

  async close(item) {
    await this.taskService.closeTask(item.id);
    await this.loadTasks();
  }

  async reopen(item) {
    await this.taskService.recallTask(item.id);
    await this.loadTasks();
  }

  assignActivityOwner(item) {
    const dialogRef = this.dialog.open(ChangeOwnerComponent, {
      maxWidth: "300px",
      minWidth: "300px",
      data: {
        agentId: this.user.businessId,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        let data = {
          activityId: item.id,
          ownerUser: result.username,
          customerId: item.customerId,
        };
        this.spinner.show();
        await this.activityService.assignActivityOwner(data);
        await this.search();
        this.spinner.hide();
        this.toastr.show(this.translate.instant("success.save-complete"));
      }
    });
  }

  assignActivityOwners() {
    const selectItems = this.data.data.filter((item) => item.selected);

    if (selectItems.length == 0) {
      this.toastr.show(
        "⚠️ กรุณาติ๊กเลือกข้อมูลที่ต้องการอัพเดทอย่างน้อย 1 รายการ ⚠️"
      );
      return;
    }

    const dialogRef = this.dialog.open(ChangeOwnerComponent, {
      maxWidth: "300px",
      minWidth: "300px",
      data: {
        agentId: this.user.businessId,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.spinner.show();

        for (let index = 0; index < selectItems.length; index++) {
          const item = selectItems[index];
          let data = {
            activityId: item.id,
            ownerUser: result.username,
            customerId: item.customerId,
          };

          await this.activityService.assignActivityOwner(data);
        }

        await this.search();
        this.spinner.hide();
        this.toastr.show(this.translate.instant("success.save-complete"));
      }
    });
  }

  createTasks() {
    const selectItems = this.data.data.filter(
      (item) => item.selected && item.ownerUser == this.user.username
    );

    if (selectItems.length == 0) {
      this.toastr.show(
        "⚠️ กรุณาติ๊กเลือกข้อมูลที่เป็นผู้ดูแลอย่างน้อย 1 รายการ ⚠️"
      );
      return;
    }

    const dialogRef = this.dialog.open(ManageTodoComponent, {
      maxWidth: "300px",
      minWidth: "300px",
      data: {
        scheduleDate: new Date(),
        hour: "00",
        minute: "00",
        noticeDay: 1,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.spinner.show();

        for (let index = 0; index < selectItems.length; index++) {
          const item = selectItems[index];
          result.activityId = item.id;

          await this.taskService.save(result);
        }

        await this.loadTasks();

        this.spinner.hide();

        this.toastr.show(this.translate.instant("success.save-complete"));
      }
    });
  }

  isOverdue(item) {
    let endOfDose = new Date(item.endOfDose);
    let date = new Date();
    return date.getTime() > endOfDose.getTime();
  }
}
