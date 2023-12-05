const apiUrl = "http://localhost/ecosat/pipasetupweb/vistas/service.php";
const dbConfigServer = sessionStorage.getItem("dbConfigServer");
const dbConfigPipas = sessionStorage.getItem("dbConfigPipas");
console.log("Recuperado de sessionStorage - dbConfigServer: ", dbConfigServer);
console.log("Recuperado de sessionStorage - dbConfigPipas: ", dbConfigPipas);

let schemasData = {}; // Variable para almacenar los datos de los schemas

async function fetchSchemas() {
  try {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // Limpiar el tbody antes de añadir nuevos datos.

    console.log(dbConfigPipas)


    let response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "schemas",
        connection: JSON.parse(dbConfigPipas), // Aquí irían los datos de conexión si son necesarios.
        schema: {
          step: 1,
          id: 0,
          value: 0
        }
      }),
    });

    let data = await response.json();

    console.log(data[0]);

    if (data[0]) {
      schemasData = data[0]?.obj; // Guardar todos los Schemas
      console.log(schemasData);

      renderizarTablaSchemas(schemasData);
    }
  } catch (error) {
    console.error("Error al obtener los datos de Schemas", error);
  }
}

/**
 * Función que renderiza los SCHEMAS en una tabla HTML.
 * @param {Array} schemas - Arreglo de objetos de Schemas a renderizar.
 */
function renderizarTablaSchemas(schemas) {
  const tbody = document.querySelector("tbody"); // Asegúrate de tener el ID correcto para tu tabla
  tbody.innerHTML = ""; // Limpiamos el cuerpo de la tabla primero.

  schemas.forEach((schema) => {
    let tr = document.createElement("tr");
    tr.classList.add("table-row-expandable");

    // Establecer botones
    let botonEditar = `
      <a class="dropdown-item cursor-pointer btn-editar-schema" data-schema='${JSON.stringify(schema)}'>
        <i class="fas fa-edit"></i> Editar
      </a>`;

    // Menú desplegable de acciones
    let accionesDropdown = `
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuSchema${schema.cuenta}" data-bs-toggle="dropdown" aria-expanded="false">
          Acciones
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuSchema${schema.cuenta}">
          ${botonEditar}
        </ul>
      </div>`;

    // Añadir un botón para expandir y mostrar las unidades de recepción.
    let botonVerDetalle = `
      <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSCHEMA${schema.cuenta}" aria-expanded="false" aria-controls="collapseSCHEMA${schema.cuenta}">
        <i class="fas fa-eye"></i>
      </button>`;

    tr.innerHTML = `
    <td>${schema.cuenta}</td>
    <td>${schema.Esquema}</td>
    <td>${accionesDropdown}</td>
  `;

    tbody.appendChild(tr);

  });
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

function safeText(value) {
  return value == null ? '' : value;
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-editar-schema")) {
    schemasData = JSON.parse(e.target.dataset.schema); // Almacena los datos en jornadaData
    console.log(e.target.dataset);

    document.getElementById("cuenta").value = safeText(schemasData.cuenta);
    document.getElementById("schema").value = safeText(schemasData.Esquema);
    // Puedes continuar configurando otros campos aquí, si los necesitas.

    const myModal = new bootstrap.Modal(
      document.getElementById("editarSchemaModal")
    );
    myModal.show();
  }
});

// editar schema
document
  .getElementById("editarSchemaForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    handleFormSubmissionSchema(); // Llama a la función async
  });

async function handleFormSubmissionSchema() {
  // Obtén los valores actualizados del formulario
  const cuenta = document.getElementById("cuenta").value;
  const schema = document.getElementById("schema").value;

  let updatedData = {
    step: 2,
    id: cuenta,
    value: schema,
  }

  console.log(updatedData);

  try {
    let response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "schemas",
        connection: JSON.parse(sessionStorage.getItem("dbConfigPipas")),
        schema: updatedData,
      }),
    });

    let data = await response.json();

    console.log(JSON.stringify(data))

    if (data && data[0] && data[0].response.id == 1) {
      showSweetAlert("Schema actualizado con éxito!", "success");
      // Ocultar el modal usando Bootstrap 5
      const myModalEl = document.getElementById("editarSchemaModal");
      const modal = bootstrap.Modal.getInstance(myModalEl);
      modal.hide();

      fetchSchemas();
    } else {
      showSweetAlert("Hubo un error al actualizar el Schema.", "danger");
    }
  } catch (error) {
    console.error("Error al actualizar el schema", error);
    showSweetAlert("Hubo un error inesperado.", "danger");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetchSchemas().catch(console.error);
});

