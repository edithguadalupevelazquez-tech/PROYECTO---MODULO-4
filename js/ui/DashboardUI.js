/* =========================================
   DASHBOARD BANCARIO v0.7.0
========================================= */

import { authService } from "../services/AuthService.js";
import { bancoService } from "../services/BancoService.js";

import { formatCurrency, formatAccountNumber } from "../utils/formatters.js";

/* =========================================
   RENDERIZAR DASHBOARD
========================================= */

function renderDashboard(resumen) {
  const root = document.querySelector("#dashboardRoot");

  if (!root) {
    throw new Error("No se encontró dashboardRoot.");
  }

  const { usuario, cuentas, saldoTotal, totalCuentas, totalMovimientos } =
    resumen;

  const cuentaPrincipal = cuentas[0] || null;

  root.innerHTML = `
    <section class="dashboard-welcome">
      <div>
        <p class="dashboard-label">Bienvenido</p>
        <h2 id="nombreUsuario"></h2>
        <p>Consulta el estado actual de tus cuentas.</p>
      </div>
    </section>

    <section class="summary-grid">
      <article class="summary-card">
        <span>Saldo total</span>
        <strong>${formatCurrency(saldoTotal)}</strong>
      </article>

      <article class="summary-card">
        <span>Cuentas</span>
        <strong>${totalCuentas}</strong>
      </article>

      <article class="summary-card">
        <span>Movimientos</span>
        <strong>${totalMovimientos}</strong>
      </article>
    </section>

    <section class="dashboard-section">
      <header class="section-header">
        <span>Cuenta principal</span>
        <h3>Información bancaria</h3>
      </header>

      ${
        cuentaPrincipal
          ? `
            <article class="account-card">
              <div>
                <span>Número de cuenta</span>
                <strong>
                  ${formatAccountNumber(cuentaPrincipal.numeroCuenta)}
                </strong>
              </div>

              <div>
                <span>Tipo</span>
                <strong id="tipoCuenta"></strong>
              </div>

              <div>
                <span>Saldo disponible</span>
                <strong>
                  ${formatCurrency(cuentaPrincipal.saldo)}
                </strong>
              </div>
            </article>
          `
          : `
            <p>No tienes cuentas bancarias registradas.</p>
          `
      }
    </section>
  `;

  root.querySelector("#nombreUsuario").textContent = usuario.nombre;

  if (cuentaPrincipal) {
    root.querySelector("#tipoCuenta").textContent =
      cuentaPrincipal.tipo || "No especificado";
  }
}

/* =========================================
   CERRAR SESIÓN
========================================= */

async function manejarCerrarSesion() {
  const resultado = await Swal.fire({
    icon: "question",
    title: "Cerrar sesión",
    text: "¿Deseas cerrar tu sesión?",
    showCancelButton: true,
    confirmButtonText: "Sí, cerrar sesión",
    cancelButtonText: "Cancelar",
  });

  if (!resultado.isConfirmed) {
    return;
  }

  authService.logout();

  window.location.href = "./index.html";
}

/* =========================================
   INICIALIZAR DASHBOARD
========================================= */

function initDashboard() {
  if (!authService.protegerRuta()) {
    return;
  }

  const usuario = authService.getCurrentUser();

  if (!usuario) {
    return;
  }

  try {
    bancoService.recargarBanco();

    const resumen = bancoService.obtenerResumenUsuario(usuario.id);

    renderDashboard(resumen);

    const botonCerrarSesion = document.querySelector("#btnCerrarSesion");

    if (botonCerrarSesion) {
      botonCerrarSesion.addEventListener("click", manejarCerrarSesion);
    }

    console.log("Dashboard bancario v0.7.0 inicializado.");
  } catch (error) {
    console.error("Error al cargar el dashboard:", error);

    Swal.fire({
      icon: "error",
      title: "No fue posible cargar el dashboard",
      text: error.message,
    });
  }
}

initDashboard();
