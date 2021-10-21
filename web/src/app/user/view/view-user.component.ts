import { OnInit, Component, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "app/shared/services/user.service";
import { BaseComponent } from "app/base/base.component";

@Component({
  selector: "app-view-user",
  templateUrl: "./view-user.component.html",
  styleUrls: ["./view-user.component.scss"],
})
export class ViewUserComponent extends BaseComponent implements OnInit {
  public data: any = {};
  public formGroup: FormGroup;
  public isReadOnly: any = true;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activeRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = this.formBuilder.group({});

    let res: any = await this.userService.get(
      this.activeRoute.snapshot.params.id
    );

    this.data = res.data;

    this.cdRef.detectChanges();

    this.data.startDate = new Date(this.data.startDate);
    this.data.endDate = new Date(this.data.endDate);
  }
}
