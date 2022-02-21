import { state } from "../../state";
class Misdatos extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
    const cs = state.getState();
    console.log("estado en datapage", cs);

    cs.pagesListeners.myDataPage = false;
    const formEl = document.querySelector(".form-my-data");
    formEl.addEventListener("submit", async (e) => {
      e.preventDefault();

      const target = e.target as any;
      const name = target.nombre.value;
      cs.user.fullname = name;
      const password1 = target.password1.value;
      const password2 = target.password2.value;
      if (cs.loggedIn == true && password1 == password2) {
        state.updateUserData(password1);
        this.passwordChangedSuccesfuly();
      } else {
        if (cs.loggedIn === false && password1 === password2) {
          const createUser: any = await state.signUp(password1);
          if (createUser) {
            cs.loggedIn = true;
            state.setState(cs);
          }
        }
      }
      state.setState(cs);
    });
  }
  passwordAlert() {
    const div = document.createElement("div");
    div.innerHTML = `
      <p class="alert-text">Las contraseñas  no coinciden!</p>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
      .alert-text{
        font-size:18px;
        font-family: "Rowdies", cursive;
      }
    `;
    div.appendChild(style);
    this.appendChild(div);
  }
  passwordChangedSuccesfuly() {
    const div = document.createElement("div");
    div.innerHTML = `
      <p class="alert-text">¡Contraseña cambiada!</p>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
      .alert-text{
        font-size:18px;
        font-family: "Rowdies", cursive;
      }
    `;
    div.appendChild(style);
    this.appendChild(div);
  }
  render() {
    const cs = state.getState();
    const root = document.createElement("form");
    root.className = "form-my-data";
    root.innerHTML = `
        <my-header></my-header>
        <h2 class="data-title">Mis Datos</h2>
        <div class="br">
        <label class="mydata-label">
        Nombre
        <input class="my-data-input" name="nombre" value="${cs.user.fullname}" type="text"/>
        </label>
        </div>
        <div class="br">
        <label class="mydata-label">
        Contraseña
        <input class="my-data-input" name="password1" type="text" />
        </label>
        <label class="mydata-label">
        Repetir contraseña
        <input class="my-data-input"  name="password2" type="text" />
        </label>
        <div class="button-container">
          <button>Guardar</button>
        </div>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
      .data-title{
        font-size : 35px;
        text-decoration : underline antiquewhite;
      }
      @media(min-width:735px){
        .data-title{
          text-align :center;
        }
      }
      .br{
        margin-top : 25px;
      }
      @media(min-width:735px){
        .br{
          display : flex;
          flex-direction : column;
          align-items : center;
        }
      }
      .button-container{
        margin : 0 auto;
        margin-top : 25px;
        border :solid 2px;
        width :fit-content;
      }
      .mydata-label{
        display : flex;
        flex-direction : column;
        font-family: "Rowdies", cursive;
        margin-top : 30px;
      }
      .my-data-input{
        padding : 10px;
        border :solid 2px;
        width : 320px;
        font-size: 16px
      }
       `;
    root.appendChild(style);
    this.appendChild(root);
  }
}
customElements.define("mis-datos-page", Misdatos);
