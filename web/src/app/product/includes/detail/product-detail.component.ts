import { OnInit, Component, Input } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/auth/auth.service";
import { Ng4FilesSelected } from "app/shared/ng4-files";
import { BaseComponent } from "app/ิbase/base.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})
export class ProductDetailComponent extends BaseComponent implements OnInit {
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
    private toastr: ToastrService
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
      new FormControl({ value: "", disabled: this.isReadOnly || this.isEdit }, [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9-]*$"),
      ])
    );

    this.formGroup.addControl(
      "name",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );

    this.formGroup.addControl(
      "description",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );

    this.formGroup.addControl(
      "unit",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );

    this.formGroup.addControl(
      "remainingDay",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );

    this.formGroup.addControl(
      "price",
      new FormControl(
        { value: "", disabled: this.isReadOnly },
        Validators.required
      )
    );

    this.formGroup.addControl(
      "weight",
      new FormControl({ value: "", disabled: this.isReadOnly }, [
        Validators.required,
      ])
    );

    this.formGroup.addControl(
      "status",
      new FormControl({ value: "", disabled: this.isReadOnly }, [])
    );
  }

  public async filesSelect(selectedFiles: Ng4FilesSelected) {
    if (selectedFiles.files.length == 0) return;
    let file = selectedFiles.files[0];
    let maxSize = 10 * 1024 * 2014;
    let fileType = file.type.split("/")[0];

    if (file.size > maxSize) {
      let title = "";
      this.translate
        .get("err.file-large")
        .subscribe((result) => (title = result));
      this.toastr.show(title);
      return;
    }

    if (fileType.toLowerCase() != "image") {
      this.toastr.show("❌ อัปโหลดได้เฉพาะไฟล์รูปภาพเท่านั้น");
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      let image = new Image();
      image.src = event.target.result;
      image.onload = () => {
        this.data.imgUrl = event.target.result;
        this.data.newImageFlag = true;
        this.data.tmpNewImage = file;
      };
    };
  }
}
