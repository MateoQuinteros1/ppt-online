import { Router } from "@vaadin/router";
import { rtdb } from "./firebase/db";
import { get, off, onValue, ref } from "firebase/database";

type appState = {
  newRoom: boolean;
  findRoom: number;
  roomShortId: number;
  rtdbRoomId: string;
  userName: string;
  opponentName: string;
  score: Record<string, number>;
  userChoice: string;
  opponentChoice: string;
  result: string;
};

const domain = "http://localhost:3000";

export const state = {
  data: {
    newRoom: false,
    findRoom: 0,
    roomShortId: 0,
    rtdbRoomId: "",
    userName: "",
    opponentName: "",
    score: {},
    userChoice: "none",
    opponentChoice: "none",
    result: "",
  } as appState,
  listeners: [] as Array<() => void>,
  callListeners() {
    for (const cb of this.listeners) {
      cb();
    }
  },
  getState() {
    return this.data;
  },
  setState(newState: any) {
    this.data = newState;
    this.callListeners();
  },
  subscribe(cb: () => void) {
    this.listeners.push(cb);
  },
  resolveRoom() {
    const endPoint = `${domain}/rooms`;
    const currentState = this.getState();

    //Información que viajará en el cuerpo de la request HTTP
    const requestData = JSON.stringify({
      newRoom: currentState.newRoom,
      userName: currentState.userName,
      roomShortId: currentState.findRoom,
    });

    fetch(endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestData,
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        const access = json.access;

        if (access != true) {
          Router.go("/accesserror");
          return;
        } else {
          //Guardamos data en el estado
          currentState.rtdbRoomId = json.data.rtdbRoomId;
          currentState.roomShortId = json.fsRoomId;
          currentState.score = json.data.score;

          /* Si la sala tiene solo 1 jugador, redirecciona al usuario a la interfaz para compartir el
          código de la sala */
          const players = json.data.players;

          if (players.length < 2) {
            Router.go("/shareroomcode");
            this.waitForOpponent();
            return;
          }

          //Si la sala tiene mas de 1  jugador, se busca el nombre del oponente y se guarda en el estado
          players.forEach((playerName: string) => {
            if (playerName !== currentState.userName) {
              currentState.opponentName = playerName;
            }
          });
          Router.go("/instructions");
        }
      });
  },
  waitForOpponent() {
    const currentState = this.getState();
    const roomRef = ref(rtdb, `/rooms/${currentState.rtdbRoomId}/currentGame`);

    onValue(roomRef, (snapshot) => {
      const players = snapshot.val();
      const playersList = Object.keys(players);
      if (players && playersList.length === 2) {
        playersList.forEach((playerName: string) => {
          if (playerName !== currentState.userName) {
            currentState.opponentName = playerName;
            currentState.score[playerName] = 0;
            Router.go("/instructions");
          }
        });
      }
    });
  },
  setUserReady(start: boolean) {
    const currentState = this.getState();
    fetch(
      `${domain}/users/start?userName=${currentState.userName}&rtdbRoomId=${currentState.rtdbRoomId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ start }),
      }
    ).then((res) => {
      //Si todo sale bien, se ejecuta la lógica
      if (res.status === 200) {
        this.waitForOpponentStart();
      }
    });
  },
  waitForOpponentStart() {
    const currentState = this.getState();
    const roomRef = ref(rtdb, `/rooms/${currentState.rtdbRoomId}/currentGame`);
    const validPath =
      window.location.pathname === "/instructions" ||
      window.location.pathname === "/waitingopponent";

    onValue(roomRef, (snapshot) => {
      const roomData = snapshot.val();
      if (roomData[currentState.opponentName].start === true && validPath) {
        console.log("Se ejecutó la funcion");
        Router.go("/play");
        off(roomRef);
      } else if (
        window.location.pathname === "/instructions" &&
        roomData[currentState.userName].start === true
      ) {
        Router.go("/waitingopponent");
      }
    });
  },
  setChoices() {
    const currentState = this.getState();

    fetch(
      `${domain}/match?userName=${currentState.userName}&rtdbRoomId=${currentState.rtdbRoomId}&choice=${currentState.userChoice}`,
      {
        method: "POST",
      }
    ).then(() => {
      const roomRef = ref(
        rtdb,
        `/rooms/${currentState.rtdbRoomId}/currentGame/${currentState.opponentName}`
      );
      /* Ralentizo un poco la función de obtener datos de la rtdb, ya que si se intenta hacer instantáneamente
      a veces los datos no llegan a actualizarse y puede fallar */
      setTimeout(() => {
        get(roomRef).then((snapshot) => {
          const opponentData = snapshot.val();
          const opponentChoice = opponentData.choice;
          this.data.opponentChoice = opponentChoice;
          Router.go("/moves");
          console.log(this.data);
        });
      }, 2000);
    });
  },
  whoWins() {
    const currentState = this.getState();
    const userWins = [
      currentState.userChoice === "piedra" &&
        currentState.opponentChoice === "tijeras",
      currentState.userChoice === "papel" &&
        currentState.opponentChoice === "piedra",
      currentState.userChoice === "tijeras" &&
        currentState.opponentChoice === "papel",
      currentState.userChoice === "piedra" &&
        currentState.opponentChoice === "none",
      currentState.userChoice === "papel" &&
        currentState.opponentChoice === "none",
      currentState.userChoice === "tijeras" &&
        currentState.opponentChoice === "none",
    ];
    const opponentWins = [
      currentState.userChoice === "papel" &&
        currentState.opponentChoice === "tijeras",
      currentState.userChoice === "tijeras" &&
        currentState.opponentChoice === "piedra",
      currentState.userChoice === "piedra" &&
        currentState.opponentChoice === "papel",
      currentState.userChoice === "none" &&
        currentState.opponentChoice === "piedra",
      currentState.userChoice === "none" &&
        currentState.opponentChoice === "papel",
      currentState.userChoice === "none" &&
        currentState.opponentChoice === "tijeras",
    ];
    const draw = [
      currentState.userChoice === "papel" &&
        currentState.opponentChoice === "papel",
      currentState.userChoice === "piedra" &&
        currentState.opponentChoice === "piedra",
      currentState.userChoice === "tijeras" &&
        currentState.opponentChoice === "tijeras",
      currentState.userChoice === "none" &&
        currentState.opponentChoice === "none",
    ];

    for (const m of userWins) {
      if (m === true) {
        this.data.result = "winner";
        this.data.score[currentState.userName]++;
        this.saveDataOnFs();
        Router.go("/result");
      }
    }
    for (const m of opponentWins) {
      if (m === true) {
        this.data.result = "loser";
        this.data.score[currentState.opponentName]++;
        this.saveDataOnFs();
        Router.go("/result");
      }
    }
    for (const m of draw) {
      if (m === true) {
        this.data.result = "draw";
        Router.go("/result");
      }
    }
  },
  saveDataOnFs() {
    const currentState = this.getState();
    fetch(`${domain}/rooms/${currentState.roomShortId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentState.score),
    });
  },
};
