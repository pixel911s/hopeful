import { OnInit, Component, Input } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { Ng4FilesSelected } from "app/shared/ng4-files";
import { PopupConfirmComponent } from "app/_common/popup-confirm/popup-confirm.component";
import { BaseComponent } from "app/base/base.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { ProductService } from "app/shared/services/product.service";
import { SelectProductComponent } from "app/order/includes/select-product/select-product.component";

@Component({
  selector: "app-agent-product-detail",
  templateUrl: "./agent-product-detail.component.html",
  styleUrls: ["./agent-product-detail.component.scss"],
})
export class AgentProductDetailComponent
  extends BaseComponent
  implements OnInit
{
  public master: any = {};

  @Input()
  data: any;

  @Input()
  header = "Product";

  @Input()
  formGroup: FormGroup;

  @Input()
  isEdit: boolean = false;

  @Input()
  isReadOnly: any;

  tempProductType;

  details: FormArray;

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    protected dialog: MatDialog,
    private productService: ProductService
  ) {
    super();
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
      "barcode",
      new FormControl({ value: "", disabled: true }, [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9-]*$"),
      ])
    );

    this.formGroup.addControl(
      "name",
      new FormControl({ value: "", disabled: true }, Validators.required)
    );

    this.formGroup.addControl(
      "description",
      new FormControl({ value: "", disabled: true }, Validators.required)
    );

    this.formGroup.addControl(
      "unit",
      new FormControl({ value: "", disabled: true }, Validators.required)
    );

    this.formGroup.addControl(
      "remainingDay",
      new FormControl({ value: "" }, Validators.required)
    );

    this.formGroup.addControl(
      "price",
      new FormControl({ value: "", disabled: true }, Validators.required)
    );

    this.formGroup.addControl(
      "weight",
      new FormControl({ value: "", disabled: true }, [Validators.required])
    );

    this.formGroup.addControl(
      "status",
      new FormControl({ value: "", disabled: true }, [])
    );

    this.formGroup.addControl(
      "isSet",
      new FormControl({ value: "", disabled: true }, [])
    );
  }
}
