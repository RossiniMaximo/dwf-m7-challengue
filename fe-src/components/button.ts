class Button extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  render() {
    this.shadow.innerHTML = `
        <div class="button-container">
        <button class="button" id="button"></button>
        </div>
        `;
    const buttonEl = this.shadow.querySelector(".button");
    buttonEl.textContent = this.textContent;
    const buttonById = this.shadow.getElementById("button");
    buttonById.style.backgroundColor = this.style.backgroundColor;
    const style = document.createElement("style");
    style.innerHTML = `
        .button-container{
            width : 200px;
        }
        .button{
           background-color : antiquewhite;
            width :100%;
            height : 40px;
            font-size:16px;
            border : none;
            border-radius : 2px;
            font-family: "Rowdies", cursive;
        }
    `;
    this.shadow.appendChild(style);
  }
}
customElements.define("my-button", Button);
