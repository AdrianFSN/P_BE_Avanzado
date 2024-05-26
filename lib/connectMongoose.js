const mongoose = require("mongoose");

mongoose.connection.on("error", (err) => {
  console.log("Error de conexión:", err);
});

mongoose.connection.once("open", () => {
  console.log("Conectado a MongoDB en", mongoose.connection.name);
});

mongoose.connect(process.env.MONGODB_URL); // Crear la conexión a la BD de la práctica

module.exports = mongoose.connection;
