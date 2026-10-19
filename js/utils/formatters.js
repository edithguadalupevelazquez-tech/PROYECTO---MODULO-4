/* =========================================
   FORMATEADORES DE INFORMACIÓN
========================================= */

/* =========================================
   FORMATEAR MONEDA
========================================= */

export function formatCurrency(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return "$0.00";
  }

  return numero.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
}

/* =========================================
   FORMATEAR FECHA
========================================= */

export function formatDate(fecha) {
  const fechaObjeto = new Date(fecha);

  if (Number.isNaN(fechaObjeto.getTime())) {
    return "";
  }

  return fechaObjeto.toLocaleDateString("es-MX");
}

/* =========================================
   FORMATEAR NÚMERO DE CUENTA
========================================= */

export function formatAccountNumber(numeroCuenta) {
  const numero = String(numeroCuenta ?? "");

  return numero.replace(/(\d{4})(?=\d)/g, "$1 ");
}
