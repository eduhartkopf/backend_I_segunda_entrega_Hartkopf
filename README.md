# Proyecto E-commerce – Backend I

## Descripción

Este proyecto es un **e-commerce simple** desarrollado con **Node.js, Express, Handlebars y Socket.io**, enfocado en la práctica de **WebSockets**. Permite:

- Mostrar productos en una **vista principal (`home`)**.
- Gestionar productos en **tiempo real (`realtimeproducts`)** mediante WebSockets.
- Agregar y eliminar productos desde la vista en tiempo real, con actualización automática para todos los clientes conectados.

Los productos se almacenan en un archivo JSON (`src/data/products.json`) utilizando la clase `ProductManager`.

---

## Tecnologías

- Node.js
- Express
- Handlebars
- Socket.io
- JavaScript (ESModules)
- JSON como almacenamiento de datos

---


## Instalación

### Clonar el repositorio:

```bash
git clone <URL_REPO>

npm install express express-handlebars socket.io

node app.js

### Uso:

Abrir navegador en http://localhost:8080/
 → Lista de productos (home).

Abrir http://localhost:8080/realtimeproducts
 → Vista en tiempo real con:

Lista de productos.

Formulario para agregar productos.

Botones para eliminar productos.

Todos los cambios en esta vista se reflejan automáticamente para todos los clientes conectados gracias a WebSockets.

### Notas

Los productos se gestionan mediante ProductManager y se guardan en products.json.

La ruta /api/products permite operaciones REST sobre los productos (GET, POST, PUT, DELETE).

La ruta /api/carts y la lógica de carritos ya no se utiliza, y fue removida del proyecto.

Se eliminó cualquier código de prueba anterior en server.js y cart.js para mantener el proyecto limpio y funcional.

Autor:

Jorge Hartkopf – Entrega de práctica Backend I
```
