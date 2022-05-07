import { Component, OnInit } from '@angular/core';
import { SMSService } from 'app/shared/services/sms.service';
import { AuthService } from "app/shared/auth/auth.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DATE_RANGES } from 'app/shared/data/date-range';

@Component({
  selector: 'app-sms-dashboard-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public data: any = {};
  public master: any = {
    agents: [],
  };
  user;
  isUserHQ: boolean = false;

  smsLog: any = {
    totalRecord: 0,
  };

  summarySmsTrans: any = {
    totalRecord: 0,
  };

  date = new Date();
  y = this.date.getFullYear();
  m = this.date.getMonth();

  criteria: any = {
    agentId: undefined,
    dates: [new Date(this.y, this.m, 1), this.date],
  };

  transLogCriteria: any = {
    page: 1,
    size: 20,
  };

  summaryCriteria: any = {
    page: 1,
    size: 20,
  };

  chartCriteria: any = {
    type: 0,
  };
  chartDatasets = [];
  chartLabels = [];
  eventsSubject: Subject<any> = new Subject<any>();

  credit: number = 0;
  totalDaily: number = 0;
  totalMonthly: number = 0;

  ranges = DATE_RANGES;

  constructor(
    private smsService: SMSService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    ) { }

  async ngOnInit() {
    this.user = this.authService.getUser();
    this.isUserHQ = this.user.business.businessType === 'H';
    this.master.agents = this.user.userAgents;

    if (this.isUserHQ) {
      this.master.agents = [this.user.business].concat(this.master.agents);
    } else if (this.master.agents && this.master.agents.length === 1) {
      this.criteria.agentId = this.master.agents[0].id;
    }

    await this.search();
  }

  async searchAgentSummarry() {
    console.log('searchAgentSummarry');
    let criteriaSearch = {
      ...this.criteria,
      ...this.summaryCriteria,
    }
    console.log(criteriaSearch);

    let res: any = await this.smsService.getSMSSummaryByAgent(criteriaSearch);
    this.summarySmsTrans = res;
    return res;
  }

  async searchTransLog() {
    let criteriaSearch  = {
      ...this.criteria,
      ...this.transLogCriteria,
    }
    let res: any = await this.smsService.searchSms(criteriaSearch);
    this.smsLog = res;
    return res;
  }

  async searchCharts() {
    let criteriaSearch  = {
      ...this.criteria,
      ...this.chartCriteria,
    }
    let res: any = await this.smsService.smsCharts(criteriaSearch);
    this.chartDatasets = res.data.map(d => d.sms);
    this.chartLabels = res.data.map(d => d.label);
    this.eventsSubject.next({
      datasets: this.chartDatasets,
      labels: this.chartLabels
    });
    return res;
  }

  async searchCredit() {
    let res: any = await this.smsService.getSMSCredit();
    this.credit = res.data;
    return res;
  }

  async searchTotalDaily() {
    let res: any = await this.smsService.getTotalDailySms(this.criteria);
    this.totalDaily = res.data;
    return res;
  }

  async searchTotalMonthly() {
    let res: any = await this.smsService.getTotalMonthlySms(this.criteria);
    this.totalMonthly = res.data;
    return res;
  }

  async search() {
    this.spinner.show();
    let res: any = await this.searchTransLog();
    let res2: any = await this.searchCharts();
    if (this.isUserHQ) {
      let res3: any = await this.searchAgentSummarry();
      let res4: any = await this.searchCredit();
    }
    await this.searchTotalDaily();
    await this.searchTotalMonthly();
    this.spinner.hide();
  }

  async onClickSearch() {
    this.transLogCriteria.page = 1;
    this.summaryCriteria.page = 1;
    this.chartCriteria.type = 0;
    await this.search();
  }
}
