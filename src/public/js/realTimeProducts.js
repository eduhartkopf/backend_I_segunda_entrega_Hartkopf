const socket = io();

const productsList = document.getElementById("productsList");
const productForm = document.getElementById("productForm");

socket.on("products", (products) => {
  productsList.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${product.title}</strong> - $${product.price} - ${product.category}
      <button onclick="deleteProduct('${product._id}')">Eliminar</button>
    `;
    productsList.appendChild(li);
  });
});

socket.on("productError", (message) => {
  alert(message);
});

productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(productForm);

  const product = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    category: formData.get("category"),
    thumbnails: formData.get("thumbnails") ? [formData.get("thumbnails")] : [],
    status: productForm.status.checked,
  };

  socket.emit("createProduct", product);

  productForm.reset();
});

function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}
