import { Router } from "@vaadin/router";
import { state } from "../../state";

class PasswordPage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
    const formEl = document.querySelector(".password-page__form");
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const password = target.password.value;
      state.logInPassword(password);
    });
    const cs = state.getState();
    state.subscribe(() => {
      if (cs.pagesListeners.myDataPage == true && cs.loggedIn == true) {
        Router.go("/my-data");
      }
      if (cs.pagesListeners.myPetsPage == true && cs.loggedIn == true) {
        Router.go("/my-reports");
      }
      if (cs.pagesListeners.reportPage == true && cs.loggedIn == true) {
        Router.go("/report-pet");
      }
    });
  }
  render() {
    const form = document.createElement("form");
    form.className = "password-page__form";
    form.innerHTML = `
        <my-header></my-header>
        <h2 class="pass-title">Ingresar</h2>
        <div class="input-container">
        <label class="login-input__label">Contraseña</label>
            <input class="login-input" type="password" name="password" />
        </div>
        <div class="email-btn">
          <button class="login-form__button">siguiente</button>
        </div>
        <div class="link-container">
            <a href="/my-data" class="link">OLVIDÉ MI CONTRASEÑA :(</a>
        </div>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
        .pass-title{
            font-size :40px;
        }
        @media(min-width:735px){
          .pass-title{
            text-align:center;
          }
        }
        .input-container{
            margin-top:50px;
        }
        .link-container{
            text-align: center;
            margin-top :40px;
        }
        .link{
            font-family: "Rowdies", cursive;
            font-size:14px;
            text-decoration :none;
            color : lightblue
        }
        .email-btn{
          width: fit-content;
          margin: 0 auto;
          margin-top: 20px;
        }
        .login-input{
          display : block;
          padding : 10px;
          width :300px;
          margin-top : 10px;
          border :solid 2px;
          margin : 0 auto;
        }
        .login-input__label{
          font-family : "Rowdies", cursive;
          margin-left : 20px;
        }
        @media(min-width:735px){
          .login-input__label{
            display : flex;
            flex-direction : column;
            align-items:center;
            margin-bottom : 20px;
            margin-left : 0 ;
          }
        }
        .login-form__button{
          padding  : 10px;
          width : 200px;
          font-family : "Rowdies", cursive;
          background-color : antiquewhite;
          border : solid 2px;
          font-size :14px;
        }
    `;
    form.appendChild(style);
    this.appendChild(form);
  }
}
customElements.define("password-page", PasswordPage);
