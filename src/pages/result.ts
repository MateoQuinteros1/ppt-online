import { Router } from "@vaadin/router";
import { state } from "../client/state";
class Result extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  yourName: string = "";
  opponentName: string = "";
  yourScore: number = 0;
  opponentScore: number = 0;
  result: string = "";
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
        name: currentState.opponentName || "Oponente",
        score: currentState.score[currentState.opponentName] || 0,
      },
    };
    this.yourName = players.player1.name;
    this.opponentName = players.player2.name;
    this.yourScore = players.player1.score;
    this.opponentScore = players.player2.score;
    this.result = currentState.result;
    this.render();
  }

  render() {
    this.shadowDom.innerHTML = `
          <section class="result">
        <img class="star" src="/${this.result}-star-img.svg" />
        <div class="scores">
          <h1 class="scores__title">Score</h1>
          <div class="scores__players">
            <p class="player">${this.yourName}: ${this.yourScore}</p>
            <p class="player">${this.opponentName}: ${this.opponentScore}</p>
          </div>
        </div>
        <button id="goToInstructions" class="main-button">Volver a jugar</button>
      </section>
      <style>
        * {
          box-sizing: border-box;
        }
        .result {
          height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 35px 0px;
          gap: 20px;
          overflow-y: hidden;
          overflow-x: hidden;
        }

        .loser{
        background-color:#894949E5;
        }

        .winner{
        background-color:#888949E5;
        }

        .draw{
        background-color:#eeb90e;
        }

        .scores {
          width: 260px;
          height: 217px;
          background-color: white;
          border: 10px solid;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-right: 10px;
          padding-bottom: 10px;
          padding-top: 5px;
        }

        .scores__title {
          font-family: "Odibee Sans";
          text-align: center;
          font-weight: 400;
          font-size: 55px;
          margin: 0;
          letter-spacing: 1.5px;
        }

        .player {
          text-align: end;
          font-family: "Odibee Sans";
          font-weight: 400;
          font-size: 45px;
          margin: 0;
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
          cursor: pointer;
        }

        @media (min-width: 768px) {
          .result {
            gap: 30px;
          }
          .star {
            height: 350px;
          }
          .scores {
            width: 360px;
            height: 317px;
            padding-bottom: 30px;
          }

          .scores__title {
            font-size: 70px;
          }
          .player {
            font-size: 60px;
          }
          .scores__players {
            margin-right: 10px;
          }

          .main-button {
            width: 486px;
            height: 95px;
            font-size: 52px;
            letter-spacing: 3px;
          }
        }
      </style>
    `;
    //Color de fondo según si el usuario ganó o perdió
    const getResultPage = this.shadowDom.querySelector(".result");
    getResultPage?.classList.add(this.result);

    const getButtonEl = this.shadowDom.querySelector("#goToInstructions");
    getButtonEl?.addEventListener("click", () => {
      Router.go("/instructions");
    });
  }
}

customElements.define("result-page", Result);
