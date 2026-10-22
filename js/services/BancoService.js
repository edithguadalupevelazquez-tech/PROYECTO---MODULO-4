/* =========================================
   SERVICIO BANCARIO
   Sistema de Gestión Bancaria v0.7.0
========================================= */

// Importar modelos bancarios
import { Banco } from "../models/Banco.js";
import { Usuario } from "../models/Usuario.js";
import { Cuenta } from "../models/Cuenta.js";
import { Movimiento } from "../models/Movimiento.js";

// Importar servicio de almacenamiento
import { STORAGE_KEYS, storageService } from "./StorageService.js";

/* =========================================
   CLASE BANCO SERVICE
========================================= */

class BancoService {
  constructor() {
    this._banco = null;
  }

  /* =========================================
     CARGAR BANCO DESDE LOCALSTORAGE
  ========================================= */

  cargarBanco() {
    // Recuperar usuarios
    const usuariosGuardados = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    // Recuperar cuentas
    const cuentasGuardadas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);

    // Recuperar movimientos
    const movimientosGuardados = storageService.obtener(
      STORAGE_KEYS.MOVIMIENTOS,
      [],
    );

    console.log("Usuarios:", usuariosGuardados.length);
    console.log("Cuentas:", cuentasGuardadas.length);
    console.log("Movimientos:", movimientosGuardados.length);

    /* =========================================
       RECONSTRUIR MODELOS BANCARIOS
    ========================================= */

    const usuarios = usuariosGuardados.map((usuario) => new Usuario(usuario));

    const cuentas = cuentasGuardadas.map((cuenta) => new Cuenta(cuenta));

    const movimientos = movimientosGuardados.map(
      (movimiento) => new Movimiento(movimiento),
    );

    /* =========================================
       CREAR INSTANCIA DEL BANCO
    ========================================= */

    this._banco = new Banco({
      usuarios,
      cuentas,
      movimientos,
    });

    return this._banco;
  } // Cierra cargarBanco()

  /* =========================================
     OBTENER INSTANCIA DEL BANCO
  ========================================= */

  obtenerInstanciaBanco() {
    // Si todavía no hemos cargado el banco
    if (!this._banco) {
      return this.cargarBanco();
    }

    // Devolver el banco que ya tenemos
    return this._banco;
  }

  /* =========================================
     RECARGAR BANCO
  ========================================= */

  recargarBanco() {
    // Descartar la instancia anterior
    this._banco = null;

    // Recuperar nuevamente los datos de LocalStorage
    return this.cargarBanco();
  }

  /* =========================================
     GUARDAR BANCO EN LOCALSTORAGE
  ========================================= */

  guardarBanco() {
    // Obtener la instancia actual del banco
    const banco = this.obtenerInstanciaBanco();

    // Guardar usuarios
    storageService.guardar(STORAGE_KEYS.USUARIOS, banco.usuarios);

    // Guardar cuentas
    storageService.guardar(STORAGE_KEYS.CUENTAS, banco.cuentas);

    // Guardar movimientos
    storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, banco.movimientos);

    // Confirmar que terminó la operación
    return true;
  }

  /* =========================================
     OBTENER DATOS BANCARIOS DEL USUARIO
  ========================================= */

  obtenerDatosUsuario(usuarioId) {
    // Obtener la instancia actual del banco
    const banco = this.obtenerInstanciaBanco();

    // Buscar al usuario por su identificador
    const usuario = banco.buscarUsuarioPorId(usuarioId);

    // Comprobar que el usuario existe
    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    // Recuperar las cuentas del usuario
    const cuentas = banco.obtenerCuentasDeUsuario(usuarioId);

    // Recuperar movimientos de todas sus cuentas
    const movimientosSinFiltrar = cuentas.flatMap((cuenta) =>
      banco.obtenerMovimientosDeCuenta(cuenta.id),
    );

    // Evitar movimientos duplicados
    const movimientos = movimientosSinFiltrar.filter(
      (movimiento, index, array) =>
        index === array.findIndex((item) => item.id === movimiento.id),
    );

    // Devolver la información encontrada
    return {
      usuario,
      cuentas,
      movimientos,
    };
  }

  /* =========================================
     OBTENER RESUMEN BANCARIO DEL USUARIO
  ========================================= */

  obtenerResumenUsuario(usuarioId) {
    // Recuperar la información del usuario
    const { usuario, cuentas, movimientos } =
      this.obtenerDatosUsuario(usuarioId);

    // Calcular el saldo total de todas sus cuentas
    const saldoTotal = cuentas.reduce(
      (acumulado, cuenta) => acumulado + Number(cuenta.saldo),
      0,
    );

    // Devolver el resumen bancario
    return {
      usuario,
      cuentas,
      movimientos,
      saldoTotal,
      totalCuentas: cuentas.length,
      totalMovimientos: movimientos.length,
    };
  }
} // Cierra la clase BancoService

/* =========================================
   EXPORTAR SERVICIO BANCARIO
========================================= */

export const bancoService = new BancoService();
