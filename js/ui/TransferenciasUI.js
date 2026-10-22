/* =========================================
   INTERFAZ DE TRANSFERENCIAS
   Sistema de Gestión Bancaria v0.9.0
========================================= */

// Servicio de autenticación
import { authService } from "../services/AuthService.js";

// Servicio bancario
import { bancoService } from "../services/BancoService.js";

// Funciones para mostrar importes y cuentas
import { formatCurrency, formatAccountNumber } from "../utils/formatters.js";

import { validarMontoMonetario } from "../utils/validators.js";

/* =========================================
   CERRAR SESIÓN
   Sistema de Gestión Bancaria v0.9.0
========================================= */

function initLogout() {
  // Buscar el botón Cerrar sesión
  const btn = document.querySelector("#logoutBtn");

  // Si el botón no existe, detener la función
  if (!btn) {
    return;
  }

  // Escuchar cuando el usuario presiona el botón
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

    // Si cancela, no cerrar la sesión
    if (!resultado.isConfirmed) {
      return;
    }

    // Eliminar la sesión activa
    authService.logout();

    // Regresar a la página de inicio
    window.location.href = "./index.html";
  });
} // Cierra initLogout()

/* =========================================
   RENDERIZAR FORMULARIO DE TRANSFERENCIAS
   Sistema de Gestión Bancaria v0.9.0
========================================= */

function renderFormulario(usuario, cuentas) {
  // Buscar el contenedor principal
  const root = document.querySelector("#transferenciaRoot");

  // Si no existe, detener la función
  if (!root) {
    return;
  }

  // Seleccionar la primera cuenta como principal
  const cuentaPrincipal =
    cuentas.find((cuenta) => cuenta.activa === true) || null;

  // Comprobar que exista una cuenta

  // Comprobar que exista una cuenta activa
  if (!cuentaPrincipal) {
    root.innerHTML = `
      <section class="transferencia-card">
        <h2>No tienes cuentas disponibles.</h2>
        <p>
          Necesitas una cuenta activa para realizar operaciones.
        </p>
      </section>
    `;

    return;
  }

  /* =========================================
     MOSTRAR ENCABEZADO Y SALDO
     Sistema de Gestión Bancaria v0.9.0
  ========================================= */

  /* =========================================
     PREPARAR OPCIONES DE CUENTAS
     Sistema de Gestión Bancaria v0.9.0
  ========================================= */

  // Crear una opción por cada cuenta del usuario
  const opcionesCuentas = cuentas
    .filter((cuenta) => cuenta.activa !== false)
    .map((cuenta) => {
      const numero = formatAccountNumber(cuenta.numeroCuenta);
      const saldo = formatCurrency(cuenta.saldo);

      return `
        <option value="${cuenta.id}">
          ${numero} - ${saldo}
        </option>
      `;
    })
    .join("");

  // Construir el encabezado de operaciones
  root.innerHTML = `
    <section class="transferencia-header">
      <div>
        <span class="dashboard-label">
          Operaciones bancarias
        </span>

        <h2>Transferir dinero</h2>

        <p>
          Realiza transferencias entre cuentas registradas.
        </p>
      </div>

      <article class="saldo-disponible">
        <span>Saldo disponible</span>

        <strong id="saldoActual">
          ${formatCurrency(cuentaPrincipal.saldo)}
        </strong>
      </article>

    </section>

    <!-- =========================================
         FORMULARIO DE TRANSFERENCIA
    ========================================= -->

    <section class="operaciones-grid">
      <article class="transferencia-card">
        <h3>Nueva transferencia</h3>

        <form id="formTransferencia" novalidate>
          <div class="form-group">
            <label for="transferCuentaOrigen">
              Cuenta origen
            </label>

            <select
              id="transferCuentaOrigen"
              name="cuentaOrigen"
              required
            >
              ${opcionesCuentas}
            </select>
          </div>

          <!-- =========================================
               CUENTA DESTINO
          ========================================= -->

          <div class="form-group">
            <label for="transferCuentaDestino">
              Número de cuenta destino
            </label>

            <input
              type="text"
              id="transferCuentaDestino"
              name="cuentaDestino"
              placeholder="Ejemplo: 123456789012"
              inputmode="numeric"
              autocomplete="off"
              required
            />
          </div>


          <!-- =========================================
               MONTO DE TRANSFERENCIA
          ========================================= -->

          <div class="form-group">
            <label for="transferMonto">
              Monto a transferir
            </label>

            <input
              type="number"
              id="transferMonto"
              name="monto"
              placeholder="Ejemplo: 300"
              min="0.01"
              step="0.01"
              inputmode="decimal"
              required
            />
          </div>

          <!-- =========================================
               DESCRIPCIÓN DE TRANSFERENCIA
          ========================================= -->

          <div class="form-group">
            <label for="transferDescripcion">
              Descripción (opcional)
            </label>

            <input
              type="text"
              id="transferDescripcion"
              name="descripcion"
              placeholder="Ejemplo: Pago ficticio"
              maxlength="100"
            />
          </div>

          <!-- =========================================
               BOTÓN DE TRANSFERENCIA
          ========================================= -->

          <button
            type="submit"
            id="btnTransferir"
            class="btn btn-primary"
          >
            Transferir dinero
          </button>

          <p class="operation-help">
            Las transferencias utilizan dinero ficticio.
          </p>

        </form>
      </article>

      <!-- =========================================
           FORMULARIO DE DEPÓSITO
           Sistema de Gestión Bancaria v0.9.0
      ========================================= -->

      <article class="transferencia-card">
        <h3>Realizar depósito</h3>

        <p class="operation-help">
          Agrega dinero ficticio a una de tus cuentas.
        </p>

        <form id="formDeposito" novalidate>

          <div class="form-group">
            <label for="depositoCuenta">
              Cuenta de depósito
            </label>

            <select
              id="depositoCuenta"
              name="cuentaId"
              required
            >
              ${opcionesCuentas}
            </select>
          </div>

          <div class="form-group">
            <label for="depositoMonto">
              Monto a depositar
            </label>

            <input
              type="number"
              id="depositoMonto"
              name="monto"
              placeholder="Ejemplo: 500"
              min="0.01"
              step="0.01"
              inputmode="decimal"
              required
            />
          </div>

          <div class="form-group">
            <label for="depositoDescripcion">
              Descripción (opcional)
            </label>

            <input
              type="text"
              id="depositoDescripcion"
              name="descripcion"
              placeholder="Ejemplo: Depósito ficticio"
              maxlength="100"
            />
          </div>

          <button
            type="submit"
            id="btnDepositar"
            class="btn btn-primary"
          >
            Realizar depósito
          </button>

        </form>
      </article>

    </section>
  `;
} // Cierra renderFormulario()

/* =========================================
   MANEJAR FORMULARIO DE TRANSFERENCIA
   Sistema de Gestión Bancaria v0.9.0
========================================= */
// Impedir transferencias simultáneas
let transferenciaEnProceso = false;

async function manejarTransferencia(event) {
  // Evitar que el navegador recargue la página
  event.preventDefault();

  // Impedir envíos simultáneos
  if (transferenciaEnProceso) {
    return;
  }

  // Bloquear mientras se valida y confirma
  transferenciaEnProceso = true;

  try {
    await procesarTransferencia();
  } finally {
    transferenciaEnProceso = false;
  }
}

// Ejecutar las validaciones y la transferencia
async function procesarTransferencia() {
  // Obtener los campos del formulario
  const cuentaOrigenId = document.querySelector("#transferCuentaOrigen")?.value;

  const numeroCuentaDestino = document
    .querySelector("#transferCuentaDestino")
    ?.value.trim();

  const monto = document.querySelector("#transferMonto")?.value;

  const descripcion =
    document.querySelector("#transferDescripcion")?.value.trim() || "";

  // Validar que se haya seleccionado una cuenta origen
  if (!cuentaOrigenId) {
    await Swal.fire({
      icon: "error",
      title: "Cuenta origen obligatoria",
      text: "Selecciona una cuenta para transferir.",
    });

    return;
  }

  // Validar que se haya ingresado una cuenta destino
  if (!numeroCuentaDestino) {
    await Swal.fire({
      icon: "error",
      title: "Cuenta destino obligatoria",
      text: "Ingresa el número de cuenta destino.",
    });

    return;
  }

  /* =========================================
     VALIDAR MONTO MONETARIO
     Sistema de Gestión Bancaria v0.9.0
  ========================================= */

  // Utilizar la misma validación que el modelo bancario
  if (!validarMontoMonetario(monto)) {
    await Swal.fire({
      icon: "error",
      title: "Monto inválido",
      text: "Ingresa un monto positivo con máximo dos decimales.",
    });

    return;
  }

  // Convertir el monto validado a número
  const montoNumerico = Number(monto);

  /* =========================================
     VALIDAR NÚMERO DE CUENTA DESTINO
     Sistema de Gestión Bancaria v0.9.0
  ========================================= */

  // Eliminar espacios del número de cuenta
  const destinoNormalizado = numeroCuentaDestino.replace(/\s/g, "");

  // Aceptar únicamente entre 10 y 18 dígitos
  const formatoCuenta = /^\d{10,18}$/;

  if (!formatoCuenta.test(destinoNormalizado)) {
    await Swal.fire({
      icon: "error",
      title: "Cuenta destino inválida",
      text: "Ingresa un número de cuenta de 10 a 18 dígitos.",
    });

    return;
  }

  /* =========================================
     EVITAR TRANSFERENCIA A LA MISMA CUENTA
     Sistema de Gestión Bancaria v0.9.0
  ========================================= */

  // Obtener los datos bancarios del usuario autenticado
  const usuarioActual = authService.getCurrentUser();

  if (!usuarioActual) {
    await Swal.fire({
      icon: "error",
      title: "Sesión no disponible",
      text: "Debes iniciar sesión nuevamente.",
    });

    return;
  }

  // Recuperar las cuentas del usuario
  const datos = bancoService.obtenerDatosUsuario(usuarioActual.id);

  // Buscar la cuenta origen seleccionada
  const cuentaOrigen = datos.cuentas.find(
    (cuenta) => cuenta.id === cuentaOrigenId,
  );

  if (!cuentaOrigen) {
    await Swal.fire({
      icon: "error",
      title: "Cuenta origen inválida",
      text: "La cuenta seleccionada no está disponible.",
    });

    return;
  }

  // Comparar los números de cuenta
  const numeroOrigen = String(cuentaOrigen.numeroCuenta).replace(/\s/g, "");

  if (numeroOrigen === destinoNormalizado) {
    await Swal.fire({
      icon: "error",
      title: "Transferencia no permitida",
      text: "No puedes transferir dinero a la misma cuenta.",
    });

    return;
  }

  /* =========================================
     VALIDAR SALDO DISPONIBLE
     Sistema de Gestión Bancaria v0.9.0
  ========================================= */

  // Convertir el saldo de la cuenta origen a número
  const saldoDisponible = Number(cuentaOrigen.saldo);

  // Comprobar que el saldo sea válido
  if (!Number.isFinite(saldoDisponible) || saldoDisponible < 0) {
    await Swal.fire({
      icon: "error",
      title: "Saldo inválido",
      text: "No fue posible validar el saldo disponible.",
    });

    return;
  }

  // Comprobar que exista saldo suficiente
  if (saldoDisponible < montoNumerico) {
    await Swal.fire({
      icon: "error",
      title: "Saldo insuficiente",
      text: "No tienes saldo suficiente para realizar la transferencia.",
    });

    return;
  }

  /* =========================================
     CONFIRMAR TRANSFERENCIA
     Sistema de Gestión Bancaria v0.9.0
  ========================================= */

  // Mostrar un resumen antes de continuar
  const confirmacion = await Swal.fire({
    icon: "question",
    title: "Confirmar transferencia",
    text:
      `¿Deseas transferir ${formatCurrency(Number(monto))} ` +
      `a la cuenta ${numeroCuentaDestino}?`,
    showCancelButton: true,
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  });

  // Si el usuario cancela, detener la operación
  if (!confirmacion.isConfirmed) {
    return;
  }

  /* =========================================
     EJECUTAR TRANSFERENCIA CONFIRMADA
     Sistema de Gestión Bancaria v0.9.0
  ========================================= */

  // Buscar el botón de transferencia
  const botonTransferir = document.querySelector("#btnTransferir");

  // Evitar una segunda ejecución mientras se procesa
  if (botonTransferir?.dataset.procesando === "true") {
    return;
  }

  if (botonTransferir) {
    botonTransferir.dataset.procesando = "true";
    botonTransferir.disabled = true;
  }

  try {
    // Ejecutar la operación mediante el servicio bancario
    bancoService.realizarTransferencia({
      cuentaOrigenId,
      numeroCuentaDestino: destinoNormalizado,
      monto: montoNumerico,
      descripcion,
    });

    // Mostrar confirmación de éxito
    await Swal.fire({
      icon: "success",
      title: "Transferencia realizada",
      text: "La transferencia ficticia se registró correctamente.",
      confirmButtonText: "Aceptar",
    });

    // Recargar la página para consultar los saldos actualizados
    window.location.reload();
  } catch (error) {
    console.error("Error al realizar transferencia:", error);

    await Swal.fire({
      icon: "error",
      title: "No fue posible realizar la transferencia",
      text: error.message,
      confirmButtonText: "Aceptar",
    });
  } finally {
    // Liberar el estado de procesamiento
    if (botonTransferir) {
      botonTransferir.dataset.procesando = "false";

      // Mantener el botón deshabilitado por ahora
      botonTransferir.disabled = false;
    }
  }
}

/* =========================================
   MANEJAR DEPÓSITO
   Sistema de Gestión Bancaria v0.9.0
========================================= */

let depositoEnProceso = false;

async function manejarDeposito(event) {
  event.preventDefault();

  // Evitar depósitos simultáneos
  if (depositoEnProceso) {
    return;
  }

  depositoEnProceso = true;

  const boton = document.querySelector("#btnDepositar");

  try {
    // Obtener los datos del formulario
    const cuentaId = document.querySelector("#depositoCuenta")?.value;

    const monto = document.querySelector("#depositoMonto")?.value;

    const descripcion =
      document.querySelector("#depositoDescripcion")?.value.trim() || "";

    // Validar cuenta seleccionada
    if (!cuentaId) {
      throw new Error("Selecciona una cuenta para depositar.");
    }

    // Validar monto monetario
    if (!validarMontoMonetario(monto)) {
      throw new Error("Ingresa un monto positivo con máximo dos decimales.");
    }

    // Confirmar depósito
    const confirmacion = await Swal.fire({
      icon: "question",
      title: "Confirmar depósito",
      text: `¿Deseas depositar ${formatCurrency(Number(monto))}?`,
      showCancelButton: true,
      confirmButtonText: "Sí, depositar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    // Bloquear el botón durante la operación
    if (boton) {
      boton.disabled = true;
    }

    // Ejecutar depósito mediante BancoService
    bancoService.realizarDeposito({
      cuentaId,
      monto: Number(monto),
      descripcion,
    });

    // Mostrar confirmación de éxito
    await Swal.fire({
      icon: "success",
      title: "Depósito realizado",
      text: "El depósito ficticio se registró correctamente.",
      confirmButtonText: "Aceptar",
    });

    // Actualizar los saldos mostrados
    window.location.reload();
  } catch (error) {
    console.error("Error al realizar depósito:", error);

    await Swal.fire({
      icon: "error",
      title: "No fue posible realizar el depósito",
      text: error.message,
    });
  } finally {
    depositoEnProceso = false;

    // Permitir un nuevo intento cuando termine
    if (boton) {
      boton.disabled = false;
    }
  }
} // Cierra manejarDeposito()

/* =========================================
   INICIALIZAR PÁGINA DE TRANSFERENCIAS
   Sistema de Gestión Bancaria v0.9.0
========================================= */

function initTransferencias() {
  // Proteger la página
  if (!authService.protegerRuta()) {
    return;
  }

  // Obtener el usuario autenticado
  const usuario = authService.getCurrentUser();

  if (!usuario) {
    return;
  }

  try {
    // Recuperar los datos bancarios actualizados
    bancoService.recargarBanco();

    const datos = bancoService.obtenerDatosUsuario(usuario.id);

    // Mostrar los formularios
    renderFormulario(datos.usuario, datos.cuentas);

    /* =========================================
       ACTUALIZAR SALDO AL CAMBIAR DE CUENTA
       Sistema de Gestión Bancaria v0.9.0
    ========================================= */

    // Buscar el selector de cuenta origen
    const selectorCuenta = document.querySelector("#transferCuentaOrigen");

    // Buscar el elemento que muestra el saldo
    const saldoActual = document.querySelector("#saldoActual");

    // Conectar el cambio de cuenta
    if (selectorCuenta && saldoActual) {
      selectorCuenta.addEventListener("change", () => {
        // Obtener la cuenta seleccionada
        const cuentaSeleccionada = datos.cuentas.find(
          (cuenta) => cuenta.id === selectorCuenta.value,
        );

        // Actualizar el saldo mostrado
        if (cuentaSeleccionada) {
          saldoActual.textContent = formatCurrency(cuentaSeleccionada.saldo);
        }
      });
    }

    /* =========================================
       CONECTAR FORMULARIO DE TRANSFERENCIA
       Sistema de Gestión Bancaria v0.9.0
    ========================================= */

    // Buscar el formulario
    const formulario = document.querySelector("#formTransferencia");

    // Conectar el evento de envío
    if (formulario) {
      formulario.addEventListener("submit", manejarTransferencia);
    }

    /* =========================================
       CONECTAR FORMULARIO DE DEPÓSITO
       Sistema de Gestión Bancaria v0.9.0
    ========================================= */

    // Buscar el formulario de depósito
    const formularioDeposito = document.querySelector("#formDeposito");

    // Conectar el evento de envío
    if (formularioDeposito) {
      formularioDeposito.addEventListener("submit", manejarDeposito);
    }

    // Conectar el botón Cerrar sesión
    initLogout();

    console.log("Transferencias v0.9.0 inicializada.");
  } catch (error) {
    console.error("Error al cargar Transferencias:", error);

    Swal.fire({
      icon: "error",
      title: "No fue posible cargar Transferencias",
      text: error.message,
    });
  }
} // Cierra initTransferencias()

// Iniciar la página
initTransferencias();
