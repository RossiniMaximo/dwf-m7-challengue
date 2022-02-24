import { Router } from "@vaadin/router";
require("dotenv").config();
const API_URL = process.env.DATABASE_URL || "http://localhost:3001";
const state = {
  data: {
    user: {
      email: "",
      pets: [],
      token: "",
      userId: 0,
      fullname: "",
      sendEmail: {
        text: "",
        phone: "",
        name: "",
      },
    },
    pet: {
      petName: "",
      lat: undefined,
      lng: undefined,
      img: "",
    },
    pagesListeners: {
      reportPage: false,
      myDataPage: false,
      myPetsPage: false,
    },
    reportClick: "false",
    forgotPassword: "false",
    updateClick: false,
    loggedIn: false,
    wantToModify: "",
    wantToReportInfo: 0,
    petOwnerEmail: "",
  },
  listeners: [],
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (let cb of this.listeners) {
      cb();
    }
    localStorage.setItem("user-data", JSON.stringify(newState));

    console.log("soy el state he cambiado", newState);
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  retrieveLocalData() {
    const cs = this.getState();
    const localdata = localStorage.getItem("user-data");
    if (localdata) {
      console.log("soy la localdata", localdata);
      const parsedData = JSON.parse(localdata);
      console.log("soy la parsed data", parsedData);
      state.setState(parsedData);
    } else {
      state.setState(cs);
    }
  },
  async sendEmail() {
    const cs = this.getState();

    const res = await fetch(API_URL + "/report-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
      body: JSON.stringify({
        petId: cs.wantToReportInfo,
        text: cs.user.sendEmail.text,
        name: cs.user.fullname,
        phone: cs.user.sendEmail.phone,
      }),
    });
    const data = await res.json();
  },
  async signUp(password, cb?) {
    try {
      const cs = this.getState();
      const { email, fullname } = cs.user;
      const res = await fetch(API_URL + "/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, fullname, password }),
      });
      const data = await res.json();
      console.log("data del signup", data);
      cs.user.userId = data.id;
      this.setState(cs);
      this.createToken(password);
      if (cb) {
        cb();
      }
    } catch (e) {
      console.log("soy el error del signup", e);
    }
  },
  async logInEmail() {
    const cs = this.getState();
    console.log("soy el email del user", cs.user.email);

    try {
      const res = await fetch(API_URL + "/find-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: cs.user.email }),
      });
      const data = await res.json();
      /* console.log("DATA DE LOGINEMAIL ", data); */
      if (data != false) {
        cs.user.fullname = data.fullname;
        cs.user.userId = data.id;

        state.setState(cs);
        Router.go("/login-pass");
      } else {
        Router.go("/my-data");
      }
    } catch (e) {
      console.log("soy el error del loginemail :", e);
    }
  },
  async logInPassword(password) {
    try {
      const res = await fetch(API_URL + "/find-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data != "Contraseña erronéa") {
        this.createToken(password);
      }
    } catch (e) {
      console.log("soy el error de loginpassword", e);
    }

    /*  console.log("DATA del  logIn password", data); */
  },
  async createToken(password) {
    const cs = this.getState();

    const res = await fetch(API_URL + "/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: cs.user.email, password }),
    });
    const data = await res.json();
    /* console.log("data del createToken", data); */
    if (data) {
      cs.user.token = data;
      cs.loggedIn = true;
      state.setState(cs);
    }
  },
  logOut() {
    const newState = {
      user: {
        email: "",
        pets: [],
        token: "",
        userId: 0,
        fullname: "",
        sendEmail: {
          text: "",
          phone: "",
          name: "",
        },
      },
      pet: {
        petName: "",
        lat: undefined,
        lng: undefined,
        img: "",
      },
      pagesListeners: {
        reportPage: false,
        myDataPage: false,
        myPetsPage: false,
      },
      reportClick: "false",
      forgotPassword: "false",
      updateClick: false,
      loggedIn: false,
      wantToModify: "",
      wantToReportInfo: 0,
      petOwnerEmail: "",
    };
    localStorage.clear();
    state.setState(newState);
  },
  async updateUserData(password) {
    const cs = this.getState();
    console.log("cs en update", cs);
    const fullname = cs.user.fullname;
    const email = cs.user.email;

    const res = await fetch(API_URL + "/update-user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, fullname, password }),
    });
    const data = await res.json();
    console.log("Data del update user", data);
  },
  async createPet(cb?) {
    const cs = this.getState();
    const res = await fetch(API_URL + "/pet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer" + " " + cs.user.token.token,
      },
      body: JSON.stringify({
        petName: cs.pet.petName,
        latitude: cs.pet.lat,
        length: cs.pet.lng,
        imgURL: cs.pet.img,
        userId: cs.user.userId,
      }),
    });
    console.log(res);

    const data = await res.json();
    console.log(data);

    cs.user.pets.push(data.id);
    this.setState(cs);
    if (cb) {
      cb();
    }
  },
  async updatePet(cb?) {
    const cs = this.getState();
    const res = await fetch(API_URL + "/pet/" + cs.wantToModify, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer" + " " + cs.user.token.token,
      },
      body: JSON.stringify({
        petName: cs.pet.petName,
        latitude: cs.pet.lat,
        length: cs.pet.lng,
        imgURL: cs.pet.img,
      }),
    });
    console.log(res);
    const data = await res.json();
    console.log("DATA", data);
    if (cb) {
      cb();
    }
  },
  cardCustomizer(data, element) {
    console.log("data del card customizer", data);

    const div = document.createElement("div");
    div.className = "pet-content-container";
    div.innerHTML = ` 
      <img class="pet-img" src=${data.imgURL}>
      <div class="content-container">
        <div class="pet-text">
          <h4 class="pet-name">${data.petName}</h4>
        </div>
        <div class="nav-container">
          <a class="link">REPORTAR INFORMACIÓN</a>
        </div>
      </div>
    `;
    const cs = this.getState();
    const imgEl = div.querySelector(".pet-img");
    const linkEl = div.querySelector(".link");
    linkEl.addEventListener("click", () => {
      console.log(data);
      cs.wantToReportInfo = data.objectID;
      cs.petName = data.petName;
      cs.reportClick = "true";
      state.setState(cs);
      console.log("soy el cs despues de clickear", cs);
    });
    const style = document.createElement("style");
    style.innerHTML = `
      p,a,h4{
        font-family: "Rowdies", cursive;
      }
      .pet-content-container{
        border : solid 4px;
        border-radius : 4px;
        margin-bottom: 40px;
      }
      .pet-img{
        width : 100%;
        max-height : 200px;
        display: block;
      }
      .content-container{
        display :flex;
        justify-content:space-between;
        background-color : antiquewhite;
      }
      .pet-text{
        margin-left :5px;
        margin-top:10px;
      }
      .pet-name{
        padding : 0 ;
        margin:0;
        font-size :20px;
      }
      @media(min-width:735px){
        .pet-name{
          font-size:16px;
          padding  : 10px;
        }
      }
      .nav-container{
        display: flex;
        flex-direction: column;
        justify-content: end;
        margin : 5px 5px 20px 0
      }
      .link{
        display:block;
        font-size : 12px;
      }
      @media(min-width:735px){
        .link{
          padding :10px;
          margin-top : 10px;
        }
      }
    `;
    div.appendChild(style);
    element.appendChild(div);
  },
  async addCard(element?, cb?) {
    const res = await fetch(API_URL + "/nearby-missed-pets");
    const data = await res.json();
    for (const e of data) {
      this.cardCustomizer(e, element);
    }
    if (cb) {
      cb();
    }
  },
  async addMyPetCard(element?) {
    const cs = this.getState();
    const res = await fetch(API_URL + "/user-pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: cs.user.userId }),
    });
    const data = await res.json();
    for (const pet of data) {
      this.myPetsCard(pet, element);
    }
  },
  myPetsCard(data, element) {
    console.log("data que llega a mypetscard", data);

    const div = document.createElement("div");
    div.className = "pet-content-container";
    div.innerHTML = ` 
      <img class="pet-img" src=${data.imgURL}>
      <div class="content-container">
        <div class="pet-text">
          <h4 class="pet-name">${data.petName}</h4>
        </div>
        <div class="nav-container">
          <a class="link">Actualizar</a>
        </div>
      </div>
    `;
    const cs = this.getState();
    const imgEl = div.querySelector(".pet-img");

    const linkEl = div.querySelector(".link");
    linkEl.addEventListener("click", (e) => {
      cs.petName = data.petName;
      cs.wantToModify = data.id;
      console.log(data);

      cs.updateClick = true;
      state.setState(cs);
      Router.go("/report-pet");
    });
    const style = document.createElement("style");
    style.innerHTML = `
      p,a,h4{
        font-family: "Rowdies", cursive;
      }
      .pet-content-container{
        border : solid 4px;
        border-radius : 4px;
        margin-bottom: 40px;
      }
      .pet-img{
        width : 100%;
        max-height : 200px;
        display: block;
      }
      .content-container{
        display :flex;
        justify-content:space-between;
        background-color : antiquewhite;
      }
      .pet-text{
        margin-left :5px;
        margin-top:10px;
      }
      .pet-name{
        padding : 0 ;
        margin:0;
        font-size :20px;
      }
      @media(min-width:735px){
        .pet-name{
          font-size:16px;
          padding  : 10px;
        }
      }
      .nav-container{
        display: flex;
        flex-direction: column;
        justify-content: end;
        margin : 5px 5px 20px 0
      }
      .link{
        display:block;
        font-size : 12px;
      }
      @media(min-width:735px){
        .link{
          padding :10px;
          margin-top : 10px;
        }
      }
    `;
    div.appendChild(style);
    element.appendChild(div);
  },
};

export { state };
