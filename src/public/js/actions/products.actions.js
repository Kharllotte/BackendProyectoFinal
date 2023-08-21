function deleteProduct(id) {
  const confirm = window.confirm("Esta seguro de eliminar el producto?");
  if (confirm) {
    const $loader = document.getElementById("loaderIndeterminate");
    $loader.classList.remove("d-none");
    axios
      .post(`/products/inactive/${id}`)
      .then((res) => {
        $loader.classList.add("d-none");
        window.location.reload();
      })
      .catch((error) => {
        $loader.classList.add("d-none");
        console.error("Error:", error);
      });
  }
}

function editProduct(id) {
  const $loader = document.getElementById("loaderIndeterminate");
  $loader.classList.remove("d-none");
  axios
    .get(`/api/products/${id}`)
    .then((res) => {
      $loader.classList.add("d-none");
      document.getElementById("productEdit").value = JSON.stringify(
        res.data.payload
      );
      document.getElementById("openModalBtn").click();
    })
    .catch((error) => {
      $loader.classList.add("d-none");
      console.error("Error:", error);
    });
}
