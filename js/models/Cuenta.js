import {
  generarId,
  convertirACentavos,
  convertirAPesos,
} from "../utils/helpers.js";
import { validarMonto } from "../utils/validators.js";

export class Cuenta {
  constructor({
    id = generarId(),
    numeroCuenta,
    usuarioId,
    saldo = 0,
    activa = true,
  }) {
    this.id = id;
    this.numeroCuenta = numeroCuenta;
    this.usuarioId = usuarioId;
    this.saldo = Number(saldo);
    this.activa = activa;
  }

  /* =========================================
     DEPOSITAR DINERO CON CENTAVOS
     Sistema de Gestión Bancaria v0.9.0
  ========================================= */

  depositar(monto) {
    // Validar que el monto sea positivo
    if (!validarMonto(monto)) {
      throw new Error("Monto inválido");
    }

    // Convertir saldo y depósito a centavos
    const saldoCentavos = convertirACentavos(this.saldo);
    const montoCentavos = convertirACentavos(monto);

    // Calcular el nuevo saldo
    const nuevoSaldoCentavos = saldoCentavos + montoCentavos;

    // Comprobar que la suma sea segura
    if (!Number.isSafeInteger(nuevoSaldoCentavos)) {
      throw new Error("El saldo supera el límite permitido.");
    }

    // Actualizar el saldo en pesos
    this.saldo = convertirAPesos(nuevoSaldoCentavos);

    // Devolver el saldo actualizado
    return this.saldo;
  }

  /* =========================================
       RETIRAR DINERO
    ========================================= */

  /* =========================================
     RETIRAR DINERO CON CENTAVOS
     Sistema de Gestión Bancaria v0.9.0
  ========================================= */

  retirar(monto) {
    // Validar que el monto sea positivo
    if (!validarMonto(monto)) {
      throw new Error("Monto inválido");
    }

    // Convertir el saldo y el retiro a centavos
    const saldoCentavos = convertirACentavos(this.saldo);
    const montoCentavos = convertirACentavos(monto);

    // Comprobar que exista saldo suficiente
    if (montoCentavos > saldoCentavos) {
      throw new Error("Saldo insuficiente");
    }

    // Calcular el saldo restante
    const nuevoSaldoCentavos = saldoCentavos - montoCentavos;

    // Convertir el resultado nuevamente a pesos
    this.saldo = convertirAPesos(nuevoSaldoCentavos);

    // Devolver el saldo actualizado
    return this.saldo;
  }
}
