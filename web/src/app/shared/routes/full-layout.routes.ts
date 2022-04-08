import { Routes, RouterModule } from "@angular/router";

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: "page",
    loadChildren: () =>
      import("../../page/page.module").then((m) => m.PageModule),
  },
  {
    path: "CRM",
    loadChildren: () => import("../../crm/crm.module").then((m) => m.CRMModule),
  },
  {
    path: "agent",
    loadChildren: () =>
      import("../../agent/agent.module").then((m) => m.AgentModule),
  },
  {
    path: "user",
    loadChildren: () =>
      import("../../user/user.module").then((m) => m.UserModule),
  },
  {
    path: "request",
    loadChildren: () =>
      import("../../request/request.module").then((m) => m.RequestModule),
  },
  {
    path: "product",
    loadChildren: () =>
      import("../../product/product.module").then((m) => m.ProductModule),
  },
  {
    path: "agent-product",
    loadChildren: () =>
      import("../../agent-product/agent-product.module").then(
        (m) => m.AgentProductModule
      ),
  },
  {
    path: "order",
    loadChildren: () =>
      import("../../order/order.module").then((m) => m.OrderModule),
  },
  {
    path: "upload-order",
    loadChildren: () =>
      import("../../upload/upload-order.module").then(
        (m) => m.UploadOrderModule
      ),
  },
  {
    path: "sms",
    loadChildren: () => import("../../sms/sms.module").then((m) => m.SMSModule),
  },
  {
    path: "setting",
    loadChildren: () =>
      import("../../setting/setting.module").then((m) => m.SettingModule),
  },
  {
    path: "change-password",
    loadChildren: () =>
      import("../../change-password/change-password.module").then(
        (m) => m.ChangePasswordModule
      ),
  },
];
