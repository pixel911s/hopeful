import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-sms-chart',
  templateUrl: './sms-chart.component.html',
  styleUrls: ['./sms-chart.component.scss']
})
export class SmsChartComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() criteria: any = {};
  @Input() datasets = [];
  @Input() label = [];
  @Input() events: Observable<any>;
  @Output() search = new EventEmitter();

  private eventsSubscription: Subscription;

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [{
      data: this.datasets,
    }],
    labels: [this.label]
  };


  public lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  public lineChartType: ChartType = 'line';

  constructor() { }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe((data) => this.updateChart(data));
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  updateChart(data) {
    this.lineChartData.datasets = [{ data: data.datasets }];
    this.lineChartData.labels = data.labels;
    this.chart?.update();
  }

  searchCharts() {
    this.search.emit();
  }
}
