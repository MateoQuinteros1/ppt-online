import { state } from "../client/state";
import { Router } from "@vaadin/router";

class EnterCode extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  constructor() {
    super();
    this.render();
  }

  render() {
    this.shadowDom.innerHTML = `
          <section class="enter-code">
        <a href="javascript:history.back()">
          <img class="previous-page__img" src="/previous-page.svg" />
        </a>
        <h1 class="enter-code__title">
          Piedra Papel <span class="access-error__title-special">ó</span> Tijera
        </h1>
        <form class="enter-code__form">
          <input placeholder="código" class="input" type="text" />
          <button class="main-button">Ingresar a la sala</button>
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
        .enter-code {
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

        .enter-code__title {
          font-family: "DynaPuff";
          font-weight: 700;
          font-size: 75px;
          color: rgba(0, 144, 72, 1);
          margin-top: 40px;
          margin-bottom: 0px;
          max-width: 323px;
        }

        .enter-code__title-special {
          color: rgba(145, 204, 175, 1);
        }
        .enter-code__form {
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
        .main-button:hover {
          cursor: pointer;
        }
        .hands-container {
          display: flex;
          gap: 45px;
        }

        @media (min-width: 768px) {
          .enter-code {
            padding-top: 60px;
          }

          .previous-page__img {
            height: 70px;
            width: 70px;
            top: 20px;
            left: 20px;
          }
          .enter-code__title {
            font-size: 85px;
          }
          .input {
            width: 466px;
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
      </style>`;

    const enterCodeForm = this.shadowDom.querySelector(".enter-code__form");
    const codeInputEl = this.shadowDom.querySelector(
      ".input"
    ) as HTMLInputElement;

    //Chequea que el código sea válido, actualiza el estado y cambia de página
    enterCodeForm?.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const inputValue = codeInputEl.value.trim();
      const isOnlyNumbers = /^\d+$/.test(inputValue);
      const isSixDigitCode = inputValue.length === 6;

      if (!isOnlyNumbers) {
        alert("El código solo debe contener números");
        return;
      }

      if (!isSixDigitCode) {
        alert("El código debe contener exactamente 6 números");
        return;
      }

      const currentState = state.getState();
      currentState.findRoom = JSON.parse(inputValue);
      Router.go("/setname");
    });
  }
}

customElements.define("enter-code", EnterCode);
