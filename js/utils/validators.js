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

/* =========================================
   VALIDAR MONTO MONETARIO
   Sistema de Gestión Bancaria v0.9.0
========================================= */

export function validarMontoMonetario(monto) {
  // Rechazar valores vacíos o inexistentes
  if (monto === null || monto === undefined || typeof monto === "boolean") {
    return false;
  }

  // Convertir el monto a texto
  const texto = String(monto).trim();

  // Aceptar números positivos con máximo dos decimales
  const formatoMonetario = /^\d+(\.\d{1,2})?$/;

  if (!formatoMonetario.test(texto)) {
    return false;
  }

  // Convertir el monto a número
  const numero = Number(texto);

  // Comprobar que sea positivo y finito
  if (!Number.isFinite(numero) || numero <= 0) {
    return false;
  }

  // Convertir a centavos y comprobar precisión
  const centavos = Math.round(numero * 100);

  return (
    Number.isSafeInteger(centavos) &&
    centavos > 0 &&
    Math.abs(numero * 100 - centavos) < 1e-7
  );
}
