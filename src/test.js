import ProductManager from "./managers/ProductManager.js";

const pm = new ProductManager("./src/data/products.json");

console.log("Productos iniciales:");
console.log(pm.getProducts());

const product1 = pm.addProduct({
  title: "Teclado",
  description: "Teclado mecánico",
  price: 15000,
  thumbnail: "img/teclado.png",
  code: "TEC001",
  stock: 10,
});

console.log("Producto agregado:");
console.log(product1);

console.log("Productos finales:");
console.log(pm.getProducts());
