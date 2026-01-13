import fs from "fs";
import express from "express";
import ProductManager from "./src/managers/ProductManager.js";

const app = express();
const PORT = 8080;

app.use(express.json());

const productManager = new ProductManager("./src/data/products.json");

app.get("/products", (req, res) => {
  const products = productManager.getProducts();
  res.json({ products });
});

app.get("/products/:pid", (req, res) => {
  const pid = Number(req.params.pid);
  const product = productManager.getProductById(pid);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(product);
});

app.post("/products", (req, res) => {
  const newProduct = req.body;

  const createdProduct = productManager.addProduct(newProduct);

  if (!createdProduct) {
    return res.status(400).json({ error: "Producto duplicado" });
  }

  res.status(201).json(createdProduct);
});

app.delete("/products/:pid", (req, res) => {
  const pid = Number(req.params.pid);
  const products = productManager.getProducts();
  const index = products.findIndex((p) => p.id === pid);
  if (index === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  products.splice(index, 1);
  fs.writeFileSync(productManager.path, JSON.stringify(products, null, 2));

  res.json({ message: "Producto eliminado correctamente" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
