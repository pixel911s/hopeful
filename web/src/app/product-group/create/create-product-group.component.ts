import { OnInit, Component, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ProductGroupService } from "app/shared/services/product-group.service";
import { BaseComponent } from "app/base/base.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create-product-group",
  templateUrl: "./create-product-group.component.html",
  styleUrls: ["./create-product-group.component.scss"],
})
export class CreateProductGroupComponent extends BaseComponent implements OnInit {
  public data: any = {};
  public formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private productGroupService: ProductGroupService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = this.formBuilder.group({});
  }

  async save() {
    if (this.formGroup.invalid) {
      this.toastr.show(this.translate.instant("error.please-fill-required"));
      this.markFormGroupTouched(this.formGroup);
      return;
    }
    
    this.spinner.show();

    await this.productGroupService.save(this.data);
    this.spinner.hide();
    this.toastr.show("success.save-complete");
    this.router.navigateByUrl("/product-group");
  }
}