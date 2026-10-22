/* =========================================
   MOVIMIENTOS UI
   Sistema de Gestión Bancaria v0.10.0
========================================= */

// Importar servicio de autenticación
import { authService } from "../services/AuthService.js";

// Importar servicio bancario
import { bancoService } from "../services/BancoService.js";

// Importar funciones de formato
import { formatCurrency, formatDate } from "../utils/formatters.js";

/* =========================================
   ESTADO DE LA INTERFAZ
========================================= */

// Guardar el filtro seleccionado
let filtroActual = "TODOS";

/* =========================================
   ETIQUETAS DE MOVIMIENTOS
========================================= */

function obtenerEtiquetaTipo(tipo) {
  const etiquetas = {
    DEPOSITO: "Depósito",
    TRANSFERENCIA_ENVIADA: "Transferencia enviada",
    TRANSFERENCIA_RECIBIDA: "Transferencia recibida",
  };

  return etiquetas[tipo] || tipo;
}

/* =========================================
   SIGNO DEL MOVIMIENTO
========================================= */

function obtenerSignoMovimiento(tipo) {
  if (tipo === "TRANSFERENCIA_ENVIADA") {
    return "-";
  }

  return "+";
}

/* =========================================
   CLASE VISUAL DEL MOVIMIENTO
========================================= */

function obtenerClaseMovimiento(tipo) {
  if (tipo === "TRANSFERENCIA_ENVIADA") {
    return "movimiento-salida";
  }

  return "movimiento-entrada";
}

/* =========================================
   RENDER PRINCIPAL DE MOVIMIENTOS
   Sistema de Gestión Bancaria v0.10.0
========================================= */

function renderMovimientos(usuario) {
  // Buscar el contenedor principal
  const root = document.querySelector("#movimientosRoot");

  // Detener si no existe
  if (!root) {
    return;
  }

  // Recuperar el resumen de movimientos
  const resumen = bancoService.obtenerResumenMovimientos(usuario.id);

  // Recuperar los movimientos según el filtro actual
  const movimientos = bancoService.obtenerMovimientosUsuario(
    usuario.id,
    filtroActual,
  );

  /* =========================================
     RENDERIZAR ENCABEZADO Y RESUMEN
     Sistema de Gestión Bancaria v0.10.0
  ========================================= */

  root.innerHTML = `
    <!-- ENCABEZADO -->
    <section class="movimientos-header">
      <div>
        <span class="dashboard-label">
          Actividad bancaria
        </span>

        <h2>Historial de movimientos</h2>

        <p>
          Consulta las operaciones realizadas en tus cuentas.
        </p>
      </div>
    </section>

    <!-- RESUMEN DE MOVIMIENTOS -->
    <section class="movimientos-summary">

      <article class="movimiento-summary-card">
        <span>Todos</span>
        <strong>${resumen.total}</strong>
      </article>

      <article class="movimiento-summary-card">
        <span>Depósitos</span>
        <strong>${resumen.depositos}</strong>
      </article>

      <article class="movimiento-summary-card">
        <span>Enviadas</span>
        <strong>${resumen.enviadas}</strong>
      </article>

      <article class="movimiento-summary-card">
        <span>Recibidas</span>
        <strong>${resumen.recibidas}</strong>
      </article>

    </section>

    <!-- =========================================
         FILTROS DEL HISTORIAL
    ========================================= -->

    <section class="movimientos-filtros">
      <h3>Filtrar movimientos</h3>

      <div class="filtros-botones">
        <button
          type="button"
          class="btn-filtro ${filtroActual === "TODOS" ? "active" : ""}"
          data-filtro="TODOS"
        >
          Todos
        </button>

        <button
          type="button"
          class="btn-filtro ${filtroActual === "DEPOSITO" ? "active" : ""}"
          data-filtro="DEPOSITO"
        >
          Depósitos
        </button>

        <button
          type="button"
          class="btn-filtro ${filtroActual === "TRANSFERENCIA_ENVIADA" ? "active" : ""}"
          data-filtro="TRANSFERENCIA_ENVIADA"
        >
          Enviadas
        </button>

        <button
          type="button"
          class="btn-filtro ${filtroActual === "TRANSFERENCIA_RECIBIDA" ? "active" : ""}"
          data-filtro="TRANSFERENCIA_RECIBIDA"
        >
          Recibidas
        </button>
      </div>
    </section>

    <!-- =========================================
         TABLA DEL HISTORIAL
         Sistema de Gestión Bancaria v0.10.0
    ========================================= -->

    <section class="movimientos-historial">
      <h3>Detalle de movimientos</h3>

      <div class="movimientos-tabla-contenedor">
        <table class="movimientos-tabla">
          <thead>
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col">Tipo</th>
              <th scope="col">Descripción</th>
              <th scope="col">Monto</th>
              <th scope="col">Saldo resultante</th>
            </tr>
          </thead>

          <tbody>
            ${generarFilasMovimientos(movimientos)}
          </tbody>
        </table>
      </div>
    </section>

  `;

  // Conectar los botones después de crear el HTML
  conectarFiltros(usuario);
} // Cierra renderMovimientos()

/* =========================================
   CONECTAR FILTROS DEL HISTORIAL
   Sistema de Gestión Bancaria v0.10.0
========================================= */

function conectarFiltros(usuario) {
  // Buscar todos los botones de filtro
  const botones = document.querySelectorAll(".btn-filtro");

  // Conectar cada botón
  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      // Recuperar el filtro seleccionado
      const nuevoFiltro = boton.dataset.filtro;

      // Comprobar que sea un filtro permitido
      const filtrosPermitidos = [
        "TODOS",
        "DEPOSITO",
        "TRANSFERENCIA_ENVIADA",
        "TRANSFERENCIA_RECIBIDA",
      ];

      if (!filtrosPermitidos.includes(nuevoFiltro)) {
        return;
      }

      // Guardar el filtro seleccionado
      filtroActual = nuevoFiltro;

      // Actualizar el historial
      renderMovimientos(usuario);
    });
  });
}

/* =========================================
   GENERAR FILAS DEL HISTORIAL
   Sistema de Gestión Bancaria v0.10.0
========================================= */

/* =========================================
   PROTEGER TEXTO MOSTRADO EN HTML
   Sistema de Gestión Bancaria v0.10.0
========================================= */

function escaparHTML(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (caracter) => {
    const entidades = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entidades[caracter];
  });
}

function generarFilasMovimientos(movimientos) {
  // Mostrar un mensaje cuando no existan movimientos
  if (movimientos.length === 0) {
    return `
      <tr>
        <td colspan="5" class="movimientos-vacio">
          No se encontraron movimientos.
        </td>
      </tr>
    `;
  }

  // Convertir cada movimiento en una fila HTML
  return movimientos
    .map((movimiento) => {
      const tipo = obtenerEtiquetaTipo(movimiento.tipo);

      const signo = obtenerSignoMovimiento(movimiento.tipo);

      const clase = obtenerClaseMovimiento(movimiento.tipo);

      const fecha = formatDate(movimiento.fecha);

      const monto = formatCurrency(movimiento.monto);

      const saldo = formatCurrency(movimiento.saldoResultante);

      const descripcion = escaparHTML(movimiento.descripcion);

      return `
        <tr>
          <td>${fecha}</td>

          <td>
            <span class="${clase}">
              ${tipo}
            </span>
          </td>

          <td>${descripcion}</td>

          <td class="${clase}">
            ${signo}${monto}
          </td>

          <td>${saldo}</td>
        </tr>
      `;
    })
    .join("");
}

/* =========================================
   CERRAR SESIÓN
   Sistema de Gestión Bancaria v0.10.0
========================================= */

function initLogout() {
  // Buscar el botón de cerrar sesión
  const boton = document.querySelector("#logoutBtn");

  if (!boton) {
    return;
  }

  // Escuchar el clic del usuario
  boton.addEventListener("click", async () => {
    const resultado = await Swal.fire({
      icon: "question",
      title: "Cerrar sesión",
      text: "¿Seguro que deseas salir?",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    });

    // Si cancela, mantener la sesión
    if (!resultado.isConfirmed) {
      return;
    }

    // Cerrar la sesión
    authService.logout();

    // Regresar al inicio
    window.location.href = "./index.html";
  });
}

/* =========================================
   INICIALIZAR PÁGINA DE MOVIMIENTOS
   Sistema de Gestión Bancaria v0.10.0
========================================= */

function initMovimientos() {
  // Proteger la página
  if (!authService.protegerRuta()) {
    return;
  }

  // Recuperar el usuario autenticado
  const usuario = authService.getCurrentUser();

  if (!usuario) {
    return;
  }

  try {
    // Recuperar los datos bancarios actualizados
    bancoService.recargarBanco();

    // Mostrar el historial del usuario
    renderMovimientos(usuario);

    // Conectar el botón de cerrar sesión
    initLogout();

    console.log("Movimientos v0.10.0 inicializado.");
  } catch (error) {
    console.error("Error al cargar Movimientos:", error);

    Swal.fire({
      icon: "error",
      title: "No fue posible cargar Movimientos",
      text: error.message,
    });
  }
} // Cierra initMovimientos()

// Iniciar la página
initMovimientos();
