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

// Evento para abrir el modal al hacer clic en el enlace
document.querySelector('[href="schemas.html"]').addEventListener('click', function (event) {
  event.preventDefault(); // Previene la navegación directa
  const myModal = new bootstrap.Modal(document.getElementById('passwordModal'));
  myModal.show();
});

// Función para verificar la contraseña
function verificarPassword() {
  const passwordCorrecta = "98374252"; // Establece tu contraseña aquí
  const passwordIngresada = document.getElementById('passwordInput').value;

  if (passwordIngresada === passwordCorrecta) {
    window.location.href = "schemas.html"; // Redirige si la contraseña es correcta
  } else {
    alert("Contraseña incorrecta."); // Muestra un mensaje de error
  }
}