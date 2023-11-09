const apiUrl = "http://192.168.200.144/ecosat/replicaventas/vistas/service.php";
const dbConfigServer = sessionStorage.getItem("dbConfigServer");
console.log("Recuperado de sessionStorage", dbConfigServer);

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