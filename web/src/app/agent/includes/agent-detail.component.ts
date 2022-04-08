import { OnInit, Component, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { AgentService } from "app/shared/services/agent.service";
import { MasterService } from "app/shared/services/master.service";

@Component({
  selector: "app-agent-detail",
  templateUrl: "./agent-detail.component.html",
  styleUrls: ["./agent-detail.component.scss"],
})
export class AgentDetailComponent implements OnInit {
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
  isSetup: boolean = false;

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
      "name",
      new FormControl(
        { value: "", disabled: this.isReadOnly || this.isSetup },
        [Validators.required]
      )
    );

    this.formGroup.addControl(
      "lineNotifyToken",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );

    this.formGroup.addControl(
      "clearActivityDay",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );

    this.formGroup.addControl(
      "code",
      new FormControl({ value: "", disabled: this.isReadOnly || this.isEdit }, [
        Validators.required,
      ])
    );
  }
}
