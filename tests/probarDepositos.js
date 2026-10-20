import { Banco } from "../js/models/Banco.js";
import { Usuario } from "../js/models/Usuario.js";
import { Cuenta } from "../js/models/Cuenta.js";

// Crear banco
const banco = new Banco();

// Crear usuario de prueba
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

// Realizar depósito
const movimiento = banco.realizarDeposito({
  cuentaId: cuenta.id,
  monto: 1000,
  descripcion: "Depósito inicial",
});

// Mostrar resultados
console.log("Saldo final:", cuenta.saldo);

console.log("Movimientos registrados:", banco.movimientos.length);

console.log("Tipo:", movimiento.tipo);

console.log("Saldo del movimiento:", movimiento.saldoResultante);

// Probar un monto negativo
try {
  banco.realizarDeposito({
    cuentaId: cuenta.id,
    monto: -500,
  });
} catch (error) {
  console.log("Error controlado:", error.message);
}

// Comprobar que no cambió el saldo
console.log("Saldo después del error:", cuenta.saldo);

/* =========================================
   PROBAR HISTORIAL DE MOVIMIENTOS
========================================= */

// Consultar los movimientos de la cuenta
const historial = banco.obtenerMovimientosDeCuenta(cuenta.id);

// Mostrar cantidad de movimientos
console.log("Movimientos de la cuenta:", historial.length);

// Comprobar que encontramos el depósito
console.log(
  "¿El depósito está en el historial?",
  historial.includes(movimiento),
);

// Consultar una cuenta sin movimientos
console.log(
  "Movimientos de cuenta inexistente:",
  banco.obtenerMovimientosDeCuenta("c999").length,
);
