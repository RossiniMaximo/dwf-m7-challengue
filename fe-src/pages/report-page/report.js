import { state } from "../../state";

const img = require("../../imgs/background_imgs/7.jpg");
class ReportPage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
    this.mapBox();
    const cs = state.getState();
    cs.pagesListeners.reportPage = false;
    let pictureFile;
    const imgEl = document.querySelector(".img-pet");
    imgEl.addEventListener("click", () => {
      imgEl.textContent = "";
    });
    const myDropZone = new Dropzone(imgEl, {
      url: "/",
      clickable: true,
      autoProcessQueue: false,
    });
    myDropZone.on("addedfile", function (file) {
      pictureFile = file;
    });
    this.deletePetIcon();
    const formEl = document.querySelector(".form");
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = e.target.nombre.value;
      cs.pet.petName = name;
      cs.pet.img = pictureFile.dataURL;
      state.setState(cs);
      this.uploadListener();
      cs.updateClick = false;
    });
  }
  uploadListener() {
    const textEl = document.querySelector(".text");
    const cs = state.getState();
    if (cs.updateClick == false) {
      return state.createPet(() => {
        textEl.textContent = "Mascota reportada!";
      });
    } else {
      state.updatePet(() => {
        textEl.textContent = "Mascota actualizada!";
      });
    }
  }
  deletePetIcon() {
    console.log("entre al deletepeticon");
    const cs = state.getState();
    const div = document.createElement("div");
    div.innerHTML = `
      <p class="delete-pet">Eliminar</p>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
    .delete-pet{
      font-size : 16px;
      font-family : "Rowdies", cursive;
      background-color: lightblue;
      padding : 10px;
      max-width : 100px;
      margin : 0 auto;
      margin-top : 20px;
      border : solid 2px;
    }
    `;
    div.addEventListener("click", () => {
      state.deletePet();
    });
    div.appendChild(style);
    if (cs.updateClick == true) {
      this.appendChild(div);
    }
  }
  render() {
    const form = document.createElement("form");
    form.className = "form";
    form.innerHTML = `
        <my-header></my-header>
        <h2 class="report-page__title">Reportar Mascota Perdida</h2>
        <div class="input-container">
        <p class="pet-name-label">Nombre</p>
        <input class="mapbox-input"name="nombre"/>
        </div>
        <div class="pet-img-container">
            <div class="img-pet">Clickee dentro del cuadrado para seleccionar imagen</div>
        </div>
        <div class="geo-container">
            <div id="map" class="map-img">
            </div>
              <div class="input-container">
              <p class="pet-name-label">Ubicación</p>
              <input class="mapbox-input"name="q" type="search"/>
              </div>
            <div class="container-text">
                <p class="text">Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</p>
            </div>
            <div class="button-container">
                <button class="button">Reportar como perdido</button>
            </div>
        </div>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
        .body{
            height : 100vh;
        }
        .report-page__title{
            font-size :35px;
            text-align:center;
        }
        .pet-name-label{
          font-family : "Rowdies", cursive;
          margin : 0;
        }
        .input-container{
            margin-top : 20px;
            padding :10px;
        }
        @media(min-width:735px){
          .input-container{
            max-width: 500px;
            margin: 0 auto;
          }
        }
        .img-pet{
            display: block;
            margin-left: auto;
            margin-right: auto;
            height :250px;
            width: 300px;
            margin-top : 20px;
            border :solid;
            font-size : 16px;
            font-family : "Rowdies",cursive;
        }
        .map-img{
            display: block;
            margin-left: auto;
            margin-right: auto;
            height :250px;
            width: 300px;
            margin-top : 20px;
            border:solid;
        }
        .button-container{
            display:flex;
            flex-direction:column;
            align-items:center; 
            margin-top : 20px;
        }
        .text{
            font-family: "Rowdies", cursive;
            text-align:center;
        }
        .pet-img-container{}
        .geo-container{}
        .mapbox-input:focus {
          outline: 0;
          outline-color: transparent;
        }
        .mapbox-input{
          width: 100%;
          padding: 10px;
          border: solid;
        }
        .mapbox-button-container{
          width : 200px;
          margin: 0 auto;
          margin-bottom : 30px;
        }
        .mapbox-button{
          width : 100%;
          padding : 10px;
          border :none;
          background-color : antiquewhite;
          font-family : "Rowdies", cursive;
          font-size : 16px;
        }
        .button{
          padding: 10px;
          background-color : antiquewhite;
          font-family : "Rowdies", cursive;
          border :none;
          font-size : 16px;
        }
    `;
    form.appendChild(style);
    this.appendChild(form);
  }
  mapBox() {
    const MAPBOX_TOKEN =
      "pk.eyJ1IjoibWF4emkiLCJhIjoiY2t5bHJqdzRpMHczNjJ2cGtzODc3cnd0eSJ9.X4K8_sRROGgfFfMlr56mDA";
    const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

    function initMap() {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      return new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
      });
    }

    function initSearchForm(callback) {
      const form = document.querySelector(".form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        mapboxClient.geocodeForward(
          e.target.q.value,
          {
            country: "ar",
            autocomplete: true,
            language: "es",
          },
          function (err, data, res) {
            // console.log(data);
            if (!err) callback(data.features);
          }
        );
      });
    }
    (function () {
      const cs = state.getState();
      window.map = initMap();
      initSearchForm(function (results) {
        const firstResult = results[0];
        cs.pet.lng = firstResult.geometry.coordinates[0];
        cs.pet.lat = firstResult.geometry.coordinates[1];
        state.setState(cs);
        const marker = new mapboxgl.Marker()
          .setLngLat(firstResult.geometry.coordinates)
          .addTo(map);
        map.setCenter(firstResult.geometry.coordinates);
        map.setZoom(14);
      });
    })();
  }
}
customElements.define("report-page", ReportPage);
