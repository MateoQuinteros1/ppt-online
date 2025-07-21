import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS as string);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ppt-online-3e37f-default-rtdb.firebaseio.com",
});

export const rtdb = admin.database();
export const firestore = admin.firestore();
