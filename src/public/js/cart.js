const cartButton = document.getElementById("cart-button");
const popup = document.getElementById("popup");
const closeButton = document.getElementById("close-button");
const cartItemsList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Función para abrir el popup
function openPopup() {
  popup.style.display = "block";
  axios
  .get(`/api/carts/${_idCart}`)
  .then((response) => {
    const products = response.data.payload.products;
    displayProducts(products);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}

// Función para cerrar el popup
function closePopup() {
  popup.style.display = "none";
}

// Asigna el evento clic al botón del carrito para abrir el popup
cartButton.addEventListener("click", openPopup);

// Asigna el evento clic al botón de cerrar para cerrar el popup
closeButton.addEventListener("click", closePopup);

document.addEventListener("click", (e) => {
  if (e.target.matches(".action-cart")) {
    const action = e.target.dataset.action;
    const _idProduct = e.target.dataset.id;

    if (action === "minus" || action === "plus") {
      let amount = Number(e.target.dataset.amount);
      amount = action === "minus" ? amount - 1 : amount + 1;

      axios
        .put(`/api/carts/${_idCart}/products/${_idProduct}`, {
          amount,
        })
        .then((response) => {
          const products = response.data.payload.products;
          displayProducts(products);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      axios
        .delete(`/api/carts/${_idCart}/products/${_idProduct}`)
        .then((response) => {
          const products = response.data.payload.products;
          displayProducts(products);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
});

function displayProducts(products) {
  localStorage.setItem("cart", JSON.stringify(products));
  const cartCounter = document.getElementById("cart-counter");
  cartCounter.innerText = products.length.toString();
  const total = sumPrices(products);

  cartItemsList.innerHTML = "";
  products.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.productId.title}</td>
      <td>$${item.productId.price}</td>
      <td>${item.amount}</td>
      <td>
        <div class='actions'>
          <i class="fa-solid fa-minus action-cart" data-amount=${item.amount} data-action='minus' data-id='${item.productId._id}'></i>
          <i class="fa-solid fa-plus action-cart" data-amount=${item.amount} data-action='plus' data-id='${item.productId._id}'></i>
          <i class="fa-solid fa-trash action-cart" data-amount=${item.amount} data-action='trash' data-id='${item.productId._id}'></i>
        </div>
      </td>
      `;
    cartItemsList.appendChild(tr);
  });

  cartTotal.textContent = `$${total}`;
}

function sumPrices(products) {
  const total = products.reduce((acc, product) => {
    return acc + product.productId.price * product.amount;
  }, 0);
  return total;
}
