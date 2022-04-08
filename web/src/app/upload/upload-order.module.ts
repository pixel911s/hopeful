import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { SearchUploadComponent } from "./search-upload/search-upload.component";
import { UploadOrderRoutingModule } from "./upload-order-routing.module";

@NgModule({
  imports: [CommonModule, SharedModule, UploadOrderRoutingModule],
  declarations: [SearchUploadComponent],
  entryComponents: [SearchUploadComponent],
})
export class UploadOrderModule {}
