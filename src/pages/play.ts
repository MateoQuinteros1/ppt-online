import { state } from "../client/state";

class Play extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  choice: string = "none";
  constructor() {
    super();
    this.render();
  }

  render() {
    this.shadowDom.innerHTML = `
          <section class="play">
        <div class="counter"></div>
        <div class="hands-container">
          <img class="hand" src="/tijeras-svg.svg" alt="tijeras" />
          <img class="hand" src="/piedra-svg.svg" alt="piedra" />
          <img class="hand" src="/papel-svg.svg" alt="papel" />
        </div>
      </section>
      <style>
        * {
          box-sizing: border-box;
        }
        .play {
          width: 100%;
          height: 100vh;
          background-image: url(/ppt-fondo.svg);
          background-size: 450px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 26px;
          justify-content: space-between;
          overflow-y: hidden;
          overflow-x: hidden;
        }

        .counter {
          height: 260px;
          width: 260px;
          border: 20px solid;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: "DynaPuff";
          font-size: 130px;
          font-weight: 500;
          margin-top: 140px;
        }

        .hands-container {
          display: flex;
          gap: 27px;
          align-items:end;
        }

        .hand {
          height: 170px;
        }

        .hand:hover {
          cursor: pointer;
          transform: rotate(-10deg);
        }

        @media (min-width: 768px) {
          .counter {
            height: 350px;
            width: 350px;
            font-size: 200px;
            border: 30px solid;
          }
          .hands-container {
            gap: 105px;
          }
          .hand {
            height: 300px;
          }
        }
      </style>`;

    setTimeout(() => {
      state.setUserReady(false);
    }, 1500);
    //Obtenemos de el HTML de la página los elementos que representan a las manos(elecciones)
    const getHandsImgs = this.shadowDom.querySelectorAll(".hand");

    /* Le aplicamos a todos un escuchador de eventos del tipo "click", que llama a la función
    del state encargada de hacer una petición HTTP a la API para que inserte en la base de datos
    la elección del jugador.
    
    También aplica estilos a las otras manos(las que no se clickearon) para dar una sensación de que ya no 
    pueden ser usadas, y retira todos los escuchadores de eventos */
    getHandsImgs.forEach((img) => {
      img.addEventListener("click", () => {
        const eleccion = img.getAttribute("alt") as string;
        this.choice = eleccion;
        getHandsImgs.forEach((handimg) => {
          const handEl = handimg as HTMLElement;
          handEl.style.pointerEvents = "none"; //Eliminación de event listeners
          //Estilos para las otras manos(las que no se clickearon)
          if (handimg.getAttribute("alt") != eleccion) {
            const handHeight = handimg.clientHeight;
            handEl.style.opacity = "0.5"; //Transparencia de la imagen
            handEl.style.height = handHeight / 2 + "px"; //La mitad de su altura
          }
        });
      });
    });

    //Contador
    const counterContainerEl = this.shadowDom.querySelector(
      ".counter"
    ) as HTMLElement;
    let counter = 10;
    counterContainerEl.textContent = JSON.stringify(counter);

    const intervalo = setInterval(() => {
      counter--;
      counterContainerEl.innerText = JSON.stringify(counter);
      /*Lógica encargada de darle vida al contador, luego de pasado los 10 segundos, el usuario no podrá
    elegir opciones, y perderá la ronda(a menos que la otra persona tampoco elija una opción)*/
      if (counter < 0) {
        clearInterval(intervalo);
        //Envia información al estado y llama a una de sus funciones que manejará la información para determinar el ganador
        state.data.userChoice = this.choice;
        state.setChoices();

        getHandsImgs.forEach((imagenmano) => {
          const imagenManoTipada = imagenmano as HTMLElement;
          imagenManoTipada.style.pointerEvents = "none";
        });
        /*Se agrega un gif "loading" para que el contador no quede simplemente en 0 y
        el usuario sepa que algo está pasando*/
        counterContainerEl.innerHTML = `<img src="/loading-gif-black.gif"></img>`;
      }
    }, 1000);
  }
}

customElements.define("play-page", Play);
