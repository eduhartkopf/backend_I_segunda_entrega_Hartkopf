import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

// GET → todos los productos (con limit)
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;

    let products = await productManager.getProducts();

    if (limit && !isNaN(limit)) {
      products = products.slice(0, Number(limit));
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// GET → producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);

    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// POST → crear producto
router.post("/", async (req, res) => {
  try {
    const { title, description, price, code, stock } = req.body;

    if (!title || !description || !price || !code || !stock) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const createdProduct = await productManager.addProduct(req.body);

    if (!createdProduct) {
      return res.status(400).json({ error: "Producto duplicado" });
    }

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" });
  }
});

// PUT → actualizar producto
router.put("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    const updatedFields = req.body;

    const updatedProduct = await productManager.updateProduct(pid, updatedFields);

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// DELETE → eliminar producto
router.delete("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);

    const deleted = await productManager.deleteProduct(pid);

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

export default router;
