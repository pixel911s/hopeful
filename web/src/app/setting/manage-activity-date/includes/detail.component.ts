import { OnInit, Component, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { AgentService } from "app/shared/services/agent.service";
import { MasterService } from "app/shared/services/master.service";

@Component({
  selector: "app-activity-date-config-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class ActivityDateConfigDetailComponent implements OnInit {
  public master: any = {};

  @Input()
  data: any;

  @Input()
  header = "Agent";

  @Input()
  formGroup: FormGroup;

  @Input()
  isEdit: boolean = false;

  @Input()
  isReadOnly: any;

  constructor(private authService: AuthService, translate: TranslateService) {
    translate.use(this.authService.getUser().lang);
  }

  get f() {
    return this.formGroup.controls;
  }

  async ngOnInit(): Promise<void> {
    this.prepareFormGroup();
  }

  prepareFormGroup() {
    this.formGroup.addControl(
      "display",
      new FormControl({ value: "", disabled: this.isReadOnly }, [
        Validators.required,
      ])
    );

    this.formGroup.addControl(
      "condition",
      new FormControl({ value: "", disabled: this.isReadOnly }, [
        Validators.required,
      ])
    );
  }
}
