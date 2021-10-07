import { OnInit, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"],
})
export class NavBarComponent implements OnInit {
  public data = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.data = JSON.parse(sessionStorage.getItem("NAV"));

    console.log(this.data);

    if (!this.data) {
      this.data = [{ name: "หน้าหลัก", path: "/dashboard", isActive: false }];
      sessionStorage.setItem("NAV", JSON.stringify(this.data));
    } else {
      let snapIndex = 0;
      for (let index = 0; index < this.data.length; index++) {
        const item = this.data[index];
        item.isActive = false;
        if (item.name === this.route.snapshot.data.name) {
          snapIndex = index;
          break;
        }
      }

      if (snapIndex != 0) {
        this.data = this.data.slice(0, snapIndex);
      }
    }

    if (this.router.url !== "/dashboard") {
      let nav = this.route.snapshot.data;
      console.log(nav);
      nav.isActive = true;
      nav.path = this.router.url;

      this.data.push(nav);
    } else {
      this.data = [{ name: "Dashboard", path: "/dashboard", isActive: false }];
      sessionStorage.setItem("NAV", JSON.stringify(this.data));
    }

    sessionStorage.setItem("NAV", JSON.stringify(this.data));
  }
}
