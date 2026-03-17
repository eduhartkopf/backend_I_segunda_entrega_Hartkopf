import fs from "fs/promises";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getCartById(id) {
    // Validacion:

    const carts = await this.getCarts();
    return carts.find((cart) => cart.id === id);
  }

  async createCart() {
    // Crea un nuevo carrito con un ID único.

    const carts = await this.getCarts();

    const newCart = {
      id: carts.length === 0 ? 1 : carts[carts.length - 1].id + 1,
      products: [],
    };

    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));

    return newCart;
  }

  // agregamos el producto al carrito.

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === cartId);

    // validación

    if (!cart) return null;

    const productInCart = cart.products.find((p) => p.product === productId);

    // validacion: si el producto ya existe en el carrito, incrementa la cantidad (quantity), sino agrega +1 a quantity.

    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}
