import { Router } from "express";

//Bases de datos
import { rtdb } from "../firebase/db";
import { firestore } from "../firebase/db";

export const router = Router();

router.patch("/users/start", (req, res) => {
  const userName = req.query.userName;
  const rtdbRoomId = req.query.rtdbRoomId;
  const { start } = req.body;

  const rtdbRoomRef = rtdb.ref(`/rooms/${rtdbRoomId}/currentGame/${userName}`);

  rtdbRoomRef.update({ start }).then(() => {
    res.sendStatus(200);
  });
});
