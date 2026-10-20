import { Banco } from "../js/models/Banco.js";
import { Usuario } from "../js/models/Usuario.js";
import { Cuenta } from "../js/models/Cuenta.js";

// Crear banco vacío
const banco = new Banco();

// Crear usuario ficticio
const usuario = new Usuario({
  nombre: "Ana",
  email: "ana@ejemplo.com",
  telefono: "5512345678",
  password: "123456",
});

// Registrar usuario
banco.agregarUsuario(usuario);

// Crear cuenta
const cuenta = new Cuenta({
  numeroCuenta: "123456789012",
  usuarioId: usuario.id,
});

// Registrar cuenta
banco.agregarCuenta(cuenta);

// Buscar por ID
const cuentaPorId = banco.buscarCuentaPorId(cuenta.id);

// Buscar por número
const cuentaPorNumero = banco.buscarCuentaPorNumero("123456789012");

// Mostrar resultados
console.log("Búsqueda por ID:", cuentaPorId === cuenta);

console.log("Búsqueda por número:", cuentaPorNumero === cuenta);

// Buscar una cuenta inexistente
console.log("Cuenta inexistente:", banco.buscarCuentaPorNumero("999999999999"));

/* =========================================
   PROBAR CUENTAS DE UN USUARIO
========================================= */

// Crear una segunda cuenta para Ana
const segundaCuenta = new Cuenta({
  numeroCuenta: "987654321098",
  usuarioId: usuario.id,
});

// Registrar la segunda cuenta
banco.agregarCuenta(segundaCuenta);

// Obtener todas las cuentas de Ana
const cuentasDeAna = banco.obtenerCuentasDeUsuario(usuario.id);

// Mostrar resultados
console.log("Cuentas de Ana:", cuentasDeAna.length);

// Comprobar que ambas pertenecen a Ana
console.log(
  "¿Todas pertenecen a Ana?",
  cuentasDeAna.every((cuenta) => cuenta.usuarioId === usuario.id),
);

// Buscar cuentas de un usuario inexistente
console.log(
  "Cuentas de usuario inexistente:",
  banco.obtenerCuentasDeUsuario("u999").length,
);
