import { OnInit, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { ActivityService } from "app/shared/services/activity.service";
import { AgentService } from "app/shared/services/agent.service";
import { CustomerService } from "app/shared/services/customer.service";
import { MasterService } from "app/shared/services/master.service";
import { NoteService } from "app/shared/services/note.service";
import { OrderService } from "app/shared/services/order.service";
import { TaskService } from "app/shared/services/task.service";
import { UserConfigService } from "app/shared/services/user-config.service";
import { UserService } from "app/shared/services/user.service";
import { PopupConfirmComponent } from "app/_common/popup-confirm/popup-confirm.component";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { CreateNoteComponent } from "../includes/create-note/create-notecomponent";
import { ManageTodoComponent } from "../includes/manage-todo/manage-todo.component";
import { UpdateCustomerComponent } from "../includes/update-customer/update-customer.component";

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
    size: 5,
  };

  public noteCriteria: any = {
    page: 1,
    size: 5,
  };

  public master: any = {
    agents: [],
    activityDate: [],
  };

  user;
  customer;
  notes: any = {};
  selectedActivity: any = null;
  date = new Date();

  openTasks: any = [];
  closeTasks: any = [];

  isTodoCollapsed1 = false;
  isTodoCollapsed2 = false;
  isASCollapsed = false;
  isAdvanceCollapsed = true;
  isNoteCollapsed = false;
  isTransactionCollapsed = false;

  loadingCustomer = false;
  loadingActivitiesList = false;
  loadingOrder = false;
  loadingActivity = false;
  loadingNote = false;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: "id",
    textField: "status",
    selectAllText: "เลือกทั้งหมด",
    unSelectAllText: "นำออกทั้งหมด",
    itemsShowLimit: 3,
    allowSearchFilter: false,
  };

  constructor(
    private activityService: ActivityService,
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private masterService: MasterService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService,
    protected dialog: MatDialog,
    private noteService: NoteService,
    private translate: TranslateService
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

    await this.loadAgents();
    await this.loadStatus();
    await this.loadActivityDate();
    // await this.search();
    await this.loadTasks();
    await this.searchDate(this.criteria.selectBtnIndex);
    await this.loadActivity();
    await this.loadNote();
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
    this.customer.orders = res;
    console.log(this.customer.orders);
    this.loadingOrder = false;
  }

  async loadActivity() {
    this.loadingActivity = true;

    let res: any = await this.activityService.get(
      this.criteria.selectedActivityId
    );
    this.selectedActivity = res.data;
    this.loadingActivity = false;
  }

  async loadNote() {
    this.loadingNote = true;

    this.noteCriteria.customerId = this.criteria.customerId;

    let res: any = await this.noteService.search(this.noteCriteria);
    this.notes = res;
    this.loadingNote = false;
  }

  async loadAgents() {
    this.spinner.show();
    this.master.agents = this.user.userAgents;

    this.criteria.userAgents = this.user.userAgents;

    console.log(this.user);
    if (this.user.business.businessType == "A") {
      this.criteria.exceptHQ = true;
    } else {
      this.master.agents.unshift({ id: 1, name: "HQ" });
    }
    this.spinner.hide();
  }

  async loadStatus() {
    this.spinner.show();
    let res: any = await this.masterService.getActivityStatus();
    this.master.status = res.data;

    this.criteria.status = [
      this.master.status[0],
      this.master.status[1],
      this.master.status[2],
    ];
    this.spinner.hide();
  }

  async loadTasks() {
    this.spinner.show();

    let res: any = await this.taskService.getCloseTask(
      this.criteria.customerId
    );
    this.closeTasks = res.data;

    let res2: any = await this.taskService.getOpenTask(
      this.criteria.customerId
    );
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

  async advanceSearch() {
    await this.loadActivityDate();
    await this.search();
  }

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

  async deleteNote(item) {
    if (item.createBy != this.user.username) {
      this.toastr.show("❌ ไม่สามารถลบ Note ผู้อื่นได้");
      return;
    }

    await this.noteService.deleteNote(item);
    await this.loadNote();
    this.toastr.show("✔️ ลบข้อมูล Note สำเร็จ");
  }

  async selectActivity(id) {
    this.criteria.selectedActivityId = id;
    await this.loadActivity();
  }

  async updateStatus(status) {
    if (
      this.customer.activityOwner == null ||
      this.customer.activityOwner != this.user.username
    ) {
      this.toastr.show("❌ ไม่สามารถดำเนินการได้ เนื่องจากไม่ใช่ผู้ดูแล");
      return;
    }

    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      maxWidth: "300px",
      minWidth: "300px",
      data: {
        message: "ยืนยันการเปลี่ยนสถานะ",
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.spinner.show();

        await this.activityService.updateActivityStatus(
          this.selectedActivity.id,
          status
        );

        await this.loadActivity();

        await this.search();

        await this.loadTasks();

        this.spinner.hide();

        this.toastr.show(this.translate.instant("success.save-complete"));

        if (status == 3) {
          const dialogRef = this.dialog.open(PopupConfirmComponent, {
            maxWidth: "300px",
            minWidth: "300px",
            data: {
              message: "กดยืนยันเพื่อไปที่หน้าเปิดออเดอร์สำหรับลูกค้าคนนี้.",
            },
          });

          dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
              this.router.navigateByUrl(
                "/order/create/" + this.customer.mobile
              );
            }
          });
        }
      }
    });
  }

  updateNote(item) {
    if (item.createBy != this.user.username) {
      this.toastr.show("❌ ไม่สามารถแก้ไข Note ผู้อื่นได้");
      return;
    }

    const dialogRef = this.dialog.open(CreateNoteComponent, {
      maxWidth: "1000px",
      minWidth: "300px",
      data: Object.assign({}, item),
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        result.customerId = this.customer.id;

        await this.noteService.save(result);
        await this.loadNote();
        this.toastr.show(this.translate.instant("success.save-complete"));
      }
    });
  }

  updateCustomer() {
    const dialogRef = this.dialog.open(UpdateCustomerComponent, {
      maxWidth: "300px",
      minWidth: "300px",
      data: Object.assign({}, this.customer),
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        result.customerId = this.criteria.customerId;

        await this.customerService.updateProfile(result);
        await this.loadCustomer(result.customerId);
        await this.loadOrderHistories();
        this.toastr.show(this.translate.instant("success.save-complete"));
      }
    });
  }

  createNote() {
    const dialogRef = this.dialog.open(CreateNoteComponent, {
      maxWidth: "1000px",
      minWidth: "300px",
      data: {},
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        result.customerId = this.criteria.customerId;

        await this.noteService.save(result);
        await this.loadNote();
        this.toastr.show(this.translate.instant("success.save-complete"));
      }
    });
  }

  createTask() {
    if (!this.criteria.selectedActivityId) {
      this.toastr.show("กรุณาเลือก Activity.");
      return;
    }

    if (
      this.customer.activityOwner == null ||
      this.customer.activityOwner != this.user.username
    ) {
      this.toastr.show("❌ ไม่สามารถดำเนินการได้ เนื่องจากไม่ใช่ผู้ดูแล");
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
        result.activityId = this.selectedActivity.id;

        this.spinner.show();

        await this.taskService.save(result);
        await this.loadTasks();

        this.spinner.hide();

        this.toastr.show(this.translate.instant("success.save-complete"));
      }
    });
  }

  assignActivityOwner() {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      maxWidth: "300px",
      minWidth: "300px",
      data: {
        message: "ยืนยันการดูแลลูกค้ารายนี้.",
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        let data = {
          activityId: this.selectedActivity.id,
          ownerUser: this.user.username,
          customerId: this.customer.id,
        };

        this.spinner.show();

        await this.activityService.assignActivityOwner(data);
        await this.loadCustomer(this.customer.id);
        await this.loadOrderHistories();

        this.spinner.hide();
        this.toastr.show(this.translate.instant("success.save-complete"));
      }
    });
  }
}
