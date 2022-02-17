import { Router } from "@vaadin/router";
import { state } from "../state";
const back = require("../imgs/background_imgs/7.jpg");
const logo = require("../imgs/logo_patita.png");

class Header extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  listeners() {
    const burgerMenu = this.shadow.querySelector(".menu-btn");
    const navMenu = this.shadow.querySelector(".nav-menu");
    let menuOpen = false;
    if (burgerMenu) {
      burgerMenu.addEventListener("click", () => {
        if (!menuOpen) {
          burgerMenu.classList.toggle("open");
          navMenu.classList.toggle("open");
          menuOpen = true;
        } else {
          burgerMenu.classList.remove("open");
          menuOpen = false;
        }
      });
    }
    const navButton = this.shadow.querySelector(".nav-menu__button");
    if (navMenu) {
      navButton.addEventListener("click", () => {
        navMenu.classList.remove("open");
        burgerMenu.classList.remove("open");
      });
    }
    const cs = state.getState();
    const mydataEl = this.shadow.querySelector(".my-data");
    if (mydataEl) {
      mydataEl.addEventListener("click", () => {
        cs.pagesListeners.myDataPage = true;
        state.setState(cs);
        if (cs.loggedIn == true) {
          Router.go("/my-data");
        } else {
          Router.go("/login");
        }
      });
    }
    const myPetsEl = this.shadow.querySelector(".my-pets");
    myPetsEl.addEventListener("click", (e) => {
      cs.pagesListeners.myPetsPage = true;
      state.setState(cs);
      if (cs.loggedIn == true) {
        Router.go("/my-reports");
      } else {
        Router.go("/login");
      }
    });
    const reportPage = this.shadow.querySelector(".pets-report-page");
    reportPage.addEventListener("click", () => {
      cs.pagesListeners.reportPage = true;
      state.setState(cs);
      if (cs.loggedIn == true) {
        Router.go("/report-pet");
      } else {
        Router.go("/login");
      }
    });
    const logOutBtn = this.shadow.querySelector("#log-out");
    logOutBtn.addEventListener("click", () => {
      cs.loggedIn = false;
      state.setState(cs);
    });
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `
      .background{
        background : ${back}
      }
      .main-container{
        display : flex;
        justify-content : space-between;
        align-items:center;
        border: 2px solid;
        background-color: antiquewhite;
      }
      .logo-container{
        width : 100px;
        height :50px;
        margin-left: 5px;
      }
      .logo{
        width : 50px;
      }
      .menu-btn{
        position : relative;
        display:flex;
        justify-content : center;
        align-items:center;
        width : 80px;
        height :80px;
        cursor : pointer;
        transition :  all .5s ease-in-out
      }
      .menu-btn-brgr{
        width:50px;
        height:6px;
        background : black;
        border-radius : 5px;
        transition : all .5s ease-in-out
      }
      .menu-btn-brgr::before{
        transform : translateY(-16px);
      }
      .menu-btn-brgr::after{
        transform : translateY(16px);
      }
      .menu-btn-brgr::before,
      .menu-btn-brgr::after{
        content : ""; 
        position : absolute;
        width : 50px;
        height : 6px;
        background : black;
        border-radius : 5px;
        transition : all .5s ease-in-out;
      }
      .menu-btn.open .menu-btn-brgr{
        transform : translateX(-50px);
        background : transparent;
        box-shadow:none;
      }
      .menu-btn.open .menu-btn-brgr::before{
        transform : rotate(45deg) translate(35px, -35px);
      }
      .menu-btn.open .menu-btn-brgr::after{
        transform : rotate(-45deg) translate(35px, 35px);

      }
      .nav-menu a:hover{
        background-color :#320554
    } 
    .nav-menu.open{
      left : 0
    }
    .nav-menu{
      position : fixed;
      top : 0;
      left :100% ;
      width : 100%;
      display : block;
      min-height : 100vh;
      z-index : 98;
      background-color : #12002F;
      padding-top : 120px;
      transition :0.4s
    } 
   .nav-menu a{
     background-color : #1f103F;
     font-family: "Rowdies", cursive;
     width : 100%;
     color : #FFF;
     display:flex;
     flex-direction:column;
     align-items:center;
     padding : 12px;
      margin : 0 auto;
      margin-bottom : 16px;
      max-width :200px;
      text-decoration : none;
    }
    `;
    const cs = state.getState();
    const headerContainer = document.createElement("div");
    headerContainer.className = "main-container";
    headerContainer.innerHTML = `
      <div class="logo-container">
        <img class="logo" src=${logo}>
      </div>
      <div class="menu-btn">
          <div class ="menu-btn-brgr"></div>
      </div>
      <nav class="nav-menu">
        <a class="my-data">Mis datos</a>
        <a class="my-pets">Mis mascotas reportadas</a>
        <a class="pets-report-page">Reportar mascota</a>
        <a href="/home"class="pets-report-page">Menú</a>
        <div class="nav-menu__button-container">
        <a class="nav-menu__button">
            Volver
        </a>
        </div>
        <a id="log-out">cerrar sesión</a>
      </nav>
      `;
    headerContainer.appendChild(style);
    this.shadow.appendChild(headerContainer);
    this.listeners();
  }
}
customElements.define("my-header", Header);
