import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";
import viewsRouter from "./src/routes/views.router.js";
import ProductManager from "./src/managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src/public")));

// handlebars
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "src/views/layouts"),
  }),
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src/views"));

// rutas
app.use("/", viewsRouter);
app.use("/products", productsRouter);
app.use("/api/carts", cartsRouter);

// 🔹 servidor HTTP
const httpServer = http.createServer(app);

// 🔹 socket.io (ACÁ se crea)
const io = new Server(httpServer);

// 🔹 managers
const productManager = new ProductManager("./src/data/products.json");

// 🔹 sockets (DESPUÉS de crear io)
io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  const products = await productManager.getProducts();
  socket.emit("products", products);

  socket.on("createProduct", async (product) => {
    await productManager.addProduct(product);
    const updatedProducts = await productManager.getProducts();
    io.emit("products", updatedProducts);
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    const updatedProducts = await productManager.getProducts();
    io.emit("products", updatedProducts);
  });
});

// levantar servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
