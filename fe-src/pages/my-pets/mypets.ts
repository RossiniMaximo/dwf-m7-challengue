import { state } from "../../state";
class MyPets extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
    const cs = state.getState();
    cs.pagesListeners.myPetsPage = false;
    state.setState(cs);
    this.addCards();
  }
  addCards() {
    const container = this.querySelector(".card-container");
    state.addMyPetCard(container);
  }
  render() {
    const div = document.createElement("div");
    div.innerHTML = `
        <my-header></my-header>
        <h2 class="mypets__title">Mis mascotas reportadas</h2>
        <div class="card-container"></div>
      `;
    const style = document.createElement("style");
    style.innerHTML = `
        .mypets__title{
            font-size : 35px;
            text-align :center;
            font-family: "Rowdies", cursive;
        }
    `;
    div.appendChild(style);
    this.appendChild(div);
  }
}
customElements.define("my-reports", MyPets);
