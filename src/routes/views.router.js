import { Router } from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const router = Router();

// HOME

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("home", { products });
  } catch (error) {
    console.error("Error cargando productos en HOME:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// REAL TIME PRODUCTS

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("Error cargando productos en realtime:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// VISTA DE PRODUCTOS CON PAGINACIÓN

router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const parsedLimit = Number(limit);
    const parsedPage = Number(page);

    const filter = {};

    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    const sortOptions = {};
    if (sort === "asc") {
      sortOptions.price = 1;
    } else if (sort === "desc") {
      sortOptions.price = -1;
    }

    const result = await Product.paginate(filter, {
      limit: parsedLimit,
      page: parsedPage,
      sort: Object.keys(sortOptions).length ? sortOptions : undefined,
      lean: true,
    });

    res.render("products", {
      products: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      prevLink: result.hasPrevPage
        ? `/products?page=${result.prevPage}&limit=${parsedLimit}${
            sort ? `&sort=${sort}` : ""
          }${query ? `&query=${query}` : ""}`
        : null,
      nextLink: result.hasNextPage
        ? `/products?page=${result.nextPage}&limit=${parsedLimit}${
            sort ? `&sort=${sort}` : ""
          }${query ? `&query=${query}` : ""}`
        : null,
    });
  } catch (error) {
    console.error("Error cargando vista de productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// DETALLE DE PRODUCTO

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await Product.findById(pid).lean();

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", { product });
  } catch (error) {
    console.error("Error cargando detalle del producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// VISTA DE CARRITO ESPECÍFICO

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid).populate("products.product").lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cart", { cart });
  } catch (error) {
    console.error("Error cargando carrito:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
