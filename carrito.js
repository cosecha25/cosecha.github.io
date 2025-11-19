// Variable global para almacenar los productos del carrito. Carga desde localStorage.
let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// ===========================================
// 1. FUNCIONES PRINCIPALES DEL CARRITO
// ===========================================

/**
 * Añade un producto al carrito o incrementa su cantidad.
 * @param {object} productData - Datos del producto (id, name, price).
 */
function addToCart(productData) {
    const existingProductIndex = cart.findIndex(item => item.id === productData.id);

    if (existingProductIndex > -1) {
        // Si el producto ya está, incrementa la cantidad
        cart[existingProductIndex].quantity += 1;
    } else {
        // Si es nuevo, añádelo con cantidad 1
        productData.quantity = 1;
        cart.push(productData);
    }

    // Guarda los cambios y actualiza la interfaz
    saveCart();
    updateCartUI();
    console.log(`Producto añadido: ${productData.name}. Carrito actual:`, cart);
}

/**
 * Elimina un producto específico del carrito (o decrementa la cantidad).
 * @param {string} productId - ID del producto a eliminar.
 */
function removeItemFromCart(productId) {
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex > -1) {
        // Eliminar el producto completamente (para el botón '❌' o cantidad <= 0)
        cart.splice(existingProductIndex, 1);
        
        // Guardar los cambios y actualizar la interfaz
        saveCart();
        updateCartUI();
        console.log(`Producto eliminado (ID: ${productId}). Carrito actual:`, cart);
    }
}

/**
 * Vacía completamente el carrito.
 */
function emptyCart() {
    cart = [];
    saveCart();
    updateCartUI();
    // Muestra el carrito solo para confirmar que se vació
    const cartDropdown = document.getElementById('carrito');
    if (cartDropdown) {
        cartDropdown.classList.remove('hidden'); 
    }
    alert('El carrito ha sido vaciado.');
}

/**
 * Guarda el estado actual del carrito en localStorage.
 */
function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

/**
 * Cambia la cantidad de un producto en el carrito.
 * @param {string} productId - ID del producto.
 * @param {string} action - 'increase' o 'decrease'.
 */
function changeQuantity(productId, action) {
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        if (action === 'increase') {
            cart[productIndex].quantity += 1;
        } else if (action === 'decrease') {
            cart[productIndex].quantity -= 1;
        }

        // Si la cantidad llega a 0 o menos, eliminamos el producto del carrito
        if (cart[productIndex].quantity <= 0) {
            removeItemFromCart(productId); // Usamos la función ya existente para eliminar
        } else {
            // Si solo se actualizó la cantidad, guardamos y refrescamos la UI
            saveCart();
            updateCartUI();
        }
    }
}


/**
 * Procesa la compra: genera el mensaje de WhatsApp con el pedido y navega.
 */
function processOrder() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. ¡Añade productos antes de comprar!");
        return;
    }

    // El mensaje personalizado: "Hola, Cosecha Premium, deseo comprar:"
    let message = "Hola, Cosecha Premium, deseo comprar:\n\n";
    let total = 0;

    // Crear el cuerpo del mensaje (lista de productos)
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        message += `- ${item.name} (${item.quantity} x $${item.price.toFixed(2)}) = $${itemTotal.toFixed(2)}\n`;
    });

    // Añadir el total al mensaje
    message += "\n------------------------------\n";
    message += `TOTAL DEL PEDIDO: $${total.toFixed(2)}`;
    
    // Obtener el número de teléfono
    const phoneNumber = "50769684299"; 
    
    // Codificar el mensaje y generar el enlace de WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Redirigir al cliente
    window.open(whatsappLink, '_blank');
}


// ===========================================
// 2. FUNCIÓN DE ACTUALIZACIÓN DE INTERFAZ (UI)
// ===========================================

function updateCartUI() {
    const cartList = document.getElementById('lista-carrito');
    const totalValueSpan = document.getElementById('total-pagar-valor');
    const cartCountSpan = document.getElementById('cantidad-carrito');
    
    if (!cartList || !totalValueSpan || !cartCountSpan) return; 

    cartList.innerHTML = ''; // Limpiar el contenido actual
    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<li class="cart-item-empty">El carrito está vacío.</li>';
        totalValueSpan.textContent = '$0.00';
        cartCountSpan.textContent = '0';
        return;
    }

    // Generar la lista de productos
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalItems += item.quantity;

        const li = document.createElement('li');
        li.classList.add('cart-item');
        li.setAttribute('data-id', item.id);

        li.innerHTML = `
            <div class="cart-item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price"> $${itemTotal.toFixed(2)}</span>
            </div>
            
            <div class="cart-item-quantity-controls">
                <button class="quantity-btn decrease" data-id="${item.id}" data-action="decrease">-</button>
                <span class="item-quantity-display">${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}" data-action="increase">+</button>
            </div>

            <button class="cart-item-remove" data-id="${item.id}">❌</button>
        `;
        cartList.appendChild(li);
    });

    // Actualizar el resumen del carrito
    totalValueSpan.textContent = `$${total.toFixed(2)}`;
    cartCountSpan.textContent = totalItems.toString(); // Muestra la cantidad total de items
}


// ===========================================
// 3. EVENT LISTENERS
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la interfaz del carrito al cargar la página
    updateCartUI();

    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('carrito');
    const cartWrapper = document.querySelector('.cart-wrapper'); // Contenedor fijo

    // 3.1. ESCUCHAR CLIC EN PRODUCTOS (Añadir al Carrito)
    document.addEventListener('click', function(event) {
        const clickedElement = event.target.closest('.project-weight');

        if (clickedElement) {
            const productItem = clickedElement.closest('.farm-single-project');
            
            if (productItem) {
                const productData = {
                    id: productItem.getAttribute('data-product-id'),
                    name: productItem.getAttribute('data-product-name'),
                    price: parseFloat(productItem.getAttribute('data-product-price'))
                };
                
                addToCart(productData);
            }
        }
    });

    // 3.2. ESCUCHAR CLIC EN BOTÓN "VACIAR CARRITO"
    const vaciarBtn = document.getElementById('vaciar-carrito');
    if (vaciarBtn) {
        vaciarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            emptyCart();
        });
    }

    // 3.3. ESCUCHAR CLIC EN BOTÓN DE ELIMINAR (❌)
    if (cartDropdown) {
        cartDropdown.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-item-remove')) {
                e.preventDefault();
                const productId = e.target.getAttribute('data-id');
                removeItemFromCart(productId);
            }
        });
    }

    // 3.4. ESCUCHAR CLIC EN BOTONES DE CANTIDAD (+/-)
    if (cartDropdown) {
        cartDropdown.addEventListener('click', (e) => {
            const btn = e.target.closest('.quantity-btn');
            
            if (btn) {
                e.preventDefault();
                const productId = btn.getAttribute('data-id');
                const action = btn.getAttribute('data-action');
                
                changeQuantity(productId, action);
            }
        });
    }

    // ==========================================================
    // 3.5. LÓGICA DE MOSTRAR/OCULTAR Y CIERRE AUTOMÁTICO (CORREGIDA)
    // ==========================================================
    if (cartIcon && cartDropdown && cartWrapper) {
        
        // 3.5.1. Toggle (mostrar/ocultar) al hacer clic en el ícono
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartDropdown.classList.toggle('hidden');
            // Detenemos la propagación aquí para que el document listener no lo cierre inmediatamente
            e.stopPropagation(); 
        });

        // 3.5.2. Evita que los clics DENTRO del dropdown se propaguen al documento
        // Esto es crucial para que los botones (+/-) funcionen sin cerrar el carrito.
        cartDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // 3.5.3. Cierre al hacer clic fuera de todo el contenedor del carrito
        document.addEventListener('click', function(e) {
            // Si el carrito está abierto y el clic fue FUERA del contenedor (wrapper), cierra.
            if (!cartDropdown.classList.contains('hidden') && !cartWrapper.contains(e.target)) {
                cartDropdown.classList.add('hidden');
            }
        });
    }

    // 3.6. ESCUCHAR CLIC EN BOTÓN "COMPRAR POR WHATSAPP"
    const procesarPedidoBtn = document.getElementById('procesar-pedido');
    if (procesarPedidoBtn) {
        procesarPedidoBtn.addEventListener('click', (e) => {
            // Evita la navegación del enlace estático
            e.preventDefault(); 
            
            // Llama a la función processOrder() que genera el mensaje
            processOrder();
        });
    }
});
