/* =========================================
   FUNCIONES AUXILIARES
========================================= */

/* =========================================
   GENERAR IDENTIFICADOR
========================================= */

export function generarId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/* =========================================
   GENERAR NÚMERO DE CUENTA
   Sistema de Gestión Bancaria v0.6.0
========================================= */

export function generarNumeroCuenta() {
  // Crear una cadena vacía
  let numeroCuenta = "";

  // Generar 12 dígitos aleatorios
  for (let i = 0; i < 12; i += 1) {
    const digito = Math.floor(Math.random() * 10);

    numeroCuenta += digito;
  }

  // Devolver el número de cuenta
  return numeroCuenta;
}

/* =========================================
   UTILIDADES MONETARIAS
   Sistema de Gestión Bancaria v0.9.0
========================================= */

// Convertir pesos ficticios a centavos enteros
export function convertirACentavos(monto) {
  const numero = Number(monto);

  if (!Number.isFinite(numero) || numero < 0) {
    throw new Error("Importe monetario inválido.");
  }

  const centavos = Math.round(numero * 100);

  if (
    !Number.isSafeInteger(centavos) ||
    Math.abs(numero * 100 - centavos) >= 1e-7
  ) {
    throw new Error("Importe fuera del rango o precisión permitidos.");
  }

  return centavos;
}

// Convertir centavos enteros a pesos ficticios
export function convertirAPesos(centavos) {
  if (!Number.isSafeInteger(centavos) || centavos < 0) {
    throw new Error("Cantidad de centavos inválida.");
  }

  return centavos / 100;
}
