// Ejemplo de solicitud GET usando Axios
const _idCart = localStorage.getItem("_idCart");

if (!_idCart) {
  axios
    .post("/api/carts")
    .then((response) => {
      const _id = response.data.payload._id;
      localStorage.setItem("_idCart", _id);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
} else {
  axios
  .get(`/api/carts/${_idCart}`)
  .then((response) => {
    localStorage.setItem("cart", JSON.stringify(response.data.payload.products));
    const cartCounter = document.getElementById("cart-counter");
    cartCounter.innerText = response.data.payload.products.length.toString();
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}
