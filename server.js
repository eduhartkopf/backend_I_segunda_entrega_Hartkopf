// server.js - productos en memoria, lista completa al iniciar
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.static("public"));

// ---------------------- RUTAS ----------------------
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "." });
});

// ---------------------- PRODUCTOS EN MEMORIA ----------------------
let products = [
  { id: 1, title: "Producto 1", price: 100 },
  { id: 2, title: "Producto 2", price: 200 },
  { id: 3, title: "Producto 3", price: 300 },
  { id: 4, title: "Producto 4", price: 400 },
  { id: 5, title: "Producto 5", price: 500 },
  { id: 6, title: "Producto 6", price: 600 },
  { id: 7, title: "Producto 7", price: 700 },
  { id: 8, title: "Producto 8", price: 800 },
  { id: 9, title: "Producto 9", price: 900 },
  { id: 10, title: "Producto 10", price: 1000 },
  { id: 11, title: "Producto 11", price: 1100 },
  { id: 12, title: "Producto 12", price: 1200 },
];

// ---------------------- SOCKET.IO ----------------------
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Enviar lista completa de productos al conectarse
  socket.emit("products", products);

  // Crear producto
  socket.on("createProduct", (product) => {
    products.push(product);
    io.emit("products", products); // envía lista completa a todos los clientes
  });

  // Eliminar producto
  socket.on("deleteProduct", (id) => {
    products = products.filter((p) => p.id !== id);
    io.emit("products", products); // envía lista completa a todos los clientes
  });
});

// ---------------------- INICIAR SERVIDOR ----------------------
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
