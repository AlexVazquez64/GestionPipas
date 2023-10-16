// const apiUrl = "http://172.168.10.47/pipasetupweb/vistas/service.php";
const apiUrl = "http://192.168.200.144/ecosat/replicaventas/vistas/service.php";

let jornadaData = {}; // Variable para almacenar los datos de la jornada
let ventaData = {}; // Variable para almacenar los datos de la venta

// El objeto 'dbConfig' podría tener la configuración de la base de datos si la necesitas.
const dbConfig = JSON.parse(sessionStorage.getItem("dbConfig"));

// Obtienes los datos de la API y los renderizas en la tabla.
async function fetchVentasAndJornadas() {
  try {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // Limpiar el tbody antes de añadir nuevos datos.

    let response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "journeys",
        connection: dbConfig, // Aquí irían los datos de conexión si son necesarios.
        journeysales: {
          step: 1,
          folio: 0,
          id: 0,
          readers: null,
        },
      }),
    });

    let data = await response.json();

    if (data && data[0] && data[0].obj) {
      renderizarTabla(data[0].obj);
    }
  } catch (error) {
    console.error("Error al obtener los datos", error);
  }
}

// editar jornada
document
  .getElementById("editarJornadaForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    handleFormSubmissionJornadas(); // Llama a la función async
  });

async function handleFormSubmissionJornadas() {
  let updatedData = {
    step: 8,
    folio: 0,
    id: jornadaData.idJornada,
    readers: null,
    joursale: {
      ...jornadaData, // incorpora todos los datos de la jornada
      FechaEmision: formatDateTime(
        document.getElementById("FechaEmision").value
      ),
      FechaCierre: formatDateTime(document.getElementById("FechaCierre").value),
      EstatusReplica: document.getElementById("EstatusReplica").value,
      sales: [],
    },
  };

  console.log(JSON.parse(JSON.stringify(jornadaData)));
  console.log(JSON.parse(JSON.stringify(updatedData)));

  try {
    let response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "journeys",
        connection: dbConfig,
        journeysales: updatedData,
      }),
    });

    let data = await response.json();

    if (data && data[0] && data[0].response.id == 1) {
      showSweetAlert("Jornada actualizada con éxito!", "success");
      const myModal = bootstrap.Modal.getInstance(
        document.getElementById("editarJornadaModal")
      );
      myModal.hide();

      // Suponiendo que esta función recarga o renderiza la lista de ventas y jornadas.
      fetchVentasAndJornadas();
    } else {
      showSweetAlert("Hubo un error al actualizar la jornada.", "danger");
    }
  } catch (error) {
    console.error("Error al actualizar la jornada", error);
    showSweetAlert("Hubo un error inesperado.", "danger");
  }
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-editar")) {
    jornadaData = JSON.parse(e.target.dataset.jornada); // Almacena los datos en jornadaData

    document.getElementById("idJornada").value = jornadaData.idJornada;
    document.getElementById("FechaEmision").value = jornadaData.FechaEmision;
    document.getElementById("FechaCierre").value = jornadaData.FechaCierre;
    document.getElementById("EstatusReplica").value =
      jornadaData.EstatusReplica;

    // Puedes continuar configurando otros campos aquí, si los necesitas.

    const myModal = new bootstrap.Modal(
      document.getElementById("editarJornadaModal")
    );
    myModal.show();
  }
});

function formatDateTime(dateTimeStr) {
  // Remover PM/AM
  let sanitizedStr = dateTimeStr.replace(/ (AM|PM)/, "");

  // Reemplazar el espacio entre la fecha y la hora con 'T' para formatearlo como una fecha ISO
  sanitizedStr = sanitizedStr.replace(" ", "T");

  // Remover segundos
  // sanitizedStr = sanitizedStr.substring(0, 16);

  return sanitizedStr;
}

function replaceUndefinedOrNullWithValue(obj, ignoreKeys = [], value = 0.0) {
  for (let key in obj) {
    if (ignoreKeys.includes(key)) continue;
    if (obj[key] === undefined || obj[key] === null) {
      obj[key] = value;
    }
  }
  return obj;
}

// Editar venta
document
  .getElementById("editarVentaForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    handleFormSubmissionVentas();
  });

async function handleFormSubmissionVentas() {
  let updatedData = {
    step: 7, // Step actualizado según tu descripción
    folio: 0,
    id: ventaData.IdVenta,
    readers: null,
    joursale: {
      ...ventaData,
      Masa: document.getElementById("Masa").value,
      Volumen: document.getElementById("Volumen").value,
      Densidad: document.getElementById("Densidad").value,
      Temperatura: document.getElementById("Temperatura").value,
      Precio: document.getElementById("Precio").value,
      Esquema: document.getElementById("Esquema").value,
      TotalVenta: document.getElementById("TotalVenta").value,
      FechaInicio: formatDateTime(document.getElementById("FechaInicio").value),
      FechaFin: formatDateTime(document.getElementById("FechaFin").value),
      sistemaLecturaInicial: document.getElementById("sistemaLecturaInicial")
        .value,
      sistemaLecturaFinal: document.getElementById("sistemaLecturaFinal").value,
      lecturaInicial: document.getElementById("lecturaInicial").value,
      lecturaFinal: document.getElementById("lecturaFinal").value,
    },
  };

  updatedData.joursale = replaceUndefinedOrNullWithValue(updatedData.joursale, [
    "FechaInicio",
    "FechaFin",
  ]);

  try {
    let response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "journeys",
        connection: dbConfig,
        journeysales: updatedData,
      }),
    });

    let data = await response.json();

    if (data && data[0] && data[0].response.id == 1) {
      showSweetAlert("Venta actualizada con éxito!", "success");
      const myModal = bootstrap.Modal.getInstance(
        document.getElementById("editarVentaModal")
      );
      myModal.hide();

      // Suponiendo que esta función recarga o renderiza la lista de ventas y jornadas.
      fetchVentasAndJornadas();
    } else {
      showSweetAlert("Hubo un error al actualizar la venta.", "danger");
    }
  } catch (error) {
    console.error("Error al actualizar la venta", error);
    showSweetAlert("Hubo un error inesperado.", "danger");
  }
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-editar-venta")) {
    ventaData = JSON.parse(e.target.dataset.venta);

    // Función para validar los datos antes de asignarlos
    function validateData(value) {
      return value === undefined || value === null ? "0.0" : value;
    }

    document.getElementById("idVenta").value = validateData(ventaData.IdVenta);
    document.getElementById("Masa").value = validateData(ventaData.Masa);
    document.getElementById("Volumen").value = validateData(ventaData.Volumen);
    document.getElementById("Densidad").value = validateData(
      ventaData.Densidad
    );
    document.getElementById("Temperatura").value = validateData(
      ventaData.Temperatura
    );
    document.getElementById("Precio").value = validateData(ventaData.Precio);
    document.getElementById("Esquema").value = validateData(ventaData.Esquema);
    document.getElementById("TotalVenta").value = validateData(
      ventaData.TotalVenta
    );

    // Fechas no se validan ya que no queremos que se asignen a "0.0"
    document.getElementById("FechaInicio").value = formatDateTime(
      ventaData.FechaInicio
    );
    document.getElementById("FechaFin").value = formatDateTime(
      ventaData.FechaFin
    );

    document.getElementById("sistemaLecturaInicial").value = validateData(
      ventaData.sistemaLecturaInicial
    );
    document.getElementById("sistemaLecturaFinal").value = validateData(
      ventaData.sistemaLecturaFinal
    );
    document.getElementById("lecturaInicial").value = validateData(
      ventaData.lecturaInicial
    );
    document.getElementById("lecturaFinal").value = validateData(
      ventaData.lecturaFinal
    );

    const myModal = new bootstrap.Modal(
      document.getElementById("editarVentaModal")
    );
    myModal.show();
  }
});

function showSweetAlert(message, type) {
  let iconType = type;

  switch (type) {
    case "success":
      iconType = "success";
      break;
    case "danger":
      iconType = "error";
      break;
    // Puedes agregar más casos si es necesario
    default:
      break;
  }

  Swal.fire({
    icon: iconType,
    title: message,
    timer: 3000, // 3 segundos antes de que se cierre automáticamente
    showConfirmButton: false,
  });
}

// Renderizas los datos en la tabla.
function renderizarTabla(jornadas) {
  const tbody = document.querySelector("tbody");

  jornadas.forEach((jornada) => {
    let tr = document.createElement("tr");
    tr.id = `row${jornada.idJornada}`; // Asignar ID único
    tr.classList.add("table-row-expandable"); // Aquí se añade la nueva clase.

    // Modificando para tener solo las celdas necesarias
    tr.innerHTML = `
            <td>${jornada.idJornada}</td>
            <td>${jornada.Folio}</td>
            <td>${jornada.idUnidad}</td>
            <td>${jornada.FechaEmision}</td>
            <td>${jornada.FechaCierre}</td>
            <td>${jornada.Estatus}</td>
            <td>${jornada.EstatusReplica}</td>
            <td>
              <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${
                jornada.idJornada
              }" aria-expanded="false" aria-controls="collapse${
      jornada.idJornada
    }">
                <i class="fas fa-eye"></i>
              </button>
            </td>
            <td>
              <button class="btn btn-warning btn-editar" data-jornada='${JSON.stringify(
                jornada
              )}'>
                <i class="fas fa-edit"></i> Editar
              </button>
            </td>`;

    tbody.appendChild(tr);

    // Crear una nueva fila para el contenido expandible
    let trCollapse = document.createElement("tr");
    trCollapse.innerHTML = `
            <td colspan="9">
                <div class="collapse" id="collapse${jornada.idJornada}">
                    <div class="card card-body">
                        ${renderizarVentas(jornada.sales)}
                    </div>
                </div>
            </td>`;
    tbody.appendChild(trCollapse);
  });
}

function renderizarVentas(ventas) {
  let tablaVentas = `<table class="table table-hover table-striped table-bordered table-ventas">
                      <thead>
                        <tr>
                          <th>Folio Venta</th>
                          <th>Volumen</th>
                          <th>Precio</th>
                          <th>Total Venta</th>
                          <th>Fecha Inicio</th>
                          <th>Fecha Fin</th>
                          <th>Estatus Entrega</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>`;
  ventas.forEach((venta) => {
    tablaVentas += `<tr>
                      <td>${venta.FolioVenta}</td>
                      <td>${venta.Volumen}</td>
                      <td>${venta.Precio}</td>
                      <td>${venta.TotalVenta}</td>
                      <td>${venta.FechaInicio}</td>
                      <td>${venta.FechaFin}</td>
                      <td>${venta.estatusEntrega}</td>
                      <td>
                        <button class="btn btn-info btn-detalle" data-venta='${JSON.stringify(
                          venta
                        )}'>
                            <i class="fas fa-info-circle"></i> Detalle
                        </button>
                        <button class="btn btn-warning btn-editar-venta" data-venta='${JSON.stringify(
                          venta
                        )}'>
                            <i class="fas fa-edit"></i> Editar
                        </button>
                      </td>
                    </tr>`;
  });

  tablaVentas += `  </tbody>
                  </table>`;
  return tablaVentas;
}

function renderizarDetalleVenta(venta) {
  // Aquí puedes formatear la información de la venta como un ticket
  console.log(venta);
  let detalleVenta = `
      <div class="ticket">
          <p><strong>Folio venta:</strong> ${venta.FolioVenta}</p>
          <p><strong>ID venta:</strong> ${venta.IdVenta}</p>
          <p><strong>Volumen:</strong> ${venta.Volumen}</p>
          <p><strong>Masa:</strong> ${venta.Masa}</p>
          <p><strong>Densidad:</strong> ${venta.Densidad}</p>
          <p><strong>Temperatura:</strong> ${venta.Temperatura}</p>
          <p><strong>Precio:</strong> ${venta.Precio}</p>
          <p><strong>Total venta:</strong> ${venta.TotalVenta}</p>
          <p><strong>Fecha inicio:</strong> ${venta.FechaInicio}</p>
          <p><strong>Fecha fin:</strong> ${venta.FechaFin}</p>
          <p><strong>Lectura inicial:</strong> ${venta.LecturaInicial}</p>
          <p><strong>Lectura final:</strong> ${venta.LecturaFinal}</p>
          <p><strong>Sistema lectura inicial:</strong> ${venta.sistemaLecturaInicial}</p>
          <p><strong>Sistema lectura final:</strong> ${venta.sistemaLecturaFinal}</p>
          <p><strong>Estatus entrega:</strong> ${venta.estatusEntrega}</p>
          <p><strong>Litros marcados:</strong> ${venta.LitrosMarcados}</p>
          <p><strong>Total marcado:</strong> ${venta.TotalMarcado}</p>
      </div>
      <div id="map" style="height: 300px;"></div>
  `;

  return detalleVenta;
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-detalle")) {
    const venta = JSON.parse(e.target.dataset.venta);
    const modalBody = document.querySelector("#detalleVentaModalBody");
    modalBody.innerHTML = renderizarDetalleVenta(venta);

    const myModal = new bootstrap.Modal(
      document.getElementById("detalleVentaModal")
    );
    myModal.show();

    const handleMapInitialization = function (e) {
      initMap(parseFloat(venta.Latitud), parseFloat(venta.Longitud));
      $("#detalleVentaModal").off("shown.bs.modal", handleMapInitialization);
    };

    $("#detalleVentaModal").on("shown.bs.modal", handleMapInitialization);
  }
});

function initMap(lat, lon) {
  // Crear el objeto mapa
  const map = L.map("map").setView([lat, lon], 17);

  // Añadir la capa de teselas (tiles) de OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Añadir un marcador en la ubicación de la venta
  L.marker([lat, lon]).addTo(map);
}

document.querySelector(".btn-regresar").addEventListener("click", function () {
  window.location.href = "panelDeControl.html";
});

// Llamas a la función obtenerDatos() cuando el DOM está completamente cargado.
document.addEventListener("DOMContentLoaded", fetchVentasAndJornadas());
