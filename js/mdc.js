const apiUrl = "http://172.168.200.144/ecosat/replicaventas/vistas/service.php";
const dbConfigServer = sessionStorage.getItem("dbConfigServer");
console.log("Recuperado de sessionStorage", dbConfigServer);

let mdcData = {}; // Variable para almacenar los datos del MDC

async function fetchMDCs() {
  try {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // Limpiar el tbody antes de añadir nuevos datos.

    console.log(dbConfigServer)


    let response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "mdcs",
        connection: JSON.parse(dbConfigServer), // Aquí irían los datos de conexión si son necesarios.
        mdc: {
          step: 1,
          id: 0,
        },
      }),
    });

    let data = await response.json();

    console.log(data)

    if (data && data.obj) {
      mdcsData = data.obj; // Guardar todos los MDCs
      renderizarTablaMDCs(mdcsData);
    }
  } catch (error) {
    console.error("Error al obtener los datos de MDCs", error);
  }
}

/**
 * Función que renderiza los MDCs en una tabla HTML.
 * @param {Array} mdcs - Arreglo de objetos de MDCs a renderizar.
 */
function renderizarTablaMDCs(mdcs) {
  const tbody = document.querySelector("tbody"); // Asegúrate de tener el ID correcto para tu tabla
  tbody.innerHTML = ""; // Limpiamos el cuerpo de la tabla primero.

  mdcs.forEach((mdc) => {
    let tr = document.createElement("tr");
    tr.classList.add("table-row-expandable");

    // Establecer botones
    let botonEditar = `
      <a class="dropdown-item cursor-pointer btn-editar-mdc" data-mdc='${JSON.stringify(mdc)}'>
        <i class="fas fa-edit"></i> Editar
      </a>`;

    // Menú desplegable de acciones
    let accionesDropdown = `
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuMDC${mdc.IdMDC}" data-bs-toggle="dropdown" aria-expanded="false">
          Acciones
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuMDC${mdc.IdMDC}">
          ${botonEditar}
        </ul>
      </div>`;

    // Añadir un botón para expandir y mostrar las unidades de recepción.
    let botonVerDetalle = `
      <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMDC${mdc.IdMDC}" aria-expanded="false" aria-controls="collapseMDC${mdc.IdMDC}">
        <i class="fas fa-eye"></i>
      </button>`;

    tr.innerHTML = `
    <td>${mdc.IdMDC}</td>
    <td>${mdc.IdUnidadEntrega}</td>
    <td>${mdc.mdc}</td>
    <td>${mdc.CodigoMDC}</td>
    <td>${mdc.unidadentrega}</td>
    <td>${botonVerDetalle}</td>
    <td>${accionesDropdown}</td>
  `;

    tbody.appendChild(tr);

    // Creamos una fila adicional que se expandirá para mostrar los detalles de las unidades de recepción.
    let trCollapse = document.createElement("tr");
    trCollapse.innerHTML = `
  <td colspan="9">
    <div class="collapse" id="collapseMDC${mdc.IdMDC}">
      <div class="card card-body">
        ${renderizarUnidadesRecepcion(mdc.unidadesrecepcion)}
      </div>
    </div>
  </td>`;

    // Añadimos la fila de detalles al cuerpo de la tabla.
    tbody.appendChild(trCollapse);

  });
}

/**
 * Función que renderiza las unidades de recepción en una tabla HTML.
 * @param {Array} unidadesRecepcion - Arreglo de objetos de unidades de recepción a renderizar.
 * @returns {string} - Retorna una cadena HTML que representa la tabla de unidades de recepción.
 */
function renderizarUnidadesRecepcion(unidadesRecepcion) {
  let tablaUnidadesRecepcion = `
    <table class="table table-hover table-striped table-bordered table-unidades-recepcion">
      <thead>
        <tr>
          <th>ID Unidad RecepciónVenta</th>
          <th>fk Unidad Recepción</th>
          <th>Esquema</th>
        </tr>
      </thead>
      <tbody>`;

  unidadesRecepcion.forEach((unidad) => {
    tablaUnidadesRecepcion += `
      <tr>
        <td>${unidad.IdUnidadRecepcionVenta}</td>
        <td>${unidad.fk_UnidadRecepcion}</td>
        <td>${unidad.Esquema}</td>
      </tr>`;
  });

  tablaUnidadesRecepcion += `</tbody></table>`;
  return tablaUnidadesRecepcion;
}

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

document.querySelector(".btn-regresar").addEventListener("click", function () {
  window.location.href = "panelDeControl.html";
});

// Deberías envolver la llamada a tu función asíncrona dentro de otra función
// que se pasa como callback al event listener.
// document.addEventListener("DOMContentLoaded", function() {
//   fetchMDCs().catch(console.error);
// });

document.addEventListener("DOMContentLoaded", function () {
  fetchMDCs().catch(console.error);
});

function safeText(value) {
  return value == null ? '' : value;
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-editar-mdc")) {
    mdcData = JSON.parse(e.target.dataset.mdc); // Almacena los datos en jornadaData
    console.log(e.target.dataset);

    document.getElementById("idMdc").value = safeText(mdcData.IdMDC);
    document.getElementById("idUnit").value = safeText(mdcData.IdUnidadEntrega);
    document.getElementById("idMass").value = safeText(mdcData.IdMass);
    document.getElementById("description").value = safeText(mdcData.mdc);
    document.getElementById("code").value = safeText(mdcData.CodigoMDC);
    document.getElementById("company").value = safeText(mdcData.company);
    document.getElementById("port").value = safeText(mdcData.port);
    // Puedes continuar configurando otros campos aquí, si los necesitas.

    const myModal = new bootstrap.Modal(
      document.getElementById("editarMdcModal")
    );
    myModal.show();
  }
});

// editar jornada
document
  .getElementById("editarMdcForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    handleFormSubmissionMDCS(); // Llama a la función async
  });

async function handleFormSubmissionMDCS() {
  // Obtén los valores actualizados del formulario
  const idMdc = document.getElementById("idMdc").value;
  const idUnit = document.getElementById("idUnit").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const company = document.getElementById("company").value || ""; // Valor por defecto si está vacío
  const idMass = document.getElementById("idMass").value || 0; // Valor por defecto si está vacío
  const port = document.getElementById("port").value || "/dev/ttyUSB0"; // Valor por defecto si está vacío

  let updatedData = {
    step: 2,
    idMdc: idMdc,
    idUnit: idUnit,
    description: description,
    code: code,
    company: company,
    idMass: idMass,
    port: port
  }

  console.log(updatedData);

  try {
    let response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "setunits",
        connection: JSON.parse(sessionStorage.getItem("dbConfigPipas")),
        loadunit: updatedData,
      }),
    });

    let data = await response.json();

    console.log(JSON.stringify(data))

    if (data && data[0] && data[0].response.id == 1) {
      showSweetAlert("MDC actualizado con éxito!", "success");
      // Ocultar el modal usando Bootstrap 5
      const myModalEl = document.getElementById("editarMdcModal");
      const modal = bootstrap.Modal.getInstance(myModalEl);
      modal.hide();

      fetchMDCs();
    } else {
      showSweetAlert("Hubo un error al actualizar el MDC.", "danger");
    }
  } catch (error) {
    console.error("Error al actualizar el mdc", error);
    showSweetAlert("Hubo un error inesperado.", "danger");
  }
}