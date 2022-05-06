import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sms-agent-summary',
  templateUrl: './sms-agent-summary.component.html',
  styleUrls: ['./sms-agent-summary.component.scss']
})
export class SmsAgentSummaryComponent implements OnInit {
  @Input() summarySmsTrans: any;
  @Input() criteria: any = {};
  @Output() criteriaChange = new EventEmitter();
  @Output() search = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSearch() {
    this.search.emit();
  }
}
