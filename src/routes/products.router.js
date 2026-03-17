import { Router } from "express";
import Product from "../models/product.model.js";

const router = Router();

// GET - productos con paginación, filtros y orden

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const parsedLimit = Number(limit);
    const parsedPage = Number(page);

    const filter = {};

    // filtro por categoría o disponibilidad

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

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `${baseUrl}?page=${result.prevPage}&limit=${parsedLimit}${
            sort ? `&sort=${sort}` : ""
          }${query ? `&query=${query}` : ""}`
        : null,
      nextLink: result.hasNextPage
        ? `${baseUrl}?page=${result.nextPage}&limit=${parsedLimit}${
            sort ? `&sort=${sort}` : ""
          }${query ? `&query=${query}` : ""}`
        : null,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener productos",
      error: error.message,
    });
  }
});

// GET - producto por ID

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await Product.findById(pid).lean();

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener el producto",
      error: error.message,
    });
  }
});

// POST - crear producto

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
      status,
    } = req.body;

    if (
      !title ||
      !description ||
      !code ||
      price === undefined ||
      stock === undefined ||
      !category
    ) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios",
      });
    }

    const existingProduct = await Product.findOne({ code });

    if (existingProduct) {
      return res.status(400).json({
        status: "error",
        message: "Ya existe un producto con ese code",
      });
    }

    const newProduct = await Product.create({
      title,
      description,
      code,
      price: Number(price),
      stock: Number(stock),
      category,
      thumbnails: thumbnails || [],
      status: status !== undefined ? status : true,
    });

    res.status(201).json({
      status: "success",
      payload: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear producto",
      error: error.message,
    });
  }
});

// PUT - actualizar producto

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedFields = { ...req.body };

    if (updatedFields.price !== undefined) {
      updatedFields.price = Number(updatedFields.price);
    }

    if (updatedFields.stock !== undefined) {
      updatedFields.stock = Number(updatedFields.stock);
    }

    const updatedProduct = await Product.findByIdAndUpdate(pid, updatedFields, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar producto",
      error: error.message,
    });
  }
});

// DELETE - eliminar producto

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(pid);

    if (!deletedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.json({
      status: "success",
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar producto",
      error: error.message,
    });
  }
});

export default router;
