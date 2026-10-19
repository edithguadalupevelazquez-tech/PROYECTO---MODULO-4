/* =========================================
   VALIDACIONES GENERALES
========================================= */

/* =========================================
   VALIDAR CAMPO OBLIGATORIO
========================================= */

export function validarCampoObligatorio(valor) {
  return valor !== undefined && valor !== null && String(valor).trim() !== "";
}

/* =========================================
   VALIDAR MONTO
========================================= */

export function validarMonto(monto) {
  const montoNumerico = Number(monto);

  return Number.isFinite(montoNumerico) && montoNumerico > 0;
}
