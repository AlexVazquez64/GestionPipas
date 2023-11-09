document.addEventListener("DOMContentLoaded", function () {
  // Verifica si la configuración de la base de datos está en el sessionStorage
  const dbConfigPipas = sessionStorage.getItem("dbConfigPipas");
  const dbConfigServer = sessionStorage.getItem("dbConfigServer");
  console.log('dbConfigPipas:', dbConfigPipas);
  console.log('dbConfigServer:', dbConfigServer);

  if (!dbConfigPipas || !dbConfigServer) {
    // Si no está, redirige al usuario a la página de inicio (index.html)
    window.location.href = "index.html";
    return; // Sale de la función para no seguir ejecutando el código siguiente
  }

  // Selecciona el botón de cerrar sesión por su id y añade un evento de clic
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      // Elimina la configuración de la base de datos del sessionStorage
      sessionStorage.removeItem("dbConfigPipas");
      sessionStorage.removeItem("dbConfigServer");

      // Redirige al usuario a la página de inicio (index.html)
      window.location.href = "index.html";
    });
  }
});
