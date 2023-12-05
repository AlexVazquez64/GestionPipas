// const apiUrlLocal = "http://172.168.10.47/pipasetupweb/vistas/service.php";
const apiUrlLocal = "http://localhost/ecosat/pipasetupweb/vistas/service.php";
const apiUrlServer = "http://localhost/ecosat/pipasetupweb/vistas/service.php";

async function guardarConfiguracion() {
  const host_pipas = document.getElementById("host_pipas").value;
  const username_pipas = document.getElementById("username_pipas").value;
  const password_pipas = document.getElementById("password_pipas").value;
  const dbname_pipas = document.getElementById("dbname_pipas").value;

  const host_server = document.getElementById("host_server").value;
  const username_server = document.getElementById("username_server").value;
  const password_server = document.getElementById("password_server").value;
  const dbname_server = document.getElementById("dbname_server").value;

  const dataPipas = {
    mode: "chkcon",
    connection: {
      hostname: host_pipas,
      username: username_pipas,
      password: password_pipas,
      database: dbname_pipas,
    },
  };

  const dataServer = {
    mode: "chkcon",
    connection: {
      hostname: host_server,
      username: username_server,
      password: password_server,
      database: dbname_server,
    },
  };

  try {
    // Verificar la conexión para dataPipas y si es exitosa, guardar en sessionStorage
    const resPipas = await verificarConexion(dataPipas, apiUrlLocal);
    sessionStorage.setItem("dbConfigPipas", JSON.stringify(dataPipas.connection));

    // Verificar la conexión para dataServer y si es exitosa, guardar en sessionStorage
    const resServer = await verificarConexion(dataServer, apiUrlServer);
    sessionStorage.setItem("dbConfigServer", JSON.stringify(dataServer.connection));

    // Solo después de que ambas verificaciones son exitosas, redireccionar al panel de control
    window.location.href = "panelDeControl.html";

    // Limpiar cualquier mensaje de error que pudiera estar visible
    mostrarError("");
  } catch (err) {
    // En caso de error en alguna de las conexiones, mostrar el mensaje de error
    mostrarError(err);
  }
}

async function verificarConexion(data, apiUrl) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error:", error);
    throw new Error(
      "Error de conexión. Verifique la consola para más detalles."
    );
  }
}

function handleResponse(response) {
  return response.json().then((data) => {
    if (response.ok && data.response && data.response.id === 1) return data;
    const error =
      (data.response && data.response.msgSpa) || "Error desconocido";
    throw new Error(`Error de conexión: ${error}`);
  });
}

function mostrarError(message) {
  const errorMessageDiv = document.getElementById("error-message");
  errorMessageDiv.innerHTML = message
    ? `<div class="alert alert-danger">${message}</div>`
    : "";
}
