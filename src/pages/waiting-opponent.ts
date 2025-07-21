import { state } from "../client/state";
class WaitingOpponent extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  yourName: string = "";
  opponentName: string = "";
  yourScore: number = 0;
  opponentScore: number = 0;
  roomId: number = 0;
  constructor() {
    super();
    this.syncWithState();
  }
  syncWithState() {
    const currentState = state.getState();
    const players = {
      player1: {
        name: currentState.userName,
        score: currentState.score[currentState.userName],
      },
      player2: {
        name: currentState.opponentName,
        score: currentState.score[currentState.opponentName],
      },
    };
    this.yourName = players.player1.name;
    this.opponentName = players.player2.name;
    this.yourScore = players.player1.score;
    this.opponentScore = players.player2.score;
    this.roomId = currentState.roomShortId;
    this.render();
  }
  render() {
    this.shadowDom.innerHTML = `
          <section class="waiting-opponent">
        <div class="room-info-container">
          <div class="players-cont">
            <h2 class="your-name">${this.yourName}: ${this.yourScore}</h2>
            <h2 class="opponent-name">${this.opponentName}: ${this.opponentScore}</h2>
          </div>
          <div class="room-code-cont">
            <h2 class="room-code">
              Sala <br /><span class="code">${this.roomId}</span>
            </h2>
          </div>
        </div>
        <h1 class="waiting-opponent__title">
          Esperando a que <span id="op-name__title">${this.opponentName}</span> presione
          ¡Jugar!...
        </h1>
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
        .waiting-opponent {
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

        .room-info-container {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .players-cont {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .your-name {
          font-family: "DynaPuff";
          font-weight: 500;
          font-size: 24px;
          margin-bottom: 0;
        }

        .opponent-name {
          font-family: "DynaPuff";
          font-weight: 500;
          font-size: 24px;
          margin-top: 0;
          color: red;
        }

        .room-code {
          font-family: "DynaPuff";
          font-weight: 700;
          font-size: 24px;
        }

        .code {
          font-weight: 100;
          color: #585652;
        }

        .waiting-opponent__title {
          text-align: center;
          font-family: "DynaPuff";
          font-size: 38px;
          font-weight: 400;
          max-width: 430px;
        }
        #op-name__title {
          font-weight: 800;
          color: red;
        }

        .hands-container {
          display: flex;
          gap: 45px;
        }

        @media (min-width: 768px) {
          .waiting-opponent {
            padding-top: 60px;
          }
          .room-info-container {
            padding: 0 60px;
          }
          .your-name {
            font-size: 30px;
          }
          .opponent-name {
            font-size: 30px;
          }
          .room-code {
            font-size: 30px;
          }

          .waiting-opponent__title {
            font-size: 51px;
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
  }
}

customElements.define("waiting-opponent", WaitingOpponent);
