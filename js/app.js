const apiUrl = "http://172.168.10.47/pipasetupweb/vistas/service.php";

async function guardarConfiguracion() {
  const host = document.getElementById("host").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const dbname = document.getElementById("dbname").value;

  const data = {
    mode: "chkcon",
    connection: { hostname: host, username, password, database: dbname },
  };

  await verificarConexion(data)
    .then((res) => {
      sessionStorage.setItem("dbConfig", JSON.stringify(data.connection));
      window.location.href = "panelDeControl.html";
      mostrarError("");
    })
    .catch((err) => mostrarError(err));
}

async function verificarConexion(data) {
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
