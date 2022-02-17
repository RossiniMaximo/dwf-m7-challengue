class Input extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
    const label = this.shadow.querySelector(".label");
    label.textContent = this.textContent;
  }
  render() {
    const div = document.createElement("div");
    div.classList.add("root");
    div.innerHTML = `
        <label class="label">
        </label>
        <input type="text" class="input" />
      `;

    const style = document.createElement("style");
    style.innerHTML = `
        .root{
            display:flex;
            flex-direction:column;
        }
        
        .label{
            font-family: "Rowdies", cursive;
            font-size: 18px;
        }
        .input:focus {
          outline: 0;
          outline-color: transparent;
          outline-style: none;
        }
        .input{
            max-width:300px;
            padding : 10px;
            margin-top :5px;
            border : solid 2px;
        }

    `;
    div.appendChild(style);
    this.shadow.appendChild(div);
  }
}
customElements.define("my-input-el", Input);
