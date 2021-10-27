import { OnInit, Component, ChangeDetectorRef } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { UserService } from "app/shared/services/user.service";
import { BaseComponent } from "app/base/base.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AgentService } from "app/shared/services/agent.service";
import { RequestService } from "app/shared/services/request.service";

@Component({
  selector: "app-view-request",
  templateUrl: "./view-request.component.html",
  styleUrls: ["./view-request.component.scss"],
})
export class ViewRequestComponent extends BaseComponent implements OnInit {
  public data: any;
  public formGroup: FormGroup;
  public formGroup2: FormGroup;
  public isEdit = true;

  public approveData: any = {};

  get f() {
    return this.formGroup2.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private requestService: RequestService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = this.formBuilder.group({});

    this.formGroup2 = this.formBuilder.group({});
    this.formGroup2.addControl(
      "status",
      new FormControl({ value: "", disabled: true }, [])
    );
    this.formGroup2.addControl(
      "reason",
      new FormControl({ value: "", disabled: true }, [])
    );

    this.formGroup2.addControl(
      "createBy",
      new FormControl({ value: "", disabled: true }, [])
    );

    this.formGroup2.addControl(
      "approveBy",
      new FormControl({ value: "", disabled: true }, [])
    );

    this.formGroup2.addControl("reason", new FormControl({ value: "" }, []));

    let res: any = await this.requestService.get(
      this.activeRoute.snapshot.params.id
    );

    this.data = res.data;
    this.approveData.id = this.data.id;
    this.approveData.createDate = this.data.createDate;
    this.approveData.createBy = this.data.createBy;
  }

  changeStatus() {
    this.formGroup2.removeControl("reason");

    if (this.approveData.status == "REJECT") {
      this.formGroup2.addControl(
        "reason",
        new FormControl({ value: "" }, Validators.required)
      );
    } else {
      this.approveData.reason = "";
      this.formGroup2.addControl("reason", new FormControl({ value: "" }, []));
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
