import { state } from "../client/state";

class SetName extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  constructor() {
    super();
    this.render();
  }

  render() {
    this.shadowDom.innerHTML = `
          <section class="set-name">
      <a href="javascript:history.back()">
          <img class="previous-page__img" src="/previous-page.svg" />
        </a>
        <h1 class="set-name__title">
          Piedra Papel <span class="set-name__title-special">ó</span> Tijera
        </h1>
        <form class="set-name__form">
          <input placeholder="Tu nombre" class="input" type="text" />
          <button class="main-button">Empezar</button>
        </form>
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
        .set-name {
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
          .previous-page__img {
          height: 40px;
          width: 40px;
          position: absolute;
          left: 10px;
          top: 10px;
        }

        .set-name__title {
          font-family: "DynaPuff";
          font-weight: 700;
          font-size: 75px;
          color: rgba(0, 144, 72, 1);
          margin-top: 40px;
          margin-bottom: 0px;
          max-width: 323px;
        }

        .set-name__title-special {
          color: rgba(145, 204, 175, 1);
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

        .set-name__form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input {
          width: 322px;
          height: 87px;
          border: 10px solid rgba(24, 36, 96, 1);
          border-radius: 10px;
          padding: 0 10px;
          font-family: "Odibee Sans";
          font-weight: 600;
          font-size: 45px;
          color: black;
          text-align: center;
        }

        .input::placeholder {
          color: rgba(217, 217, 217, 1);
          letter-spacing: 4px;
          text-align: center;
        }

        @media (min-width: 768px) {
          .set-name {
            padding-top: 60px;
          }
            .previous-page__img {
            height: 70px;
            width: 70px;
            top: 20px;
            left: 20px;
          }
          .set-name__title {
            font-size: 85px;
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

          .input {
            width: 466px;
          }
        }
      </style>
    `;
    const setNameFormEl = this.shadowDom.querySelector(".set-name__form");
    const nameInputEl = this.shadowDom.querySelector(
      ".input"
    ) as HTMLInputElement;

    /* Chequea que el nombre sea válido, actualiza el estado, y llama a la función encargada del
    state encargada de conectar con la sala */
    setNameFormEl?.addEventListener("submit", (ev) => {
      ev.preventDefault();

      const inputValue = nameInputEl.value.trim();

      const isOnlyNumbers = /^\d+$/.test(inputValue);
      const isTooShort = inputValue.length < 4;
      const isTooLong = inputValue.length > 12;

      if (inputValue === "") {
        alert("Por favor, ingresa un nombre");
        return;
      }

      if (isOnlyNumbers) {
        alert("El nombre no puede contener solo números");
        return;
      }

      if (isTooShort) {
        alert("El nombre debe contener al menos 4 caracteres");
        return;
      }

      if (isTooLong) {
        alert("El nombre debe contener 12 o menos caracteres");
        return;
      }

      const currentState = state.getState();
      currentState.userName = inputValue;
      state.resolveRoom();
    });
  }
}

customElements.define("set-name", SetName);
