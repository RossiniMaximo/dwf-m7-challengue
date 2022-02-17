import { state } from "../../state";
const backgroundIMG = require("../../imgs/background_imgs/7.jpg");
const bigBackgroundIMG = require("../../imgs/background_imgs/15.jpg");

class Home extends HTMLElement {
  constructor() {
    super();
    this.clickListener();
  }
  connectedCallback() {
    this.render();
    const cs = state.getState();
    cs.updateClick = false;
    const buttonEl = document.querySelector(".click-receptor");
    buttonEl.addEventListener("click", () => {
      this.addCards();
      buttonEl.remove();
    });
  }
  addCards() {
    const div = this.querySelector(".raiz");
    state.addCard(div);
  }
  render() {
    const container = document.createElement("div");

    container.innerHTML = `
          <my-header ></my-header>
          <div class="title-container">
              <h2 class="home-title">Mascotas perdidas cerca tuyo</h2>
          </div>
          <div class ="text-container">
              <p class="home-text">Para ver las mascotas cercanas reportadas  necesitamos permiso para conocer tu ubicación.</p>
          </div>
          <div class="home-button-container">
            <div class="click-receptor">
              <my-button >brindar ubicación</my-button>
            </div>
          <div class="raiz"></div>
          <div class="insert-report-data"></div>
      `;
    const style = document.createElement("style");
    style.innerHTML = `
          body {
              background: url(${backgroundIMG});
              height: 600px;
          }
          @media (min-width: 735px) {
            body {
              background: url(${bigBackgroundIMG});
            }
          }
          .raiz{
            position :relative;
          }
          @media(min-width:735px){
            .raiz{
              display: inline-flex;
              flex-wrap: wrap;
              gap: 40px;
              justify-content : center;
            }
          }
          
      `;

    container.appendChild(style);
    this.appendChild(container);
  }
  reportInfoCard() {
    const cs = state.getState();
    const div = document.createElement("div");
    div.className = "main";
    const style = document.createElement("style");
    div.innerHTML = `
    <div class="title-container">
    <h3 class="pet-name-title">Reportar info de ${cs.petName}</h3>
  </div>
  <form class="formulary">
    <div class="inputs-container">
        <label class="mydata-label">
          Nombre
          <input class="input" name="fullname" type="text" />
        </label>
        <label class="label">
          Teléfono
          <input class="input" name="phone" type="text" />
        </label>
    </div>
    <div class="form-container">
      <div class="text-area-container">
        <p class="form-label">¿DONDE LO VISTE?</p>
        <textarea name="text" class="form-textarea"></textarea>
      </div>
      <div class="form-button-container">
        <button id="send-btn" class="form-button">Enviar</button>
      </div>
  </form>
    <div class="form-button-container">
      <button id="goback-btn" class="form-button">volver</button>
    </div>
  </div>
    `;
    style.innerHTML = `
    .main{
      background-color:antiquewhite;
      padding : 20px;
      border: solid;
      border-radius: 4px;
    }
      .title-container{}
      .pet-name-title{
        font-family: "Rowdies", cursive;
      }
      .inputs-container{
        font-family: "Rowdies", cursive;
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .form-container{}
      .text-area-container{
        height: 100px;
      }
      .form-label{
        font-family: "Rowdies", cursive;
      }
      .form-textarea:focus {
        outline: 0;
        outline-color: transparent;
        outline-style: none;
      }
      .form-textarea{
        font-family: "Rowdies", cursive;
        resize:none;
        width :100%;
        height : 80px;
        padding : 10px;
        border :solid 2px;
      }
      .form-button-container{
        margin-top:30px
      }
      .form-button{
        font-family: "Rowdies", cursive;
        width :100%;
        padding : 10px;
        border :solid 2px;
        border-radius : 4px;
      }
    `;
    div.appendChild(style);
    const homeTitle = document.querySelector(".home-title");
    const homeText = document.querySelector(".home-text");
    const hometitleContainer = document.querySelector(".title-container");
    const hometextContainer = document.querySelector(".text-container");
    const rootEl = document.querySelector(".raiz");
    const container = document.querySelector(".insert-report-data");
    if (cs.reportClick == "true") {
      homeTitle.remove();
      homeText.remove();
      rootEl.remove();
      container.replaceChildren(div);
      cs.reportClick = false;
    }
    const gobackBtn = div.querySelector("#goback-btn");
    gobackBtn.addEventListener("click", () => {
      div.remove();
      hometitleContainer.appendChild(homeTitle);
      hometextContainer.appendChild(homeText);
      container.appendChild(rootEl);
    });
    const formEl = div.querySelector(".formulary");
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      console.log("soy el target", target.fullname);
      const text = target.text.value;
      const name = target.fullname.value;
      const phoneNumber = target.phone.value;
      cs.user.sendEmail.text = text;
      cs.user.sendEmail.name = name;
      cs.user.sendEmail.phone = phoneNumber;
      state.setState(cs);
      state.sendEmail();
    });
  }
  clickListener() {
    const cs = state.getState();
    state.subscribe(() => {
      if (cs.reportClick == "true") {
        this.reportInfoCard();
      }
    });
  }
}
customElements.define("my-home-page", Home);
