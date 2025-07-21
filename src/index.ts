//Páginas / vistas
import "./pages/welcome";
import "./pages/setname";
import "./pages/entercode";
import "./pages/access-error";
import "./pages/share-room-code";
import "./pages/instructions";
import "./pages/waiting-opponent";
import "./pages/play";
import "./pages/moves";
import "./pages/result";

//Router
import { Router } from "@vaadin/router";

const router = new Router(document.getElementById("app"));

router.setRoutes([
  { path: "/", component: "welcome-page" },
  { path: "/setname", component: "set-name" },
  { path: "/entercode", component: "enter-code" },
  { path: "/accesserror", component: "access-error" },
  { path: "/shareroomcode", component: "share-room-code" },
  { path: "/instructions", component: "instructions-page" },
  { path: "/waitingopponent", component: "waiting-opponent" },
  { path: "/play", component: "play-page" },
  { path: "/moves", component: "moves-page" },
  { path: "/result", component: "result-page" },
  { path: "(.*)", redirect: "/" },
]);
