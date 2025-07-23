import { Router } from "express";

//Bases de datos
import { rtdb } from "../firebase/db";
import { firestore } from "../firebase/db";

//Generador de IDs largas
import { nanoid } from "nanoid";
import { FieldValue } from "firebase-admin/firestore";

export const router = Router();

const roomsCollection = firestore.collection("rooms");

router.post("/rooms", async (req, res) => {
  const { newRoom, userName, roomShortId } = req.body;

  if (newRoom === true) {
    //Lógica si el usuario crea una nueva sala
    const rtdbRoomRef = rtdb.ref(`/rooms/${nanoid()}`);
    rtdbRoomRef
      .set({
        currentGame: {
          [userName]: {
            online: true,
            start: false,
            choice: "none",
          },
        },
      })
      .then(() => {
        const rtdbRoomId = rtdbRoomRef.key;
        const fsRoomId = Math.floor(100000 + Math.random() * 900000);

        roomsCollection
          .doc(fsRoomId.toString())
          .set({
            rtdbRoomId,
            players: [userName],
            score: { [userName]: 0 },
          })
          .then(async () => {
            const fsRoom = await roomsCollection.doc(fsRoomId.toString()).get();
            res.json({
              message: "Room created successfully",
              data: fsRoom.data(),
              fsRoomId,
              access: true,
            });
          });
      });
    //Lógica si la sala ya existe
  } else if (newRoom === false) {
    const fsRoom = await roomsCollection.doc(JSON.stringify(roomShortId)).get();
    //Verificar primero si la sala existe
    if (fsRoom.exists) {
      const roomData = fsRoom.data();
      if (roomData) {
        const roomPlayers = roomData.players;
        /* Verificar si la sala ya esta llena(2 jugadores), en ese caso se chequea si el nombre recibido
        está en la lista de jugadores de esta sala */
        if (roomPlayers.length === 2) {
          if (roomPlayers.includes(userName)) {
            res.json({
              message: "User joined successfully",
              access: true,
              fsRoomId: roomShortId,
              data: roomData,
            });
          } else {
            res.status(403).json({
              message: "Access denied",
              access: false,
            });
          }
        } else {
          if (roomPlayers.includes(userName)) {
            res.json({
              message: "User joined successfully",
              access: true,
              fsRoomId: roomShortId,
              data: roomData,
            });
          } else {
            const roomRef = await roomsCollection.doc(
              JSON.stringify(roomShortId)
            );
            //Se actualiza la información de la sala en ambas bases de datos
            roomRef
              .update({
                players: FieldValue.arrayUnion(userName),
                [`score.${userName}`]: 0,
              })
              .then(async () => {
                const roomInfo = await roomRef.get();
                const data = roomInfo.data();
                if (data) {
                  const existentRtdbRoomRef = rtdb.ref(
                    `/rooms/${data.rtdbRoomId}/currentGame/${userName}`
                  );
                  const playerData = {
                    choice: "none",
                    online: true,
                    start: false,
                  };
                  existentRtdbRoomRef.set(playerData).then(() => {
                    res.json({
                      message: "User joined successfully",
                      access: true,
                      fsRoomId: roomShortId,
                      data: roomInfo.data(),
                    });
                  });
                }
              });
          }
        }
      }
      //En caso de que no exista una sala con el código recibido
    } else {
      res.sendStatus(404);
    }
  }
});

router.put("/rooms/:roomId", (req, res) => {
  const fsRoomId = req.params.roomId;
  const reqBody = req.body;
  const roomRef = roomsCollection
    .doc(fsRoomId)
    .update({
      score: req.body,
    })
    .then(() => {
      res.sendStatus(200);
    });
});
