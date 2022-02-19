import { Router } from "@vaadin/router";

const outlet = document.querySelector(".root");
const router = new Router(outlet);
router.setRoutes([
  { path: "/", component: "my-home-page" },
  { path: "/home", component: "my-home-page" },
  { path: "/my-data", component: "mis-datos-page" },
  { path: "/login", component: "login-page" },
  { path: "/login-pass", component: "password-page" },
  { path: "/report-pet", component: "report-page" },
  { path: "/my-reports", component: "my-reports" },
]);
exports.module(Router);
