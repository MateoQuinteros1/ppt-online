import { state } from "../client/state";
import { Router } from "@vaadin/router";
class WelcomePage extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  constructor() {
    super();
    this.render();
  }
  render() {
    this.shadowDom.innerHTML = `
          <section class="welcome">
        <h1 class="welcome__title">
          Piedra Papel <span class="welcome__title-special">ó</span> Tijera
        </h1>
        <div class="buttons-container">
          <button id="new-game" class="main-button">Nuevo Juego</button>
          <button id="existent-game" class="main-button">
            Ingresar a una sala
          </button>
        </div>
         <div class="hands-container">
          <img class="hand" src="/tijeras-svg.svg" />
          <img class="hand" src="/piedra-svg.svg" />
          <img class="hand" src="/papel-svg.svg" />
        </div>
      </section>
      <style>
      * {
  box-sizing: border-box;
       }

       .welcome {
  width: 100%;
  height: 100vh;
  background-image: url(/ppt-fondo.svg);
  background-size: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 26px;
  justify-content: space-between;
}

.welcome__title {
  font-family: "DynaPuff";
  font-weight: 700;
  font-size: 75px;
  color: rgba(0, 144, 72, 1);
  margin-top: 40px;
  margin-bottom: 0px;
  max-width: 323px;
}

.welcome__title-special {
  color: rgba(145, 204, 175, 1);
}

.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-button {
  width: 322px;
  height: 87px;
  background-color: rgba(0, 108, 252, 1);
  border: 10px solid rgba(0, 25, 151, 1);
  border-radius: 10px;
  font-family: "Odibee Sans";
  color: white;
  font-weight: 400;
  font-size: 45px;
  letter-spacing: 2px;
}

.main-button:hover{
cursor:pointer;
}

.hands-container {
  display: flex;
  gap: 45px;
}
  @media (min-width: 768px) {
  .welcome {
    padding-top: 60px;
  }
  .welcome__title {
    font-size: 85px;
  }
  .buttons-container {
    gap: 39px;
  }
  .main-button {
    width: 466px;
  }
  .hands-container {
    gap: 65px;
  }
  .hand {
    height: 180px;
  }
    }
      </style>
    `;
    //Actualizar el estado y cambiar de página si se selecciona "Nuevo Juego"
    const newGameButtonEl = this.shadowDom.querySelector("#new-game");
    newGameButtonEl?.addEventListener("click", () => {
      const currentStateData = state.getState();
      currentStateData.newRoom = true;
      Router.go("/setname");
    });

    //Actualizar el estado y cambiar de página si se selecciona "Ingresar a una sala"
    const existentGameButtonEl = this.shadowDom.querySelector("#existent-game");
    existentGameButtonEl?.addEventListener("click", () => {
      const currentStateData = state.getState();
      currentStateData.newRoom = false;
      Router.go("/entercode");
    });
  }
}

customElements.define("welcome-page", WelcomePage);
