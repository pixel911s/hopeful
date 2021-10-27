import { Routes, RouterModule } from "@angular/router";

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: "page",
    loadChildren: () =>
      import("../../page/page.module").then((m) => m.PageModule),
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
    path: "order",
    loadChildren: () =>
      import("../../order/order.module").then((m) => m.OrderModule),
  },
  {
    path: "change-password",
    loadChildren: () =>
      import("../../change-password/change-password.module").then(
        (m) => m.ChangePasswordModule
      ),
  },
];
