const socket = io();

const productsList = document.getElementById("productsList");
const form = document.getElementById("productForm");

if (!productsList) {
  console.error("No existe #productsList en el DOM");
}

if (!form) {
  console.error("No existe #productForm en el DOM");
}

// recibir productos por websocket
socket.on("products", (products) => {
  productsList.innerHTML = "";

  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.title} - $${p.price}
      <button data-id="${p.id}">❌</button>
    `;

    li.querySelector("button").addEventListener("click", () => {
      deleteProduct(p.id);
    });

    productsList.appendChild(li);
  });
});

// crear producto
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const product = {
    title: formData.get("title"),
    price: Number(formData.get("price")),
  };

  socket.emit("createProduct", product);
  form.reset();
});

// eliminar producto
function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}
