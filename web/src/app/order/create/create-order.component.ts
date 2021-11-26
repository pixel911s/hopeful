import { OnInit, Component, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BaseComponent } from "app/base/base.component";
import { AuthService } from "app/shared/auth/auth.service";
import { OrderService } from "app/shared/services/order.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create-order",
  templateUrl: "./create-order.component.html",
  styleUrls: ["./create-order.component.scss"],
})
export class CreateOrderComponent extends BaseComponent implements OnInit {
  public data: any = {
    paymentType: "COD",
    status: "O",
    createDate: new Date(),
    orderDate: new Date(),
  };

  public formGroup: FormGroup;
  public isReadOnly: any = true;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private authService: AuthService,
    private activeRoute: ActivatedRoute
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.data.createBy = this.authService.getUser().username;
    this.data.businessName = this.authService.getUser().business.name;
    this.formGroup = this.formBuilder.group({});

    if (this.activeRoute.snapshot.params.mobile) {
      this.data.deliveryContact = this.activeRoute.snapshot.params.mobile;
    }
  }

  async save() {
    if (this.formGroup.invalid) {
      this.toastr.show(this.translate.instant("error.please-fill-required"));
      this.markFormGroupTouched(this.formGroup);
      return;
    }
    if (!this.data.orderDetail || this.data.orderDetail.length == 0) {
      this.toastr.show("❌ กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้น");
      return;
    }
    this.spinner.show();
    await this.orderService.create(this.data);
    this.spinner.hide();
    this.toastr.show(this.translate.instant("success.save-complete"));
    this.router.navigateByUrl("/order");
  }
}
