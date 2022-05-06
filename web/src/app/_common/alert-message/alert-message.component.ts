import { OnInit, Component } from "@angular/core";
import { Subject } from "rxjs";
import { BaseComponent } from "app/base/base.component";
import { AuthService } from "app/shared/auth/auth.service";

@Component({
  selector: "app-alert-message",
  templateUrl: "./alert-message.component.html",
  styleUrls: ["./alert-message.component.scss"],
})
export class AlertMessageComponent extends BaseComponent implements OnInit {
  user;
  expiredDateStatus = 0;

  dismissible = true;

  public static updateUser: Subject<boolean> = new Subject();

  constructor(private authService: AuthService) {
    super();

    AlertMessageComponent.updateUser.subscribe((res) => {
      this.updatUser();
    });
  }

  async ngOnInit(): Promise<void> {
    this.updatUser();
  }

  updatUser() {
    this.user = this.authService.getUser();
    console.log(this.user);
    if (this.user.shop.expriedDate) {
      let expiredDate: any = new Date(this.user.shop.expriedDate);
      let cDate: any = new Date();
      let diff = expiredDate - cDate;

      console.log(diff);

      if (diff < 0) {
        this.expiredDateStatus = 2;
      } else if (diff / (1000 * 60 * 60 * 24) <= 3) {
        this.expiredDateStatus = 1;
      } else {
        this.expiredDateStatus = 0;
      }

      console.log(this.expiredDateStatus);
    }
  }
}
