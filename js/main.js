/* =========================================
   IMPORTAR VALIDADORES
========================================= */

import { validarCampoObligatorio, validarMonto } from "./utils/validators.js";

/* =========================================
   IMPORTAR FUNCIONES AUXILIARES
========================================= */

import { generarId } from "./utils/helpers.js";

/* =========================================
   IMPORTAR FORMATEADORES
========================================= */

import {
  formatCurrency,
  formatDate,
  formatAccountNumber,
} from "./utils/formatters.js";

/* =========================================
   PUNTO DE ENTRADA DE LA APLICACIÓN
========================================= */

console.log("Sistema de Gestión Bancaria - v0.2.0");

// Probar campo obligatorio
console.log("Campo obligatorio:", validarCampoObligatorio("Banco Digital"));

// Probar monto
console.log("Monto válido:", validarMonto(1000));

// Generar identificador
console.log("ID generado:", generarId());

// Formatear moneda
console.log("Monto formateado:", formatCurrency(1500));

// Formatear fecha
console.log("Fecha formateada:", formatDate(new Date()));

// Formatear número de cuenta
console.log("Número de cuenta:", formatAccountNumber("123456789012"));
