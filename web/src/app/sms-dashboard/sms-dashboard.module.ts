import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { SmsDashboardRoutes } from './sms-dashboard.routing';
import { SearchComponent } from './search/search.component';
import { SmsChartComponent } from './components/sms-chart/sms-chart.component';
import { SmsTransLogComponent } from './components/sms-trans-log/sms-trans-log.component';
import { SmsAgentSummaryComponent } from './components/sms-agent-summary/sms-agent-summary.component';
import { MultipleMobilePopupMessageComponent } from './components/multiple-mobile-popup-message/multiple-mobile-popup-message.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmsDashboardRoutes,
  ],
  declarations: [
    SearchComponent,
    SmsChartComponent,
    SmsTransLogComponent,
    SmsAgentSummaryComponent,
    MultipleMobilePopupMessageComponent,
  ]
})
export class SmsDashboardModule { }
