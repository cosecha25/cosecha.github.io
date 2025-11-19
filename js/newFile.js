document.addEventListener("DOMContentLoaded", function () {
  const listaCarrito = document.querySelector("#lista-carrito tbody");
  const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
  const carrito = document.getElementById("carrito");
  const imgCarrito = document.getElementById("img-carrito");
  const cantidadCarrito = document.getElementById("cantidad-carrito");
  const totalCarrito = document.getElementById("total-pagar-valor");

  let contadorCarrito = 0;
  let totalPrecio = 0;

  // 🛒 Detectar clic en .project-weight
  document.querySelectorAll(".farm-single-project .project-weight").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation(); // evita conflictos con otros clics

      const card = btn.closest(".farm-single-project");
      const nombre = card.querySelector("h4")?.innerText || "Producto";
      const precioTexto = card.querySelector(".project-weight h3")?.innerText || "$0";
      const precio = parseFloat(precioTexto.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
      const imgSrc = card.querySelector("img")?.src || "";

      agregarAlCarrito({ nombre, precio, imagen: imgSrc });
    });
  });

  // Función para agregar al carrito
  function agregarAlCarrito(producto) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td><img src="${producto.imagen}" width="40"> ${producto.nombre}</td>
      <td>$${producto.precio.toFixed(2)}</td>
      <td><input type="number" value="1" min="1" class="cantidad-input"></td>
      <td><i class="far fa-trash-alt eliminar-producto"></i></td>
    `;
    listaCarrito.appendChild(fila);

    contadorCarrito++;
    totalPrecio += producto.precio;

    actualizarCarrito();
    guardarCarrito();
  }

  // Eliminar producto
  listaCarrito.addEventListener("click", function (e) {
    if (e.target.classList.contains("eliminar-producto")) {
      const fila = e.target.closest("tr");
      const cantidad = parseInt(fila.querySelector(".cantidad-input").value);
      const precio = parseFloat(fila.children[1].innerText.replace("$", ""));
      totalPrecio -= precio * cantidad;
      contadorCarrito -= cantidad;
      fila.remove();
    }
  });
});
