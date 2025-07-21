import express from "express";
import cors from "cors";

//Rutas
import { router as authRoutes } from "./routes/users";
import { router as roomsRoutes } from "./routes/rooms";
import { router as matchRoutes } from "./routes/match";

//Permitir la creación de rutas absolutas
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//App
const app = express();

//Settings
app.set("PORT", 3000);

//Middlewares
app.use(cors());
app.use(express.json());

//Uso de Rutas
app.use(authRoutes);
app.use(roomsRoutes);
app.use(matchRoutes);

////Permitir servir archivos estáticos(index.html en este caso), se encuentra dentro de la carpeta "dist"
app.use(express.static("dist"));

//Capturación de rutas inexistentes y redirección hacia la home
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.listen(app.get("PORT"), () => {
  console.log(`Servidor corriendo en el puerto ${app.get("PORT")}`);
});
