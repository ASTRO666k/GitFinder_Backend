
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./server";

dotenv.config({ path: ".env" });

const serverPort = process.env.PORT || 3000;

const dbConnectionString = process.env.DB_CONNECTION;



if (!dbConnectionString) {
  console.error("No se reconoce la cadena de conexión a la base de datos.");
} else {
  mongoose
    .connect(dbConnectionString)
    .then(() => {
      console.log("Conectado a la base de datos");
    })
    .catch((error) => {
      console.error("Error al conectar a la base de datos: ", error);
    });
}


app.listen(serverPort, () => {
  console.log(`Escuchando a puerto ${serverPort}`);
});