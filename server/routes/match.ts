import { Router } from "express";

//Bases de datos
import { rtdb } from "../firebase/db";
import { firestore } from "../firebase/db";

export const router = Router();

router.post("/match", (req, res) => {
  const userName = req.query.userName;
  const rtdbRoomId = req.query.rtdbRoomId;
  const userChoice = req.query.choice;

  const roomRef = rtdb
    .ref(`/rooms/${rtdbRoomId}/currentGame/${userName}`)
    .update({
      choice: userChoice,
    })
    .then(() => {
      res.sendStatus(200);
    });
});
