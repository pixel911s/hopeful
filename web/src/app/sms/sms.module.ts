import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SMSRoutingModule } from './sms-routing.module';
import { ManageSMSComponent } from './manage-sms/manage-sms.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SMSRoutingModule
  ],
  declarations: [
    ManageSMSComponent
  ],
  entryComponents: [

  ]
})
export class SMSModule { }
