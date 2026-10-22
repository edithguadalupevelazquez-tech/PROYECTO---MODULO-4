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
