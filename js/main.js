//IMPORTAR VALIDADORES

import { validarCampoObligatorio, validarMonto } from "./utils/validators.js";

// IMPORTAR FUNCIONES AUXILIARES

import { generarId } from "./utils/helpers.js";

///IMPORTAR FORMATEADORES

import {
  formatCurrency,
  formatDate,
  formatAccountNumber,
} from "./utils/formatters.js";

// IMPORTAR MODELOS BANCARIOS

import { Usuario } from "./models/Usuario.js";

import { Cuenta } from "./models/Cuenta.js";

import { Movimiento } from "./models/Movimiento.js";

//PUNTO DE ENTRADA DE LA APLICACIÓN

console.log("Sistema de Gestión Bancaria - v0.3.0");

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

// PRUEBA DE PROGRAMACIÓN ORIENTADA A OBJETOS

console.log("Sistema de Gestión Bancaria - POO v0.3.0");

// Crear usuario de prueba
const usuarioDemo = new Usuario({
  nombre: "Ana López",
  email: "ana@ejemplo.com",
  telefono: "5512345678",
  password: "123456",
});

console.log("Usuario creado:", usuarioDemo);

//CREAR CUENTA BANCARIA

const cuentaDemo = new Cuenta({
  numeroCuenta: "123456789012",
  usuarioId: usuarioDemo.id,
});

console.log("Cuenta creada:", cuentaDemo);

// REALIZAR DEPÓSITO

// Primero depositamos el dinero
cuentaDemo.depositar(1000);

// Comprobamos el nuevo saldo
console.log("Saldo después del depósito:", formatCurrency(cuentaDemo.saldo));

// REGISTRAR MOVIMIENTO

// Después del depósito creamos el movimiento
const movimientoDemo = new Movimiento({
  tipo: "DEPOSITO",
  monto: 1000,
  descripcion: "Depósito inicial",
  cuentaOrigen: cuentaDemo.id,
  saldoResultante: cuentaDemo.saldo,
});

// Mostrar movimiento generado
console.log("Movimiento generado:", movimientoDemo);
