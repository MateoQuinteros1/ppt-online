class AccessError extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  constructor() {
    super();
    this.render();
  }

  render() {
    this.shadowDom.innerHTML = `
          <section class="access-error">
        <a href="javascript:history.back()">
          <img class="previous-page__img" src="/previous-page.svg" />
        </a>
        <h1 class="access-error__title">
          Piedra Papel <span class="access-error__title-special">ó</span> Tijera
        </h1>
        <p class="access-error__message">
          Ups, esta sala está completa y tu nombre no coincide con nadie en la
          sala.
        </p>
        <div class="hands-container">
          <img class="hand" src="/tijeras-svg.svg" />
          <img class="hand" src="/piedra-svg.svg" />
          <img class="hand" src="/papel-svg.svg" />
        </div>
      </section>
      <style>
      *{
      box-sizing:border-box;
      }
        .access-error {
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

        .access-error__title {
          font-family: "DynaPuff";
          font-weight: 700;
          font-size: 75px;
          color: rgba(0, 144, 72, 1);
          margin-top: 40px;
          margin-bottom: 0px;
          max-width: 323px;
        }

        .access-error__title-special {
          color: rgba(145, 204, 175, 1);
        }

        .access-error__message {
          font-family: "DynaPuff";
          font-weight: 500;
          font-size: 31px;
          text-align: center;
          color: red;
          max-width: 800px;
        }

        .hands-container {
          display: flex;
          gap: 45px;
        }

        @media (min-width: 768px) {
          .access-error {
            padding-top: 60px;
          }

          .previous-page__img {
            height: 70px;
            width: 70px;
            top: 20px;
            left: 20px;
          }
          .access-error__title {
            font-size: 85px;
          }

          .hands-container {
            gap: 65px;
          }
          .hand {
            height: 180px;
          }
          .access-error__message {
            font-size: 49px;
          }
        }
      </style>
    `;
  }
}
customElements.define("access-error", AccessError);
