import { generarId } from "../utils/helpers.js";
import { validarMonto } from "../utils/validators.js";

export class Cuenta {
  constructor({ id = generarId(), numeroCuenta, usuarioId, saldo = 0 }) {
    this.id = id;
    this.numeroCuenta = numeroCuenta;
    this.usuarioId = usuarioId;
    this.saldo = saldo;
  }

  /* =========================================
       DEPOSITAR DINERO
    ========================================= */

  depositar(monto) {
    if (!validarMonto(monto)) {
      throw new Error("Monto inválido");
    }

    const montoNumerico = Number(monto);

    this.saldo += montoNumerico;

    return this.saldo;
  }

  /* =========================================
       RETIRAR DINERO
    ========================================= */

  retirar(monto) {
    if (!validarMonto(monto)) {
      throw new Error("Monto inválido");
    }

    const montoNumerico = Number(monto);

    if (montoNumerico > this.saldo) {
      throw new Error("Saldo insuficiente");
    }

    this.saldo -= montoNumerico;

    return this.saldo;
  }
}
