import { OnInit, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { AgentService } from "app/shared/services/agent.service";
import { MasterService } from "app/shared/services/master.service";
import { UserConfigService } from "app/shared/services/user-config.service";
import { UserService } from "app/shared/services/user.service";
import { PopupConfirmComponent } from "app/_common/popup-confirm/popup-confirm.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-manage-activity-date",
  templateUrl: "./manage-activity-date.component.html",
  styleUrls: ["./manage-activity-date.component.scss"],
})
export class ManageActivityDateComponent implements OnInit {
  public data: any = [];
  public criteria: any = {
    page: 1,
    size: 20,
  };

  constructor(
    private configService: UserConfigService,
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
    await this.search();
  }

  async search() {
    this.spinner.show();

    let res: any = await this.configService.getActivityDateConfigByUsername(
      null
    );
    this.data = [];
    let group: any = {
      name: "",
    };

    for (let index = 0; index < res.data.length; index++) {
      const element = res.data[index];
      if (element.type != group.name) {
        group = {
          name: element.type,
          items: [],
        };

        this.data.push(group);
      }

      group.items.push(element);
    }

    console.log(this.data);

    this.spinner.hide();
  }

  update(item) {
    sessionStorage.setItem("HOPEFUL_CRITERIA", JSON.stringify(this.criteria));
    this.router.navigateByUrl("/setting/activity-date/update/" + item.id);
  }

  remove(item) {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      maxWidth: "1000px",
      minWidth: "300px",
      data: {
        message: "ยืนยันการลบรายการ",
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        await this.configService.deleteActivityDateConfig(item.id);
        await this.search();
        this.toastr.show("✔️ ลบรายการสำเร็จ.");
      }
    });
  }
}
