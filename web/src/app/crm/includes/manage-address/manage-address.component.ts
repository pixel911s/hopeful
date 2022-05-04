import { Inject, Component, OnInit, Input } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { BaseComponent } from "app/base/base.component";
import { AuthService } from "app/shared/auth/auth.service";
import { CustomerService } from "app/shared/services/customer.service";
import { ProductService } from "app/shared/services/product.service";
import { PopupConfirmComponent } from "app/_common/popup-confirm/popup-confirm.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { FromAddressComponent } from "../from-address/from-address.component";

@Component({
  selector: "app-manage-address",
  templateUrl: "manage-address.component.html",
  styleUrls: ["manage-address.component.scss"],
})
export class ManageAddressComponent extends BaseComponent implements OnInit {
  public data: any = {};

  public criteria: any = {
    page: 1,
    size: 10,
    status: 1,
  };

  constructor(
    public dialogRef: MatDialogRef<ManageAddressComponent>,
    private translate: TranslateService,
    private authService: AuthService,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    protected dialog: MatDialog,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public customerId: any
  ) {
    super();
    translate.use(this.authService.getUser().lang);
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData() {
    let res: any = await this.customerService.getAddresses(this.customerId);

    this.data = res.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  select(item): void {
    this.dialogRef.close(item);
  }

  create() {
    const dialogRef = this.dialog.open(FromAddressComponent, {
      maxWidth: "300px",
      minWidth: "300px",
      data: {
        data: {},
        header: "เพิ่มข้อมูลที่อยู่ใหม่",
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.spinner.show();
        result.businessId = this.customerId;
        result.addressType = "D";
        await this.customerService.createAddress(result);
        await this.loadData();
        this.spinner.hide();
      }
    });
  }

  setDefault(item): void {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      maxWidth: "300px",
      minWidth: "300px",
      data: {
        message: "ยืนยันการตั้งเป็นที่อยู่ตั้งต้น.",
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.spinner.show();
        item.isDefault = true;
        await this.customerService.updateAddress(item);
        await this.loadData();
        this.spinner.hide();
        this.toastr.show("✔️ ตั้งค่าที่อยู่ตั้งต้นสำเร็จ.");
      }
    });
  }

  edit(item) {
    const dialogRef = this.dialog.open(FromAddressComponent, {
      maxWidth: "300px",
      minWidth: "300px",
      data: {
        data: Object.assign({}, item),
        header: "แก้ไขข้อมูลที่อยู่",
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.spinner.show();
        await this.customerService.updateAddress(item);
        await this.loadData();
        this.spinner.hide();
      }
    });
  }

  delete(item): void {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      maxWidth: "300px",
      minWidth: "300px",
      data: {
        message: "ยืนยันการลบข้อมูลที่อยู่.",
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.spinner.show();
        await this.customerService.deleteAddress(item.id);
        await this.loadData();
        this.spinner.hide();
        this.toastr.show("✔️ ลบข้อมูลที่อยู่สำเร็จ.");
      }
    });
  }
}
