import { Router } from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const router = Router();

// Crear carrito

router.post("/", async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });

    res.status(201).json({
      status: "success",
      payload: newCart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear carrito",
      error: error.message,
    });
  }
});

// Obtener carrito con populate

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid).populate("products.product").lean();

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener carrito",
      error: error.message,
    });
  }
});

// Agregar producto al carrito

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    const productInCart = cart.products.find(
      (p) => p.product.toString() === pid,
    );

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({
        product: pid,
        quantity: 1,
      });
    }

    await cart.save();

    res.json({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al agregar producto al carrito",
      error: error.message,
    });
  }
});

// Reemplazar todos los productos del carrito

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const updatedCart = await Cart.findByIdAndUpdate(
      cid,
      { products },
      { new: true },
    );

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar carrito",
      error: error.message,
    });
  }
});

// Actualizar SOLO la cantidad de un producto

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid,
    );

    if (productIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Producto no existe en el carrito",
      });
    }

    cart.products[productIndex].quantity = quantity;

    await cart.save();

    res.json({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar cantidad",
      error: error.message,
    });
  }
});

// Eliminar producto del carrito

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);

    await cart.save();

    res.json({
      status: "success",
      message: "Producto eliminado del carrito",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar producto",
      error: error.message,
    });
  }
});

// Vaciar carrito completo

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    cart.products = [];

    await cart.save();

    res.json({
      status: "success",
      message: "Carrito vaciado",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al vaciar carrito",
      error: error.message,
    });
  }
});

export default router;
