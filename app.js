import express from "express";
import productsRouter from "./src/routes/products.router.js";

const app = express();
const PORT = 8080;

// middleware para leer JSON
app.use(express.json());

// rutas
app.use("/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});







