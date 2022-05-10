import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MultipleMobilePopupMessageComponent } from '../multiple-mobile-popup-message/multiple-mobile-popup-message.component';

@Component({
  selector: 'app-sms-trans-log',
  templateUrl: './sms-trans-log.component.html',
  styleUrls: ['./sms-trans-log.component.scss']
})
export class SmsTransLogComponent implements OnInit {
  @Input() smsLog: any = {
    totalRecord: 0,
  };
  @Input() criteria: any = {};
  @Output() criteriaChange = new EventEmitter();
  @Output() search = new EventEmitter();
  

  ranges: any = [
    {
      value: [new Date(), new Date()],
      label: "วันนี้",
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 7)),
        new Date(),
      ],
      label: "7 วัน",
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 15)),
        new Date(),
      ],
      label: "15 วัน",
    },
    {
      value: [
        new Date(new Date().setMonth(new Date().getMonth() - 1)),
        new Date(),
      ],
      label: "1 เดือน",
    },
    {
      value: [
        new Date(new Date().setMonth(new Date().getMonth() - 3)),
        new Date(),
      ],
      label: "3 เดือน",
    },
  ];
  
  constructor(
    protected dialog: MatDialog,
    ) { }

  ngOnInit() {
  }

  searchTransaction() {    
    this.search.emit();
  }

  viewDetail(item) {
    console.log(item);
    let message = item.data.split(",").map(phone => phone.replace("66", "0")).join(", ");
    const dialogRef = this.dialog.open(MultipleMobilePopupMessageComponent, {
      maxWidth: "1000px",
      minWidth: "300px",
      minHeight: "100px",
      data: {
        message,
        remark: " หมายเหตุ : ใช้ SMS ทั้งหมด " + item.sms + " credit",
      },
    });
  }
}
