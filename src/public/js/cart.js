// Conexión única a Socket.io
const socket = io();

// ---------------------- CREAR CARRITO ----------------------
document.getElementById("createCartBtn").addEventListener("click", () => {
  const cartData = { owner: "Usuario Demo" }; // podés personalizar
  socket.emit("newCart", cartData);
});

// ---------------------- AGREGAR/QUITAR PRODUCTOS ----------------------
function addToCart(cartId, product) {
  socket.emit("addToCart", { cartId, product });
}

function removeFromCart(cartId, productId) {
  socket.emit("removeFromCart", { cartId, productId });
}

// ---------------------- RENDERIZADO DE CARRITOS ----------------------
function renderCarts(carts) {
  const container = document.getElementById("cartsContainer");
  container.innerHTML = "";

  carts.forEach((cart) => {
    const div = document.createElement("div");
    div.className = "col-md-4"; // responsive: 3 por fila
    div.innerHTML = `
            <div class="card shadow-sm h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">Carrito #${cart.id}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${cart.owner}</h6>

                    <ul class="list-group list-group-flush mb-3">
                        ${cart.products
                          .map(
                            (p) => `
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                ${p.name} - $${p.price}
                                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${cart.id}, ${p.id})">
                                    Quitar
                                </button>
                            </li>`,
                          )
                          .join("")}
                    </ul>

                    <button class="btn btn-sm btn-success mt-auto" 
                            onclick="addToCart(${cart.id}, {id: ${Date.now()}, name:'ProductoX', price:100})">
                        Agregar ProductoX
                    </button>
                </div>
            </div>
        `;
    container.appendChild(div);
  });
}

// ---------------------- ESCUCHAR ACTUALIZACIONES ----------------------
socket.on("updateCarts", (updatedCarts) => {
  renderCarts(updatedCarts);
});
