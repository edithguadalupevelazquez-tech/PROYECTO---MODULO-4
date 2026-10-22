/* =========================================
   DASHBOARD BANCARIO - v0.6.0
========================================= */

import { authService } from "../services/AuthService.js";

import { STORAGE_KEYS, storageService } from "../services/StorageService.js";

import { formatCurrency, formatAccountNumber } from "../utils/formatters.js";

/* =========================================
   MOSTRAR INFORMACIÓN BANCARIA
========================================= */

function mostrarDashboard(usuario) {
  document.querySelector("#nombreUsuario").textContent = usuario.nombre;

  const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);

  const cuenta = cuentas.find((cuenta) => cuenta.usuarioId === usuario.id);

  if (cuenta) {
    document.querySelector("#numeroCuenta").textContent = formatAccountNumber(
      cuenta.numeroCuenta,
    );

    document.querySelector("#saldoCuenta").textContent = formatCurrency(
      cuenta.saldo,
    );
  } else {
    document.querySelector("#numeroCuenta").textContent = "Sin cuenta";

    document.querySelector("#saldoCuenta").textContent = "$0.00";
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
  // Comprobar sesión antes de mostrar datos
  if (!authService.protegerRuta()) {
    return;
  }

  const usuario = authService.getCurrentUser();

  if (!usuario) {
    return;
  }

  mostrarDashboard(usuario);

  const botonCerrarSesion = document.querySelector("#btnCerrarSesion");

  if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", manejarCerrarSesion);
  }

  console.log("Dashboard bancario inicializado.");
}

initDashboard();
