import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBULJFq-VZqzusx2vbUkmGAfm7ShravPWE",
  authDomain: "ppt-online-3e37f.firebaseapp.com",
  databaseURL: "https://ppt-online-3e37f-default-rtdb.firebaseio.com",
  projectId: "ppt-online-3e37f",
  storageBucket: "ppt-online-3e37f.firebasestorage.app",
  messagingSenderId: "918136382868",
  appId: "1:918136382868:web:a3ddb1154627a5864c9b81",
  measurementId: "G-WLSLPSG1NX",
};

const app = initializeApp(firebaseConfig);

export const rtdb = getDatabase(app);
