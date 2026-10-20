/* =========================================
   IMPORTAR MODELO MOVIMIENTO
========================================= */

import { Movimiento } from "./Movimiento.js";

/* =========================================
   MODELO BANCO
========================================= */

export class Banco {
  constructor({ usuarios = [], cuentas = [], movimientos = [] } = {}) {
    this.usuarios = usuarios;
    this.cuentas = cuentas;
    this.movimientos = movimientos;
  }

  /* =========================================
       AGREGAR USUARIO
    ========================================= */

  agregarUsuario(usuario) {
    // Comprobar si el usuario ya existe
    const existe = this.usuarios.some((u) => u.id === usuario.id);

    // Evitar usuarios duplicados
    if (existe) {
      throw new Error("El usuario ya existe.");
    }

    // Registrar el usuario
    this.usuarios.push(usuario);

    // Devolver el usuario registrado
    return usuario;
  }

  /* =========================================
   BUSCAR USUARIO POR ID
========================================= */

  buscarUsuarioPorId(usuarioId) {
    return this.usuarios.find((usuario) => usuario.id === usuarioId) || null;
  }

  /* =========================================
   AGREGAR CUENTA
========================================= */

  agregarCuenta(cuenta) {
    // Buscar al propietario de la cuenta
    const usuario = this.buscarUsuarioPorId(cuenta.usuarioId);

    // Comprobar que el propietario existe
    if (!usuario) {
      throw new Error("El usuario propietario de la cuenta no existe.");
    }

    // Comprobar si la cuenta ya está registrada
    const existe = this.cuentas.some(
      (c) => c.id === cuenta.id || c.numeroCuenta === cuenta.numeroCuenta,
    );

    // Evitar cuentas duplicadas
    if (existe) {
      throw new Error("La cuenta ya existe.");
    }

    // Registrar la cuenta
    this.cuentas.push(cuenta);

    return cuenta;
  }

  /* =========================================
   BUSCAR CUENTA POR ID
========================================= */

  buscarCuentaPorId(cuentaId) {
    return this.cuentas.find((cuenta) => cuenta.id === cuentaId) || null;
  }

  /* =========================================
   BUSCAR CUENTA POR NÚMERO
========================================= */

  buscarCuentaPorNumero(numeroCuenta) {
    return (
      this.cuentas.find((cuenta) => cuenta.numeroCuenta === numeroCuenta) ||
      null
    );
  }

  /* =========================================
   OBTENER CUENTAS DE UN USUARIO
========================================= */

  obtenerCuentasDeUsuario(usuarioId) {
    return this.cuentas.filter((cuenta) => cuenta.usuarioId === usuarioId);
  }

  /* =========================================
   REGISTRAR MOVIMIENTO
========================================= */

  registrarMovimiento(movimiento) {
    // Agregar movimiento al historial
    this.movimientos.push(movimiento);

    // Devolver movimiento registrado
    return movimiento;
  }

  /* =========================================
   REALIZAR DEPÓSITO
========================================= */

  realizarDeposito({ cuentaId, monto, descripcion = "" }) {
    // Convertir el monto a número
    const montoNumerico = Number(monto);

    // Validar que sea positivo y finito
    if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
      throw new Error("Monto inválido, el monto debe ser mayor a cero.");
    }

    // Buscar la cuenta
    const cuenta = this.buscarCuentaPorId(cuentaId);

    if (!cuenta) {
      throw new Error("La cuenta no existe.");
    }

    // Actualizar saldo
    cuenta.depositar(montoNumerico);

    // Crear movimiento automáticamente
    const movimiento = new Movimiento({
      tipo: "DEPOSITO",
      monto: montoNumerico,
      descripcion,
      cuentaOrigen: cuenta.id,
      saldoResultante: cuenta.saldo,
    });

    // Registrar movimiento
    this.registrarMovimiento(movimiento);

    return movimiento;
  }

  /* =========================================
   OBTENER MOVIMIENTOS DE UNA CUENTA
========================================= */

  obtenerMovimientosDeCuenta(cuentaId) {
    return this.movimientos.filter(
      (movimiento) =>
        movimiento.cuentaOrigen === cuentaId ||
        movimiento.cuentaDestino === cuentaId,
    );
  }
}
