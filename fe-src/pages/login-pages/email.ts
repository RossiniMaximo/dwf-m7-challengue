import { Router } from "@vaadin/router";
import { state } from "../../state";
class LoginPage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
    const cs = state.getState();
    const formEl = document.querySelector(".form");
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const email = target.email.value;
      cs.user.email = email;
      state.setState(cs);
      state.logInEmail();
    });
  }
  /* SI EL EMAIL ES VALIDO TENGO QUE PASAR A LA PAGINA DE LA CONTRASEÑA */
  render() {
    const form = document.createElement("form");
    form.className = "form";
    form.innerHTML = `
        <my-header></my-header>
        <div class="content-container">
          <h2 class="login__title">Ingresar</h2>
          <div class="input-container">
          <label class="login-input__label">Email</label>
          <input class="login-input"name="email" />
          </div>
          <div class="email-btn">
            <button class="login-form__button">siguiente</button>
          </div>
        <div>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
        .login__title{
            font-size : 40px;
        }
        .input-container{
            margin-top : 50px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        @media(min-width:735px){
          .input-container{
            margin-top : 10px;
        }
        }
        .email-btn{
          width: fit-content;
          margin: 0 auto;
          margin-top: 20px;
        }
        .login-input__label{
          font-family : "Rowdies", cursive;
          margin-left : 20px;
        }
        .login-input{
          display : block;
          padding : 10px;
          width :300px;
          margin-top : 10px;
          border :solid 2px;
          margin : 0 auto;
        }
        .login-form__button{
          padding  : 10px;
          width : 200px;
          font-family : "Rowdies", cursive;
          background-color : antiquewhite;
          border : solid 2px;
          font-size :14px;
        }
        .content-container{}
        @media(min-width:735px){
          .content-container{
            display:flex;
            flex-direction : column;
            align-items:center;
          }
        }
    `;
    form.appendChild(style);
    this.appendChild(form);
  }
}
customElements.define("login-page", LoginPage);
