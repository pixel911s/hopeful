import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/shared/auth/auth.service';
import { SMSService } from 'app/shared/services/sms.service';


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})

export class PageComponent implements OnInit {
  user;
  isUserHQ: boolean = false;
  credit: number = 0;

  constructor(
    private authService: AuthService,
    private smsService: SMSService,
  ) {}

  async ngOnInit() {
    this.user = this.authService.getUser();
    this.isUserHQ = this.user.business.businessType === 'H';
    this.credit = await this.searchCredit();
  }

  async searchCredit() {
    let res: any = await this.smsService.getSMSCredit();
    return res.data;
  }
}
