import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  HostListener,
} from "@angular/core";
import { ROUTES } from "./vertical-menu-routes.config";
import { HROUTES } from "../horizontal-menu/navigation-routes.config";

import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { customAnimations } from "../animations/custom-animations";
import { DeviceDetectorService } from "ngx-device-detector";
import { ConfigService } from "../services/config.service";
import { Subscription } from "rxjs";
import { LayoutService } from "../services/layout.service";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./vertical-menu.component.html",
  animations: customAnimations,
})
export class VerticalMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("toggleIcon") toggleIcon: ElementRef;
  public menuItems: any[];
  level: number = 0;
  logoUrl = "assets/img/logo.png";
  public config: any = {};
  protected innerWidth: any;
  layoutSub: Subscription;
  configSub: Subscription;
  perfectScrollbarEnable = true;
  collapseSidebar = false;
  resizeTimeout;
  user;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private layoutService: LayoutService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
    private authService: AuthService
  ) {
    this.config = this.configService.templateConf;
    this.innerWidth = window.innerWidth;
    this.isTouchDevice();
  }

  ngOnInit() {
    this.user = this.authService.getUser();

    this.menuItems = [
      {
        path: "/page",
        title: "หน้าแรก",
        icon: "ft-home",
        class: "",
        // badge: "0",
        // badgeClass: "badge badge-pill badge-primary float-right mr-1 mt-1",
        isExternalLink: false,
        submenu: [],
      },
    ];

    if (this.user.function.CRM) {
      this.menuItems.push({
        path: "/CRM",
        title: "CRM",
        icon: "ft-calendar",
        class: "",
        isExternalLink: false,
        submenu: [],
      });
    }

    if (this.user.function.CREATE_ORDER || this.user.function.VIEW_ORDER) {
      this.menuItems.push({
        path: "/order",
        title: "ข้อมูลคำสั่งซื้อ",
        icon: "ft-file-text",
        class: "",
        isExternalLink: false,
        submenu: [],
      });
    }

    if (this.user.function.UPLOAD_ORDER) {
      this.menuItems.push({
        path: "/upload-order",
        title: "ประวัติการอัพโหลดออเดอร์",
        icon: "ft-upload",
        class: "",
        isExternalLink: false,
        submenu: [],
      });
    }

    if (this.user.function.CREATE_USER || this.user.function.VIEW_USER) {
      this.menuItems.push({
        path: "/user",
        title: "ข้อมูลผู้ใช้งาน",
        icon: "ft-users",
        class: "",
        isExternalLink: false,
        submenu: [],
      });
    }

    if (this.user.function.CREATE_AGENT || this.user.function.VIEW_AGENT) {
      this.menuItems.push({
        path: "/agent",
        title: "ข้อมูลตัวแทนจำหน่าย",
        icon: "ft-globe",
        class: "",
        isExternalLink: false,
        submenu: [],
      });
    }

    if (this.user.function.CREATE_PRODUCT || this.user.function.VIEW_PRODUCT) {
      this.menuItems.push({
        path: "",
        title: "ข้อมูลสินค้า",
        icon: "ft-box",
        class: "has-sub",
        isExternalLink: false,
        submenu: [
          {
            path: "/product",
            title: "จัดการข้อมูลสินค้า",
            icon: "ft-arrow-right submenu-icon",
            class: "",
            badge: "",
            badgeClass: "",
            isExternalLink: false,
            submenu: [],
          },
          {
            path: "/product-group",
            title: "จัดการกลุ่มสินค้า",
            icon: "ft-arrow-right submenu-icon",
            class: "",
            badge: "",
            badgeClass: "",
            isExternalLink: false,
            submenu: [],
          },
        ],
      });
    }

    if (
      this.user.function.SUPERVISOR &&
      this.user.business.businessType == "A"
    ) {
      this.menuItems.push({
        path: "/agent-product",
        title: "ข้อมูลสินค้า",
        icon: "ft-box",
        class: "",
        isExternalLink: false,
        submenu: [],
      });
    }

    this.menuItems.push({
      path: "/request",
      title: "ข้อมูลคำขอ",
      icon: "ft-pocket",
      class: "",
      isExternalLink: false,
      submenu: [],
    });

    let setupMenu = {
      path: "",
      title: "ตั้งค่าเพิ่มเติม",
      icon: "ft-settings",
      class: "has-sub",
      isExternalLink: false,
      submenu: [
        {
          path: "/setting/activity-date",
          title: "จัดการตัวเลือกวันที่ใน CRM",
          icon: "ft-arrow-right submenu-icon",
          class: "",
          badge: "",
          badgeClass: "",
          isExternalLink: false,
          submenu: [],
        },
      ],
    };

    if (this.user.function.SUPERVISOR) {
      setupMenu.submenu.push({
        path: "/setting/agent",
        title: "ตั้งค่าตัวแทนจำหน่าย",
        icon: "ft-arrow-right submenu-icon",
        class: "",
        badge: "",
        badgeClass: "",
        isExternalLink: false,
        submenu: [],
      });
    }

    this.menuItems.push(setupMenu);


    if (this.user.function.SENDSMS || this.user.function.VIEW_SMS) {
      let smsMenu = {
        path: "",
        title: "SMS",
        icon: "ft-mail",
        class: "has-sub",
        isExternalLink: false,
        submenu: [],
      };

      if (this.user.function.VIEW_SMS) {
        smsMenu.submenu.push({
          path: "/sms-dashboard",
          title: "SMS Dashboard",
          icon: "ft-arrow-right submenu-icon",
          class: "",
          isExternalLink: false,
          submenu: [],
        });
      }
      
      if (this.user.function.SENDSMS) {
        smsMenu.submenu.push({
          path: "/sms",
          title: "Manual SMS",
          icon: "ft-arrow-right submenu-icon",
          class: "",
          isExternalLink: false,
          submenu: [],
        });
      }
  
      this.menuItems.push(smsMenu);
    }

  }

  ngAfterViewInit() {
    this.configSub = this.configService.templateConf$.subscribe(
      (templateConf) => {
        if (templateConf) {
          this.config = templateConf;
        }
        this.loadLayout();
        this.cdr.markForCheck();
      }
    );

    this.layoutSub = this.layoutService.overlaySidebarToggle$.subscribe(
      (collapse) => {
        if (this.config.layout.menuPosition === "Side") {
          this.collapseSidebar = collapse;
        }
      }
    );
  }

  @HostListener("window:resize", ["$event"])
  onWindowResize(event) {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(
      (() => {
        this.innerWidth = event.target.innerWidth;
        this.loadLayout();
      }).bind(this),
      500
    );
  }

  loadLayout() {
    // if (this.config.layout.menuPosition === "Top") {
    //   // Horizontal Menu
    //   if (this.innerWidth < 1200) {
    //     // Screen size < 1200
    //     this.menuItems = HROUTES;
    //   }
    // } else if (this.config.layout.menuPosition === "Side") {
    //   // Vertical Menu{
    //   this.menuItems = ROUTES;
    // }

    if (this.config.layout.sidebar.backgroundColor === "white") {
      this.logoUrl = "assets/img/logo-dark.png";
    } else {
      this.logoUrl = "assets/img/logo2.png";
    }

    if (this.config.layout.sidebar.collapsed) {
      this.collapseSidebar = true;
    } else {
      this.collapseSidebar = false;
    }
  }

  toggleSidebar() {
    let conf = this.config;
    conf.layout.sidebar.collapsed = !this.config.layout.sidebar.collapsed;
    this.configService.applyTemplateConfigChange({ layout: conf.layout });

    setTimeout(() => {
      this.fireRefreshEventOnWindow();
    }, 300);
  }

  fireRefreshEventOnWindow = function () {
    const evt = document.createEvent("HTMLEvents");
    evt.initEvent("resize", true, false);
    window.dispatchEvent(evt);
  };

  CloseSidebar() {
    this.layoutService.toggleSidebarSmallScreen(false);
  }

  isTouchDevice() {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();

    if (isMobile || isTablet) {
      this.perfectScrollbarEnable = false;
    } else {
      this.perfectScrollbarEnable = true;
    }
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
    if (this.configSub) {
      this.configSub.unsubscribe();
    }
  }

  beforRoute() {
    sessionStorage.removeItem("NAV");
    sessionStorage.removeItem("HOPEFUL_CRITERIA");
  }
}
