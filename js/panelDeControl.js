document.addEventListener("DOMContentLoaded", function () {
  // Verifica si la configuración de la base de datos está en el sessionStorage
  const dbConfig = sessionStorage.getItem("dbConfig");
  if (!dbConfig) {
    // Si no está, redirige al usuario a la página de inicio (index.html)
    window.location.href = "index.html";
    return; // Sale de la función para no seguir ejecutando el código siguiente
  }

  // Selecciona el botón de cerrar sesión por su id y añade un evento de clic
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      // Elimina la configuración de la base de datos del sessionStorage
      sessionStorage.removeItem("dbConfig");

      // Redirige al usuario a la página de inicio (index.html)
      window.location.href = "index.html";
    });
  }
});
