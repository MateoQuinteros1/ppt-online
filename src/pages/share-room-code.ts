import { state } from "../client/state";

class ShareRoomCode extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  yourName: string = "";
  opponentName: string = "";
  yourScore: number = 0;
  opponentScore: number = 0;
  roomId: number = 0;
  constructor() {
    super();
    this.syncWithState();
    state.subscribe(() => {
      this.syncWithState();
    });
  }

  syncWithState() {
    const currentState = state.getState();
    const players = {
      player1: {
        name: currentState.userName,
        score: currentState.score[currentState.userName],
      },
      player2: {
        name: currentState.opponentName || "Oponente",
        score: currentState.score[currentState.opponentName] || 0,
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
          <section class="share-room-code">
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
        <h1 class="share-room__title">
          Compartí el código: <br />
          <span class="title__code">${this.roomId}</span> <br />
          con tu contrincante
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
        .share-room-code {
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

        .share-room__title {
          text-align: center;
          font-family: "DynaPuff";
          font-weight: 400;
          font-size: 31px;
        }

        .title__code {
          font-weight: 700;
          font-size: 45px;
          color: #009048;
        }
        .hands-container {
          display: flex;
          gap: 45px;
        }

        @media (min-width: 768px) {
          .enter-code {
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
          .share-room__title {
            font-size: 47px;
          }
          .title__code {
            font-size: 62px;
          }
          .hands-container {
            gap: 65px;
          }
          .hand {
            height: 180px;
          }
        }
      </style>`;
  }
}

customElements.define("share-room-code", ShareRoomCode);
