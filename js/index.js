// index.js

function guardarConfiguracion() {
  const host = document.getElementById("host").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const dbname = document.getElementById("dbname").value;

  // Crear objeto con los datos del formulario
  const data = {
    mode: "chkcon",
    connection: {
      hostname: host,
      username: username,
      password: password,
      database: dbname,
    },
  };

  // URL del endpoint que verificará la conexión
  // const url = "http://localhost/ecosat/pipasetupweb/vistas/service.php";
  // const url = "http://172.168.200.144/ecosat/pipasetupweb/vistas/service.php";
  const url = "http://172.168.10.47/pipasetupweb/vistas/service.php";

  // Realizar solicitud POST para verificar conexión
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Asumiendo que el servidor responde con un objeto que tiene una propiedad 'success'
        // Guardar la configuración en sessionStorage
        sessionStorage.setItem("dbConfig", JSON.stringify(data.connection));

        // Navegar al panel de control
        window.location.href = "panelDeControl.html";
      } else {
        // Mostrar mensaje de error
        alert("Error de conexión: " + data.error); // Asumiendo que el servidor responde con un objeto que tiene una propiedad 'error'
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error de conexión. Verifique la consola para más detalles.");
    });
}
