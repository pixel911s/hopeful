import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OverlayModule } from "@angular/cdk/overlay";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { ClickOutsideModule } from "ng-click-outside";

import { AutocompleteModule } from "./components/autocomplete/autocomplete.module";
import { PipeModule } from "app/shared/pipes/pipe.module";

//COMPONENTS
import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { HorizontalMenuComponent } from "./horizontal-menu/horizontal-menu.component";
import { VerticalMenuComponent } from "./vertical-menu/vertical-menu.component";
import { CustomizerComponent } from "./customizer/customizer.component";
import { NotificationSidebarComponent } from "./notification-sidebar/notification-sidebar.component";

//DIRECTIVES
import { ToggleFullscreenDirective } from "./directives/toggle-fullscreen.directive";
import { SidebarLinkDirective } from "./directives/sidebar-link.directive";
import { SidebarDropdownDirective } from "./directives/sidebar-dropdown.directive";
import { SidebarAnchorToggleDirective } from "./directives/sidebar-anchor-toggle.directive";
import { SidebarDirective } from "./directives/sidebar.directive";
import { TopMenuDirective } from "./directives/topmenu.directive";
import { TopMenuLinkDirective } from "./directives/topmenu-link.directive";
import { TopMenuDropdownDirective } from "./directives/topmenu-dropdown.directive";
import { TopMenuAnchorToggleDirective } from "./directives/topmenu-anchor-toggle.directive";
import { NavBarComponent } from "app/nav-bar/nav-bar.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { Ng4FilesModule } from "./ng4-files";
import { MatDialogModule } from "@angular/material/dialog";
import { PopupConfirmComponent } from "app/_common/popup-confirm/popup-confirm.component";
import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from "ngx-bootstrap/datepicker";
import { UserDetailComponent } from "app/user/includes/detail/user-detail.component";
import { AngularDualListBoxModule } from "angular-dual-listbox";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { DragScrollModule } from "ngx-drag-scroll";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { SelectProductComponent } from "app/order/includes/select-product/select-product.component";
import { NgxTagsInputModule } from "ngx-tags-input";
import { NgChartsModule } from "ng2-charts";
import { AgentDetailComponent } from "app/agent/includes/agent-detail.component";

@NgModule({
  exports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    CustomizerComponent,
    NotificationSidebarComponent,
    ToggleFullscreenDirective,
    SidebarDirective,
    TopMenuDirective,
    NgbModule,
    TranslateModule,
    NavBarComponent,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    Ng4FilesModule,
    MatDialogModule,
    BsDatepickerModule,
    UserDetailComponent,
    AngularDualListBoxModule,
    CollapseModule,
    DragScrollModule,
    NgMultiSelectDropDownModule,
    TimepickerModule,
    NgxTagsInputModule,
    NgChartsModule,
    AgentDetailComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    TranslateModule,
    FormsModule,
    OverlayModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    ClickOutsideModule,
    AutocompleteModule,
    PipeModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    FormsModule,
    ToastrModule.forRoot({
      progressBar: true,
      // closeButton: true,
      // disableTimeOut: true,
      enableHtml: true,
    }),
    Ng4FilesModule,
    MatDialogModule,
    BsDatepickerModule,
    AngularDualListBoxModule,
    CollapseModule,
    DragScrollModule,
    NgMultiSelectDropDownModule,
    TimepickerModule.forRoot(),
    NgxTagsInputModule,
    NgChartsModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    CustomizerComponent,
    NotificationSidebarComponent,
    ToggleFullscreenDirective,
    SidebarLinkDirective,
    SidebarDropdownDirective,
    SidebarAnchorToggleDirective,
    SidebarDirective,
    TopMenuLinkDirective,
    TopMenuDropdownDirective,
    TopMenuAnchorToggleDirective,
    TopMenuDirective,
    NavBarComponent,
    PopupConfirmComponent,
    UserDetailComponent,
    SelectProductComponent,
    AgentDetailComponent,
  ],
  entryComponents: [PopupConfirmComponent, SelectProductComponent],
  providers: [
    { provide: BsDatepickerConfig, useFactory: getDatepickerConfig },
    DatePipe,
  ],
})
export class SharedModule {}

export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    dateInputFormat: "DD/MM/YYYY",
    showWeekNumbers: false,
  });
}
