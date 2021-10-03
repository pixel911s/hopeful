import { Routes, RouterModule } from "@angular/router";

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: "page",
    loadChildren: () =>
      import("../../page/page.module").then((m) => m.PageModule),
  },
  {
    path: "user",
    loadChildren: () =>
      import("../../user/user.module").then((m) => m.UserModule),
  },
];
