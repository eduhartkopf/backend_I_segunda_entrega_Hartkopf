import fs from "fs"; // Importación del modulo de NODE.

export default class ProductManager {
  // Con esta linea exporto la class

  constructor(path) {
    this.path = path;
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }
  getProductById(id) {
    const products = this.getProducts();
    return products.find((product) => product.id === id);
  }

  addProduct(product) {
    const products = this.getProducts();

    const exists = products.some((p) => p.code === product.code);

    if (exists) {
      console.log("El producto con ese código ya existe");
      return;
    }
    const newProduct = {
      id: products.length === 0 ? 1 : products[products.length - 1].id + 1,
      ...product,
    };

    products.push(newProduct);

    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));

    return newProduct;
  }
}
