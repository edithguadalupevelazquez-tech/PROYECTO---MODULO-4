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

import { Banco } from "./models/Banco.js";

//PUNTO DE ENTRADA DE LA APLICACIÓN

console.log("Sistema de Gestión Bancaria - v0.4.0");

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

/* =========================================
   PRUEBA DEL MODELO BANCO
   VERSION v0.4.0
========================================= */

console.log("Sistema de Gestión Bancaria - POO v0.4.0");

/* =========================================
   CREAR BANCO
========================================= */

const bancoDemo = new Banco();

/* =========================================
   CREAR USUARIO
========================================= */

const usuarioDemo = new Usuario({
  nombre: "Ana López",
  email: "ana@ejemplo.com",
  telefono: "5512345678",
  password: "123456",
});

// Registrar usuario mediante Banco
bancoDemo.agregarUsuario(usuarioDemo);

console.log("Usuarios registrados:", bancoDemo.usuarios.length);

/* =========================================
   CREAR CUENTA
========================================= */

const cuentaDemo = new Cuenta({
  numeroCuenta: "123456789012",
  usuarioId: usuarioDemo.id,
});

// Registrar cuenta mediante Banco
bancoDemo.agregarCuenta(cuentaDemo);

console.log("Cuentas registradas:", bancoDemo.cuentas.length);

/* =========================================
   REALIZAR DEPÓSITO
========================================= */

const depositoDemo = bancoDemo.realizarDeposito({
  cuentaId: cuentaDemo.id,
  monto: 1000,
  descripcion: "Depósito inicial",
});

/* =========================================
   MOSTRAR RESULTADOS
========================================= */

console.log("Saldo actual:", formatCurrency(cuentaDemo.saldo));

console.log("Movimiento generado:", depositoDemo);

console.log("Movimientos registrados:", bancoDemo.movimientos.length);

/* =========================================
   BUSCAR USUARIO
========================================= */

const usuarioEncontrado = bancoDemo.buscarUsuarioPorId(usuarioDemo.id);

console.log("Usuario encontrado:", usuarioEncontrado.nombre);

/* =========================================
   OBTENER CUENTAS DEL USUARIO
========================================= */

const cuentasUsuario = bancoDemo.obtenerCuentasDeUsuario(usuarioDemo.id);

console.log("Cuentas del usuario:", cuentasUsuario.length);

/* =========================================
   PROBAR ERROR CONTROLADO
========================================= */

try {
  bancoDemo.realizarDeposito({
    cuentaId: cuentaDemo.id,
    monto: -500,
  });
} catch (error) {
  console.log("Error controlado:", error.message);
}
