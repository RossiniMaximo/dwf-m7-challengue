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
(function () {
  const cs = state.getState();
  cs.user.token.token = localStorage.getItem("user-token");
  cs.loggedIn = false;
  const localdata = localStorage.getItem("user-data");
  if (localdata) {
    const parsedData = JSON.parse(localdata);
    cs.user.token.token = parsedData.user.token.token;
    state.setState(parsedData);
  }
})();
