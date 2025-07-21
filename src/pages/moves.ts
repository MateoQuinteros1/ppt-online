import { state } from "../client/state";
class Moves extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  opponentMove: string = "";
  yourMove: string = "";
  constructor() {
    super();
    this.syncWithState();
  }

  syncWithState() {
    const currentState = state.getState();
    this.opponentMove = currentState.opponentChoice;
    this.yourMove = currentState.userChoice;
    this.render();
  }
  render() {
    this.shadowDom.innerHTML = `
          <section class="moves">
        <img class="opponent-move" src="/${this.opponentMove}-svg.svg" />
        <img class="your-move" src="/${this.yourMove}-svg.svg" />
      </section>
      <style>
      *{
      box-sizing:border-box;
      }
      .moves {
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
@keyframes revealFromBottom {
  0% {
    clip-path: inset(100% 0 0 0); /* Oculto completamente desde abajo */
    opacity: 0;
  }
  100% {
    clip-path: inset(0 0 0 0); /* Totalmente visible */
    opacity: 1;
  }
}
@keyframes revealFromTopToBottom {
  0% {
    clip-path: inset(100% 0 0 0); /* Oculto desde arriba */
    opacity: 0;
  }
  100% {
    clip-path: inset(0 0 0 0); /* Totalmente visible */
    opacity: 1;
  }
}
.opponent-move {
  transform: rotate(180deg);
  height: 300px;
  animation: revealFromTopToBottom 1.2s ease-out forwards;
}

.your-move {
  height: 300px;
  animation: revealFromBottom 1.2s ease-out forwards;
}

@media (min-width: 768px) {
  .opponent-move {
    height: 450px;
  }
  .your-move {
    height: 450px;
  }
}
</style>
      `;

    setTimeout(() => {
      state.whoWins();
    }, 2000);
  }
}
customElements.define("moves-page", Moves);
