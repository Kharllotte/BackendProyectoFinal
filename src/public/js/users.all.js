function deleteUsers() {
  const action = confirm("Esta seguro de eliminar los usuarios inactivos?");

  const $loader = document.getElementById("loaderIndeterminate");
  $loader.classList.remove("d-none");
  if (action) {
    axios
      .delete(`/api/users`)
      .then((response) => {
        $loader.classList.add("d-none");
        if (response.data.success == "true") {
          alert("Usuarios eliminados correctamente");
          location.reload();
        } else {
          alert("Hubo un error");
        }
      })
      .catch((error) => {
        $loader.classList.add("d-none");
        console.error("Error:", error);
      });
  }
}

function changeRole(role, uid) {
  if (role == "user") {
    axios
      .post(`/api/users/premium/${uid}`)
      .then((response) => {
        if (response.data.success == "true") {
          location.reload();
        } else if (response.data.message == "User no upload all documents") {
          alert(
            "No se pudo actualizar a premium porque el usuario no ha subido los documentos necesarios."
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("El usuario ya es premium");
  }
}
