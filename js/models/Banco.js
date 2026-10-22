/* =========================================
   IMPORTAR MODELO MOVIMIENTO
========================================= */

import { Movimiento } from "./Movimiento.js";
import { validarMontoMonetario } from "../utils/validators.js";

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

    // Validar el monto con la regla monetaria compartida
    if (!validarMontoMonetario(monto)) {
      throw new Error(
        "Monto inválido. Debe ser positivo y tener máximo dos decimales.",
      );
    }

    // Convertir el monto validado a número
    const montoNumerico = Number(monto);

    // Buscar la cuenta
    const cuenta = this.buscarCuentaPorId(cuentaId);

    if (!cuenta) {
      throw new Error("La cuenta no existe.");
    }

    /* =========================================
       DEPÓSITO CON RECUPERACIÓN
       Sistema de Gestión Bancaria v0.9.0
    ========================================= */

    // Conservar el saldo original
    const saldoOriginal = cuenta.saldo;

    // Conservar el historial original
    const movimientosOriginales = [...this.movimientos];

    try {
      // Actualizar el saldo
      cuenta.depositar(montoNumerico);

      // Crear el movimiento del depósito
      const movimiento = new Movimiento({
        tipo: "DEPOSITO",
        monto: montoNumerico,
        descripcion,
        cuentaOrigen: cuenta.id,
        saldoResultante: cuenta.saldo,
      });

      // Registrar el movimiento
      this.registrarMovimiento(movimiento);

      // Devolver el movimiento registrado
      return movimiento;
    } catch (error) {
      // Restaurar el saldo anterior
      cuenta.saldo = saldoOriginal;

      // Restaurar el historial anterior
      this.movimientos.splice(
        0,
        this.movimientos.length,
        ...movimientosOriginales,
      );

      // Propagar el error original
      throw error;
    }
  }

  /* =========================================
     REALIZAR TRANSFERENCIA
     Sistema de Gestión Bancaria v0.9.0
  ========================================= */

  realizarTransferencia({
    cuentaOrigenId,
    cuentaDestinoId,
    monto,
    descripcion = "",
  }) {
    /* =========================================
       VALIDAR MONTO DE TRANSFERENCIA
    ========================================= */

    // Validar el monto con la regla monetaria compartida
    if (!validarMontoMonetario(monto)) {
      throw new Error(
        "Monto inválido. Debe ser positivo y tener máximo dos decimales.",
      );
    }

    // Convertir el monto validado a número
    const montoNumerico = Number(monto);

    /* =========================================
       BUSCAR CUENTAS DE TRANSFERENCIA
    ========================================= */

    // Buscar la cuenta que enviará el dinero
    const origen = this.buscarCuentaPorId(cuentaOrigenId);

    // Buscar la cuenta que recibirá el dinero
    const destino = this.buscarCuentaPorId(cuentaDestinoId);

    /* =========================================
       VALIDAR EXISTENCIA DE LAS CUENTAS
    ========================================= */

    // Comprobar que exista la cuenta origen
    if (!origen) {
      throw new Error("La cuenta origen no existe.");
    }

    // Comprobar que exista la cuenta destino
    if (!destino) {
      throw new Error("La cuenta destino no existe.");
    }

    /* =========================================
       VALIDAR CUENTAS ACTIVAS
       Sistema de Gestión Bancaria v0.9.0
    ========================================= */

    // Comprobar que la cuenta origen esté activa
    if (!origen.activa) {
      throw new Error("La cuenta origen no está activa.");
    }

    // Comprobar que la cuenta destino esté activa
    if (!destino.activa) {
      throw new Error("La cuenta destino no está activa.");
    }

    /* =========================================
       EVITAR TRANSFERENCIA A LA MISMA CUENTA
    ========================================= */

    // Comparar los identificadores de ambas cuentas
    if (origen.id === destino.id) {
      throw new Error("No puedes transferir dinero a la misma cuenta.");
    }

    /* =========================================
       VALIDAR SALDO SUFICIENTE
       Sistema de Gestión Bancaria v0.9.0
    ========================================= */

    // Comprobar que el saldo sea válido
    const saldoDisponible = Number(origen.saldo);

    if (!Number.isFinite(saldoDisponible) || saldoDisponible < 0) {
      throw new Error("El saldo de la cuenta origen es inválido.");
    }

    // Impedir transferir más dinero del disponible
    if (saldoDisponible < montoNumerico) {
      throw new Error("Saldo insuficiente.");
    }

    /* =========================================
       VALIDAR SALDO DE LA CUENTA DESTINO
       Sistema de Gestión Bancaria v0.9.0
    ========================================= */

    // Convertir el saldo destino a número
    const saldoDestino = Number(destino.saldo);

    // Comprobar que el saldo destino sea válido
    if (!Number.isFinite(saldoDestino) || saldoDestino < 0) {
      throw new Error("El saldo de la cuenta destino es inválido.");
    }

    /* =========================================
       VALIDAR SALDOS RESULTANTES
       Sistema de Gestión Bancaria v0.9.0
    ========================================= */

    // Calcular los saldos antes de modificarlos
    const nuevoSaldoOrigen = saldoDisponible - montoNumerico;

    const nuevoSaldoDestino = saldoDestino + montoNumerico;

    // Comprobar que los resultados sean válidos
    if (
      !Number.isFinite(nuevoSaldoOrigen) ||
      !Number.isFinite(nuevoSaldoDestino) ||
      nuevoSaldoOrigen < 0
    ) {
      throw new Error("La transferencia produciría saldos inválidos.");
    }

    /* =========================================
       RESPALDAR SALDOS ANTES DE TRANSFERIR
       Sistema de Gestión Bancaria v0.9.0
    ========================================= */

    // Conservar los saldos anteriores
    const saldoOriginalOrigen = origen.saldo;

    const saldoOriginalDestino = destino.saldo;

    /* =========================================
       EJECUTAR TRANSFERENCIA
    ========================================= */

    /* =========================================
       EJECUTAR Y REGISTRAR TRANSFERENCIA
       Sistema de Gestión Bancaria v0.9.0
    ========================================= */

    // Guardar la cantidad inicial de movimientos
    const totalMovimientosOriginal = this.movimientos.length;

    try {
      // Retirar dinero de la cuenta origen
      origen.retirar(montoNumerico);

      // Depositar dinero en la cuenta destino
      destino.depositar(montoNumerico);

      // Crear movimiento enviado
      const movimientoEnviado = new Movimiento({
        tipo: "TRANSFERENCIA_ENVIADA",
        monto: montoNumerico,
        descripcion,
        cuentaOrigen: origen.id,
        cuentaDestino: destino.id,
        saldoResultante: origen.saldo,
      });

      // Crear movimiento recibido
      const movimientoRecibido = new Movimiento({
        tipo: "TRANSFERENCIA_RECIBIDA",
        monto: montoNumerico,
        descripcion,
        cuentaOrigen: origen.id,
        cuentaDestino: destino.id,
        saldoResultante: destino.saldo,
      });

      // Registrar ambos movimientos
      this.registrarMovimiento(movimientoEnviado);
      this.registrarMovimiento(movimientoRecibido);

      // Devolver el resultado de la transferencia
      return {
        origen,
        destino,
        movimientoEnviado,
        movimientoRecibido,
      };
    } catch (error) {
      // Restaurar los saldos originales
      origen.saldo = saldoOriginalOrigen;
      destino.saldo = saldoOriginalDestino;

      // Eliminar movimientos añadidos durante el intento
      this.movimientos.length = totalMovimientosOriginal;

      // Propagar el error
      throw error;
    }
  } // Cierra realizarTransferencia()

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
