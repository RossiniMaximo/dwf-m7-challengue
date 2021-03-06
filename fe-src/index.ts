import "./components/header";
import "./components/button";
import "./components/input";
import "./pages/home-page/home";
import "./pages/personal-info/mydata";
import "./pages/login-pages/email";
import "./pages/login-pages/password";
import "./pages/report-page/report";
import "./pages/my-pets/mypets";
import "./router";
import { state } from "./state";
import { Router } from "@vaadin/router";
(function () {
  const cs = state.getState();
  state.subscribe(() => {
    if (cs.user.email == "") {
      Router.go("/my-data");
    }
  });
})();
