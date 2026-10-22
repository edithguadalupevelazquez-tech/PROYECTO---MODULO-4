/* =========================================
   MI CUENTA
   Sistema de Gestión Bancaria v0.8.0
========================================= */

// Servicio de autenticación
import { authService } from "../services/AuthService.js";

// Servicio bancario
import { bancoService } from "../services/BancoService.js";

// Formateadores
import {
  formatCurrency,
  formatDate,
  formatAccountNumber,
} from "../utils/formatters.js";

/* =========================================
   CERRAR SESIÓN
   Sistema de Gestión Bancaria v0.8.0
========================================= */

function initLogout() {
  // Buscar el botón Cerrar sesión
  const btn = document.querySelector("#logoutBtn");

  // Si el botón no existe, detener la función
  if (!btn) {
    return;
  }

  // Escuchar cuando el usuario haga clic
  btn.addEventListener("click", async () => {
    // Solicitar confirmación
    const resultado = await Swal.fire({
      icon: "question",
      title: "Cerrar sesión",
      text: "¿Seguro que deseas salir?",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    });

    // Si el usuario cancela, no cerrar sesión
    if (!resultado.isConfirmed) {
      return;
    }

    // Eliminar la sesión de LocalStorage
    authService.logout();

    // Regresar a la pantalla de inicio
    window.location.href = "./index.html";
  });
}

/* =========================================
   RENDERIZAR MI CUENTA
   Sistema de Gestión Bancaria v0.8.0
========================================= */

function renderCuenta(usuario, cuenta) {
  // Buscar el contenedor principal
  const root = document.querySelector("#cuentaRoot");

  // Comprobar que existan los datos necesarios
  if (!root || !usuario || !cuenta) {
    return;
  }

  /* =========================================
     CONSTRUIR INTERFAZ
  ========================================= */

  root.innerHTML = `
    <section class="cuenta-layout">

      <!-- TARJETA BANCARIA -->
      <article class="cuenta-card">

        <header class="cuenta-card-header">
          <div>
            <h2 id="cuentaTitular"></h2>

            <p class="cuenta-meta">
              Titular de la cuenta
            </p>
          </div>

          <span
            class="badge ${cuenta.activa ? "badge-success" : "badge-danger"}"
          >
            ${cuenta.activa ? "Activa" : "Inactiva"}
          </span>
        </header>

        <!-- DATOS BANCARIOS -->
        <section class="cuenta-detalle">
          <p>
            <strong>Número de cuenta:</strong>
            <span id="detalleNumeroCuenta"></span>
          </p>

          <p>
            <strong>Tipo:</strong>
            <span id="detalleTipoCuenta"></span>
          </p>

          <p>
            <strong>Saldo actual:</strong>
            <span id="detalleSaldoCuenta"></span>
          </p>

          <p>
            <strong>Fecha de apertura:</strong>
            <span id="detalleFechaApertura"></span>
          </p>
        </section>

      </article>

      <!-- PANEL DE CONFIGURACIÓN -->
      <section class="cuenta-panel">

        <article class="cuenta-section">
          <h3>Información personal</h3>

          <form
            id="formInfoPersonal"
            class="cuenta-form"
            novalidate
          >

            <div class="form-group">
              <label for="infoNombre">
                Nombre completo
              </label>

              <input
                type="text"
                id="infoNombre"
                autocomplete="name"
              />

              <p
                class="field-error"
                data-error-for="infoNombre"
              ></p>
            </div>

            <div class="form-group">
              <label for="infoEmail">
                Correo electrónico
              </label>

              <input
                type="email"
                id="infoEmail"
                autocomplete="email"
              />

              <p
                class="field-error"
                data-error-for="infoEmail"
              ></p>
            </div>

            <div class="form-group">
              <label for="infoTelefono">
                Teléfono
              </label>

              <input
                type="tel"
                id="infoTelefono"
                autocomplete="tel"
              />

              <p
                class="field-error"
                data-error-for="infoTelefono"
              ></p>
            </div>

            <button
              type="submit"
              class="btn btn-primary"
            >
              Guardar cambios
            </button>

          </form>
        </article>

<!-- FORMULARIO DE SEGURIDAD -->
<article class="cuenta-section">
  <h3>Seguridad</h3>

  <form
    id="formSeguridad"
    class="cuenta-form"
    novalidate
  >

<input
  type="email"
  id="segUsername"
  name="username"
  autocomplete="username"
  class="visually-hidden"
  tabindex="-1"
  readonly
/>

    <div class="form-group">
      <label for="segPasswordActual">
        Contraseña actual
      </label>

      <input
        type="password"
        id="segPasswordActual"
        autocomplete="current-password"
      />

      <p
        class="field-error"
        data-error-for="segPasswordActual"
      ></p>
    </div>

    <div class="form-group">
      <label for="segPasswordNueva">
        Nueva contraseña
      </label>

      <input
        type="password"
        id="segPasswordNueva"
        autocomplete="new-password"
      />

      <p
        class="field-error"
        data-error-for="segPasswordNueva"
      ></p>
    </div>

    <div class="form-group">
      <label for="segPasswordConfirmar">
        Confirmar nueva contraseña
      </label>

      <input
        type="password"
        id="segPasswordConfirmar"
        autocomplete="new-password"
      />

      <p
        class="field-error"
        data-error-for="segPasswordConfirmar"
      ></p>
    </div>

    <button
      type="submit"
      class="btn btn-primary"
    >
      Cambiar contraseña
    </button>
  </form>
</article>

<!-- ZONA DE ELIMINACIÓN DE CUENTA -->
<article class="cuenta-section cuenta-section-danger">

  <h3>Zona peligrosa</h3>

  <p class="cuenta-warning">
    Eliminar tu cuenta es una acción irreversible.
  </p>

  <button
    type="button"
    id="btnEliminarCuenta"
    class="btn btn-danger"
  >
    Eliminar mi cuenta
  </button>

</article>



      </section>

    </section>
  `;

  /* =========================================
     MOSTRAR INFORMACIÓN BANCARIA
  ========================================= */

  // Mostrar el nombre del titular
  root.querySelector("#cuentaTitular").textContent = usuario.nombre;

  // Mostrar el número de cuenta
  root.querySelector("#detalleNumeroCuenta").textContent = formatAccountNumber(
    cuenta.numeroCuenta,
  );

  // Mostrar el tipo de cuenta
  root.querySelector("#detalleTipoCuenta").textContent =
    cuenta.tipo || "No especificado";

  // Mostrar el saldo
  root.querySelector("#detalleSaldoCuenta").textContent = formatCurrency(
    cuenta.saldo,
  );

  // Mostrar la fecha de apertura
  root.querySelector("#detalleFechaApertura").textContent = cuenta.fechaApertura
    ? formatDate(cuenta.fechaApertura)
    : "No disponible";

  /* =========================================
     CARGAR INFORMACIÓN PERSONAL
  ========================================= */

  root.querySelector("#infoNombre").value = usuario.nombre || "";

  root.querySelector("#infoEmail").value = usuario.email || "";
  root.querySelector("#segUsername").value = usuario.email || "";

  root.querySelector("#infoTelefono").value = usuario.telefono || "";
  // Conectar los eventos después de crear los formularios
  inicializarFormulariosCuenta(usuario, cuenta);
} // Cierra renderCuenta()

/* =========================================
   EVENTOS DE MI CUENTA
   Sistema de Gestión Bancaria v0.8.0
========================================= */

function inicializarFormulariosCuenta(usuario, cuenta) {
  // Buscar los formularios y el botón
  const formInfo = document.querySelector("#formInfoPersonal");

  const formSeguridad = document.querySelector("#formSeguridad");

  const btnEliminar = document.querySelector("#btnEliminarCuenta");

  /* =========================================
     EVENTO DE INFORMACIÓN PERSONAL
  ========================================= */

  if (formInfo) {
    formInfo.addEventListener("submit", (event) => {
      manejarActualizarInfo(event, usuario);
    });
  }

  /* =========================================
     EVENTO DE SEGURIDAD
  ========================================= */

  if (formSeguridad) {
    formSeguridad.addEventListener("submit", (event) => {
      manejarCambiarPassword(event, usuario);
    });
  }

  /* =========================================
     EVENTO DE ELIMINACIÓN
  ========================================= */

  if (btnEliminar) {
    btnEliminar.addEventListener("click", () => {
      manejarEliminarCuenta(usuario, cuenta);
    });
  }
} // Cierra inicializarFormulariosCuenta()

/* =========================================
   MOSTRAR ERROR DE CAMPO
========================================= */

function mostrarError(campoId, mensaje) {
  // Buscar el elemento destinado al error
  const elemento = document.querySelector(`[data-error-for="${campoId}"]`);

  // Mostrar el mensaje si existe el elemento
  if (elemento) {
    elemento.textContent = mensaje;
  }
} // Cierra mostrarError()

/* =========================================
   LIMPIAR ERRORES DE FORMULARIOS
========================================= */

function limpiarErroresCuenta() {
  // Buscar todos los mensajes de error
  const elementos = document.querySelectorAll(".field-error");

  // Limpiar cada mensaje
  elementos.forEach((elemento) => {
    elemento.textContent = "";
  });
} // Cierra limpiarErroresCuenta()

/* =========================================
   ACTUALIZAR INFORMACIÓN PERSONAL
   Sistema de Gestión Bancaria v0.8.0
========================================= */

async function manejarActualizarInfo(event, usuario) {
  // Evitar que el formulario recargue la página
  event.preventDefault();

  // Limpiar mensajes de error anteriores
  limpiarErroresCuenta();

  // Obtener los valores del formulario
  const nombre = document.querySelector("#infoNombre").value.trim();

  const email = document.querySelector("#infoEmail").value.trim().toLowerCase();

  const telefono = document.querySelector("#infoTelefono").value.trim();

  /* =========================================
     VALIDAR CAMPOS OBLIGATORIOS
  ========================================= */

  if (!nombre) {
    mostrarError("infoNombre", "El nombre es obligatorio.");
    return;
  }

  if (!email) {
    mostrarError("infoEmail", "El correo es obligatorio.");
    return;
  }

  /* =========================================
     VALIDAR FORMATO DEL CORREO
  ========================================= */

  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formatoEmail.test(email)) {
    mostrarError("infoEmail", "Ingresa un correo válido.");
    return;
  }

  /* =========================================
     GUARDAR INFORMACIÓN PERSONAL
  ========================================= */

  try {
    // Actualizar el usuario mediante BancoService
    const usuarioActualizado = bancoService.actualizarUsuario(usuario.id, {
      nombre,
      email,
      telefono,
    });

    // Actualizar el nombre visible en la tarjeta
    document.querySelector("#cuentaTitular").textContent =
      usuarioActualizado.nombre;

    // Confirmar que los cambios se guardaron
    await Swal.fire({
      icon: "success",
      title: "Información actualizada",
      text: "Tus datos personales se guardaron correctamente.",
    });
  } catch (error) {
    // Mostrar el error sin perder los datos del formulario
    await Swal.fire({
      icon: "error",
      title: "No fue posible actualizar la información",
      text: error.message,
    });
  }
}

/* =========================================
   CAMBIAR CONTRASEÑA
   Sistema de Gestión Bancaria v0.8.0
========================================= */

async function manejarCambiarPassword(event, usuario) {
  // Evitar que el formulario recargue la página
  event.preventDefault();

  // Limpiar errores anteriores
  limpiarErroresCuenta();

  // Obtener los valores de los campos
  const passwordActual = document.querySelector("#segPasswordActual").value;

  const passwordNueva = document.querySelector("#segPasswordNueva").value;

  const passwordConfirmar = document.querySelector(
    "#segPasswordConfirmar",
  ).value;

  /* =========================================
     VALIDAR CAMPOS
  ========================================= */

  if (!passwordActual) {
    mostrarError("segPasswordActual", "Ingresa tu contraseña actual.");
    return;
  }

  if (passwordNueva.length < 6) {
    mostrarError(
      "segPasswordNueva",
      "La nueva contraseña debe tener al menos 6 caracteres.",
    );
    return;
  }

  if (passwordNueva !== passwordConfirmar) {
    mostrarError("segPasswordConfirmar", "Las contraseñas no coinciden.");
    return;
  }

  /* =========================================
     ACTUALIZAR CONTRASEÑA
  ========================================= */

  try {
    // Solicitar el cambio a BancoService
    bancoService.cambiarPassword(usuario.id, passwordActual, passwordNueva);

    // Limpiar los campos después del cambio exitoso
    event.target.reset();

    // Mostrar confirmación
    await Swal.fire({
      icon: "success",
      title: "Contraseña actualizada",
      text: "Tu contraseña se cambió correctamente.",
    });
  } catch (error) {
    // Mostrar el error devuelto por BancoService
    await Swal.fire({
      icon: "error",
      title: "No fue posible cambiar la contraseña",
      text: error.message,
    });
  }
}

/* =========================================
   ELIMINAR CUENTA
   Sistema de Gestión Bancaria v0.8.0
========================================= */

async function manejarEliminarCuenta(usuario, cuenta) {
  // Solicitar confirmación antes de eliminar
  const resultado = await Swal.fire({
    icon: "warning",
    title: "Eliminar mi cuenta",
    text: "Esta acción eliminará tu usuario y sus cuentas ficticias. No se puede deshacer.",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
  });

  // Si el usuario cancela, no hacer nada
  if (!resultado.isConfirmed) {
    return;
  }

  /* =========================================
     SEGUNDA CONFIRMACIÓN
     Sistema de Gestión Bancaria v0.8.0
  ========================================= */

  const segundaConfirmacion = await Swal.fire({
    icon: "warning",
    title: "Confirmación final",
    text: "Escribe ELIMINAR para confirmar la operación.",
    input: "text",
    inputPlaceholder: "ELIMINAR",
    showCancelButton: true,
    confirmButtonText: "Confirmar eliminación",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",

    inputValidator: (valor) => {
      if (valor !== "ELIMINAR") {
        return "Debes escribir exactamente ELIMINAR.";
      }
    },
  });

  // Si cancela la segunda confirmación, detener
  if (!segundaConfirmacion.isConfirmed) {
    return;
  }

  /* =========================================
     VERIFICACIÓN FINAL DEL USUARIO
  ========================================= */

  // Consultar nuevamente la sesión activa
  const usuarioActual = authService.getCurrentUser();

  /* =========================================
     VERIFICAR USUARIO AUTENTICADO
     Sistema de Gestión Bancaria v0.8.0
  ========================================= */

  // Comprobar que la sesión corresponda al usuario
  if (!usuarioActual || usuarioActual.id !== usuario.id) {
    await Swal.fire({
      icon: "error",
      title: "Operación cancelada",
      text: "La sesión no corresponde al usuario seleccionado.",
    });

    return;
  }

  /* =========================================
     ELIMINAR USUARIO FICTICIO
     Sistema de Gestión Bancaria v0.8.0
  ========================================= */

  try {
    // Ejecutar la eliminación desde BancoService
    const eliminado = bancoService.eliminarUsuario(usuarioActual.id);

    if (!eliminado) {
      throw new Error("No se confirmó la eliminación.");
    }

    // Cerrar la sesión del usuario eliminado
    authService.logout();

    // Mostrar confirmación
    await Swal.fire({
      icon: "success",
      title: "Cuenta eliminada",
      text: "El usuario ficticio se eliminó correctamente.",
      confirmButtonText: "Aceptar",
    });

    // Regresar al inicio
    window.location.href = "./index.html";
  } catch (error) {
    console.error("Error al eliminar usuario:", error);

    await Swal.fire({
      icon: "error",
      title: "No fue posible eliminar la cuenta",
      text: error.message,
    });
  }
}
/* =========================================
   INICIALIZAR MI CUENTA
   Sistema de Gestión Bancaria v0.8.0
========================================= */

function initCuenta() {
  // Comprobar que exista una sesión activa
  if (!authService.protegerRuta()) {
    return;
  }

  // Obtener el usuario autenticado
  const usuario = authService.getCurrentUser();

  if (!usuario) {
    return;
  }

  try {
    // Recuperar la información bancaria más reciente
    bancoService.recargarBanco();

    // Obtener las cuentas del usuario
    const datos = bancoService.obtenerDatosUsuario(usuario.id);

    // Seleccionar la cuenta principal
    const cuentaPrincipal = datos.cuentas[0] || null;

    // Comprobar que exista una cuenta bancaria
    if (!cuentaPrincipal) {
      throw new Error("No se encontró una cuenta bancaria.");
    }

    // Mostrar la información en pantalla
    renderCuenta(datos.usuario, cuentaPrincipal);

    // Conectar el botón Cerrar sesión
    initLogout();

    console.log("Mi cuenta v0.8.0 inicializada.");
  } catch (error) {
    console.error("Error al cargar Mi cuenta:", error);

    Swal.fire({
      icon: "error",
      title: "No fue posible cargar Mi cuenta",
      text: error.message,
    });
  }
}

// Iniciar la página
initCuenta();
