// const apiUrl = "http://172.168.10.47/pipasetupweb/vistas/service.php";
const apiUrl = "http://localhost/ecosat/pipasetupweb/vistas/service.php";

let jornadaData = {}; // Variable para almacenar los datos de la jornada
let ventaData = {}; // Variable para almacenar los datos de la venta
let jornadasData = []; // Almacena todas las jornadas para poder filtrar después

// El objeto 'dbConfigPipas' y 'dbConfigServer' podría tener la configuración de la base de datos si la necesitas.
const dbConfigPipas = sessionStorage.getItem("dbConfigPipas");
const dbConfigServer = sessionStorage.getItem("dbConfigServer");

function filtrarJornadas(query) {
  // Convertimos la consulta a minúsculas para una búsqueda no sensible a mayúsculas/minúsculas
  const lowerQuery = query.toLowerCase();

  // Filtramos las jornadas basadas en la consulta
  const jornadasFiltradas = jornadasData.filter(
    (jornada) =>
      jornada.idJornada.toString().includes(lowerQuery) ||
      jornada.Folio.toString().includes(lowerQuery) ||
      jornada.idUnidad.toString().includes(lowerQuery)
  );

  renderizarTablaJornadas(jornadasFiltradas);
}

// Obtienes los datos de la API y los renderizas en la tabla.
async function fetchVentasAndJornadas() {
  try {
    console.log(dbConfigPipas)
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // Limpiar el tbody antes de añadir nuevos datos.

    let response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "journeys",
        connection: JSON.parse(dbConfigPipas), // Aquí irían los datos de conexión si son necesarios.
        journeysales: {
          step: 1,
          folio: 0,
          id: 0,
          readers: null,
        }
      }),
    });

    console.log(dbConfigPipas)

    let data = await response.json();

    console.log(data)

    if (data && data[0] && data[0].obj) {
      jornadasData = data[0].obj; // Guardar todas las jornadas
      console.log(jornadaData);
      renderizarTablaJornadas(jornadasData);
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
        connection: dbConfigPipas,
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
        connection: dbConfigPipas,
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
/**
 * Función que renderiza las jornadas en una tabla HTML.
 * @param {Array} jornadas - Arreglo de objetos de jornadas a renderizar.
 */
function renderizarTablaJornadas(jornadas) {
  // Seleccionamos el cuerpo de la tabla en el documento.
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  // Iteramos sobre cada jornada en el arreglo.
  jornadas.forEach((jornada) => {
    // Crear una fila (tr) para la jornada actual.
    let tr = document.createElement("tr");
    tr.id = `row${jornada.idJornada}`;
    tr.classList.add("table-row-expandable");

    // Establecer botones
    let botonEditar = `
      <a class="dropdown-item cursor-pointer btn-editar" data-jornada='${JSON.stringify(
      jornada
    )}'>
        <i class="fas fa-edit"></i> Editar
      </a>`;

    let botonCerrarJornada =
      jornada.Estatus === "ABI"
        ? `
          <a class="dropdown-item cursor-pointer btn-cerrar-jornada" data-jornada-id="${jornada.idJornada}">
            <i class="fas fa-times-circle"></i> Cerrar Jornada
          </a>`
        : "";

    let botonReplicaJornada =
      jornada.EstatusReplica === "1"
        ? `
          <a class="dropdown-item cursor-pointer btn-forzar-replica-jornada" data-jornada-id="${jornada.idJornada}">
            <i class="fas fa-sync-alt"></i> Forzar Réplica
          </a>`
        : "";

    // Separadores para los botones
    let separador1 =
      botonCerrarJornada !== "" && botonEditar !== ""
        ? `<div class="dropdown-divider"></div>`
        : "";
    let separador2 =
      botonReplicaJornada !== "" &&
        (botonCerrarJornada !== "" || botonEditar !== "")
        ? `<div class="dropdown-divider"></div>`
        : "";

    // Establecemos el contenido de la fila (tr) con los datos de la jornada y los botones.
    tr.innerHTML = `
      <td>${jornada.idJornada}</td>
      <td>${jornada.Folio}</td>
      <td>${jornada.idUnidad}</td>
      <td>${jornada.FechaEmision}</td>
      <td>${jornada.FechaCierre}</td>
      <td>${jornada.Estatus}</td>
      <td>${jornada.EstatusReplica}</td>
      <td>
        <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${jornada.idJornada}" aria-expanded="false" aria-controls="collapse${jornada.idJornada}">
          <i class="fas fa-eye"></i>
        </button>
      </td>
      <td>
        <!-- Menú desplegable de acciones -->
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton${jornada.idJornada}" data-bs-toggle="dropdown" aria-expanded="false">
            Acciones
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${jornada.idJornada}">
            ${botonEditar}
            ${separador1}
            ${botonCerrarJornada}
            ${separador2}
            ${botonReplicaJornada}
          </ul>
        </div>
      </td>`;

    // Añadimos la fila (tr) al cuerpo de la tabla.
    tbody.appendChild(tr);

    // Creamos una fila adicional para mostrar detalles (ventas) de la jornada cuando se expanda.
    let trCollapse = document.createElement("tr");
    trCollapse.innerHTML = `
      <td colspan="9">
        <div class="collapse" id="collapse${jornada.idJornada}">
          <div class="card card-body">
            ${renderizarTablaVentas(jornada.sales)}
          </div>
        </div>
      </td>`;

    // Añadimos la fila de detalles al cuerpo de la tabla.
    tbody.appendChild(trCollapse);
  });
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

/**
 * Función que renderiza las ventas en una tabla HTML.
 * @param {Array} ventas - Arreglo de objetos de ventas a renderizar.
 * @returns {string} - Retorna una cadena HTML que representa la tabla de ventas.
 */
function renderizarTablaVentas(ventas) {
  let tablaVentas = `
    <table class="table table-hover table-striped table-bordered table-ventas">
      <thead>
        <tr>
          <th>Folio Venta</th>
          <th>Volumen</th>
          <th>Precio</th>
          <th>Total Venta</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>Estatus Entrega</th>
          <th>Estatus Réplica</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>`;

  ventas.forEach((venta) => {
    // Botón de "Forzar Réplica"
    let botonForzarReplica =
      venta.EstatusReplica === "1"
        ? `
      <a class="dropdown-item cursor-pointer btn-forzar-replica-venta" data-venta-id="${venta.id}">
        <i class="fas fa-sync-alt"></i> Forzar Réplica
      </a>`
        : "";

    // Botones de "Detalle" y "Editar Venta"
    let botonDetalle = `
      <a class="dropdown-item cursor-pointer btn-detalle" data-venta='${JSON.stringify(
      venta
    )}'>
        <i class="fas fa-info-circle"></i> Detalle
      </a>`;
    let botonEditarVenta = `
      <a class="dropdown-item cursor-pointer btn-editar-venta" data-venta='${JSON.stringify(
      venta
    )}'>
        <i class="fas fa-edit"></i> Editar
      </a>`;

    // Separadores para los botones
    let separador1 =
      botonEditarVenta !== "" && botonDetalle !== ""
        ? `<div class="dropdown-divider"></div>`
        : "";
    let separador2 =
      botonForzarReplica !== "" &&
        (botonEditarVenta !== "" || botonDetalle !== "")
        ? `<div class="dropdown-divider"></div>`
        : "";

    // Acciones agrupadas en un dropdown
    let acciones = `
      <div class="btn-group">
        <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Acciones
        </button>
        <div class="dropdown-menu">
          ${botonDetalle}
          ${separador1}
          ${botonEditarVenta}
          ${separador2}
          ${botonForzarReplica}
        </div>
      </div>`;

    // Añadimos una fila por cada venta con sus datos y botones de acción.
    tablaVentas += `
      <tr>
        <td>${venta.FolioVenta}</td>
        <td>${venta.Volumen}</td>
        <td>${venta.Precio}</td>
        <td>${venta.TotalVenta}</td>
        <td>${venta.FechaInicio}</td>
        <td>${venta.FechaFin}</td>
        <td>${venta.estatusEntrega}</td>
        <td>${venta.EstatusReplica}</td>
        <td>${acciones}</td>
      </tr>`;
  });

  tablaVentas += `</tbody></table>`;

  return tablaVentas;
}

function renderizarDetalleVenta(venta) {
  // Aquí puedes formatear la información de la venta como un ticket
  console.log(venta);
  let detalleVenta = `
      <div class="container">
        <div class="row">
          <div class="col-md-8">
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
          </div>
          <div class="col-md-4">
              <div id="map" position: sticky; top: 20px;"></div>
          </div>
        </div>
      </div>
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

// CERRAR JORNADA
async function handleCerrarJornada(event) {
  const idJornada = event.target.getAttribute("data-jornada-id");

  if (!idJornada) return;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "journeys",
        connection: dbConfigPipas,
        journeysales: {
          step: 2,
          folio: 0,
          id: parseInt(idJornada, 10),
          readers: null,
        },
      }),
    });

    const data = await response.json();

    if (data && data[0] && data[0].response.id == 1) {
      Swal.fire({
        icon: "success",
        title: "Jornada cerrada con éxito!",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchVentasAndJornadas();
    } else {
      Swal.fire({
        icon: "error",
        title: "Hubo un error al cerrar la jornada.",
        text: data[0].response.message,
      });
    }
  } catch (error) {
    console.error("Error al cerrar la jornada", error);
    Swal.fire({
      icon: "error",
      title: "Hubo un error al cerrar la jornada.",
      text: "Por favor, inténtalo de nuevo más tarde.",
    });
  }
}

/**
 * Maneja el evento de forzar réplica en una jornada específica.
 * @param {Event} event - El evento de clic que dispara esta función.
 */
async function handleForzarReplicaJornada(event) {
  const idJornada = event.target.getAttribute("data-jornada-id");

  if (!idJornada) return;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "journeys",
        connection: dbConfigPipas,
        journeysales: {
          step: 3,
          folio: 0,
          id: parseInt(idJornada, 10),
          readers: null,
        },
      }),
    });

    const data = await response.json();

    if (data && data[0] && data[0].response.id == 1) {
      Swal.fire({
        icon: "success",
        title: "Réplica de jornada forzada con éxito!",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchVentasAndJornadas();
    } else {
      Swal.fire({
        icon: "error",
        title: "Hubo un error al forzar la réplica de jornada.",
        text: data[0].response.message,
      });
    }
  } catch (error) {
    console.error("Error al forzar la réplica de jornada", error);
    Swal.fire({
      icon: "error",
      title: "Hubo un error al forzar la réplica de jornada.",
      text: "Por favor, inténtalo de nuevo más tarde.",
    });
  }
}

/**
 * Maneja el evento de forzar réplica en una venta específica.
 * @param {Event} event - El evento de clic que dispara esta función.
 */
async function handleForzarReplicaVenta(event) {
  const idVenta = event.target.getAttribute("data-venta-id");

  if (!idVenta) return;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "sales", // Asumo que el modo sería 'sales', ajusta según tu API.
        connection: dbConfigPipas,
        journeysales: {
          step: 4,
          folio: 0,
          id: parseInt(idVenta, 10),
          readers: null,
        },
      }),
    });

    const data = await response.json();

    if (data && data[0] && data[0].response.id == 1) {
      Swal.fire({
        icon: "success",
        title: "Réplica de venta forzada con éxito!",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchVentasAndJornadas();
    } else {
      Swal.fire({
        icon: "error",
        title: "Hubo un error al forzar la réplica de venta.",
        text: data[0].response.message,
      });
    }
  } catch (error) {
    console.error("Error al forzar la réplica de venta", error);
    Swal.fire({
      icon: "error",
      title: "Hubo un error al forzar la réplica de venta.",
      text: "Por favor, inténtalo de nuevo más tarde.",
    });
  }
}

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

document.getElementById("kill-replica").addEventListener("click", function () {
  if (
    confirm("¿Estás seguro de que deseas matar la réplica de todas las ventas?")
  ) {
    // Llamar a la función o API que mata la réplica
    handleKillReplica();
  }
});

async function handleKillReplica() {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "journeys",
        connection: dbConfigPipas,
        journeysales: {
          step: 5,
          folio: 0,
          id: 0,
          readers: null,
        },
      }),
    });

    const data = await response.json();

    if (data && data[0] && data[0].response.id == 1) {
      Swal.fire({
        icon: "success",
        title: "Réplica de ventas eliminada con éxito!",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchVentasAndJornadas(); // Si es necesario volver a obtener los datos después de la acción
    } else {
      Swal.fire({
        icon: "error",
        title: "Hubo un error al eliminar la réplica de ventas.",
        text: data[0].response.message,
      });
    }
  } catch (error) {
    console.error("Error al eliminar la réplica de ventas", error);
    Swal.fire({
      icon: "error",
      title: "Hubo un error al eliminar la réplica de ventas.",
      text: "Por favor, inténtalo de nuevo más tarde.",
    });
  }
}

document
  .getElementById("initialize-readers")
  .addEventListener("click", function () {
    let readersValue = prompt(
      "Introduce el valor para inicializar las lecturas:",
      ""
    );
    if (readersValue) {
      // Llamar a la función o API para inicializar las lecturas con el valor proporcionado
      handleInitializeReaders(readersValue);
    }
  });

async function handleInitializeReaders(readersValue) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "journeys",
        connection: dbConfigPipas,
        journeysales: {
          step: 6,
          folio: 0,
          id: 0,
          readers: readersValue,
        },
      }),
    });

    const data = await response.json();

    if (data && data[0] && data[0].response.id == 1) {
      Swal.fire({
        icon: "success",
        title: "Lecturas inicializadas con éxito!",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchVentasAndJornadas(); // Si es necesario volver a obtener los datos después de la acción
    } else {
      Swal.fire({
        icon: "error",
        title: "Hubo un error al inicializar las lecturas.",
        text: data[0].response.message,
      });
    }
  } catch (error) {
    console.error("Error al inicializar las lecturas", error);
    Swal.fire({
      icon: "error",
      title: "Hubo un error al inicializar las lecturas.",
      text: "Por favor, inténtalo de nuevo más tarde.",
    });
  }
}

document.querySelector(".btn-regresar").addEventListener("click", function () {
  window.location.href = "panelDeControl.html";
});

document.addEventListener("click", (event) => {
  if (event.target.matches(".btn-cerrar-jornada")) {
    handleCerrarJornada(event);
  } else if (event.target.matches(".btn-forzar-replica-jornada")) {
    handleForzarReplicaJornada(event);
  } else if (event.target.matches(".btn-forzar-replica-venta")) {
    handleForzarReplicaVenta(event);
  }
});

document.getElementById("search-jornadas").addEventListener("input", (e) => {
  filtrarJornadas(e.target.value);
});

// Deberías envolver la llamada a tu función asíncrona dentro de otra función
// que se pasa como callback al event listener.
document.addEventListener("DOMContentLoaded", function() {
  fetchVentasAndJornadas().catch(console.error);
});