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

  /* =========================================
     ACTUALIZAR USUARIO
     Sistema de Gestión Bancaria v0.8.0
  ========================================= */

  actualizarUsuario(usuarioId, { nombre, email, telefono }) {
    // Recuperar los usuarios almacenados
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    // Buscar el usuario que queremos modificar
    const usuario = usuarios.find((item) => item.id === usuarioId);

    // Comprobar que exista
    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    /* =========================================
       NORMALIZAR CORREO ELECTRÓNICO
    ========================================= */

    // Eliminar espacios y convertir a minúsculas
    const emailNormalizado = String(email).trim().toLowerCase();

    /* =========================================
       VALIDAR CORREO DUPLICADO
    ========================================= */

    // Buscar si otro usuario tiene ese correo
    const emailDuplicado = usuarios.some(
      (item) =>
        item.email.trim().toLowerCase() === emailNormalizado &&
        item.id !== usuarioId,
    );

    // Impedir utilizar un correo registrado por otro usuario
    if (emailDuplicado) {
      throw new Error("Ya existe un usuario con este correo.");
    }

    /* =========================================
       VALIDAR DATOS OBLIGATORIOS
    ========================================= */

    const nombreNormalizado = String(nombre ?? "").trim();
    const telefonoNormalizado = String(telefono ?? "").trim();

    if (!nombreNormalizado || !emailNormalizado) {
      throw new Error("Nombre y correo son obligatorios.");
    }

    /* =========================================
       ACTUALIZAR USUARIO CON MAP()
    ========================================= */

    const usuariosActualizados = usuarios.map((item) =>
      item.id === usuarioId
        ? {
            ...item,
            nombre: nombreNormalizado,
            email: emailNormalizado,
            telefono: telefonoNormalizado,
          }
        : item,
    );

    /* =========================================
       GUARDAR CAMBIOS
    ========================================= */

    storageService.guardar(STORAGE_KEYS.USUARIOS, usuariosActualizados);

    // Actualizar la instancia del banco
    this.recargarBanco();

    // Devolver el usuario actualizado
    return usuariosActualizados.find((item) => item.id === usuarioId);
  }

  /* =========================================
     CAMBIAR CONTRASEÑA
     Sistema de Gestión Bancaria v0.8.0
  ========================================= */

  cambiarPassword(usuarioId, passwordActual, passwordNueva) {
    // Recuperar los usuarios almacenados
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    // Buscar al usuario por su identificador
    const usuario = usuarios.find((item) => item.id === usuarioId);

    // Comprobar que el usuario exista
    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    /* =========================================
       VERIFICAR CONTRASEÑA ACTUAL
    ========================================= */

    if (usuario.password !== passwordActual) {
      throw new Error("La contraseña actual es incorrecta.");
    }

    /* =========================================
       VALIDAR NUEVA CONTRASEÑA
    ========================================= */

    // Comprobar longitud mínima
    if (typeof passwordNueva !== "string" || passwordNueva.length < 6) {
      throw new Error("La nueva contraseña debe tener al menos 6 caracteres.");
    }

    // Evitar reutilizar la contraseña anterior
    if (passwordNueva === passwordActual) {
      throw new Error("La nueva contraseña debe ser diferente de la actual.");
    }

    /* =========================================
       ACTUALIZAR CONTRASEÑA
    ========================================= */

    // Crear un arreglo con los usuarios actualizados
    const usuariosActualizados = usuarios.map((item) =>
      item.id === usuarioId
        ? {
            ...item,
            password: passwordNueva,
          }
        : item,
    );

    /* =========================================
       GUARDAR CAMBIOS
    ========================================= */

    storageService.guardar(STORAGE_KEYS.USUARIOS, usuariosActualizados);

    // Recargar la instancia bancaria
    this.recargarBanco();

    // Confirmar que la operación terminó
    return true;
  } // Cierra cambiarPassword()

  /* =========================================
     ELIMINAR USUARIO
     Sistema de Gestión Bancaria v0.8.0
  ========================================= */

  eliminarUsuario(usuarioId) {
    // Recuperar los datos bancarios actuales
    const banco = this.recargarBanco();

    // Buscar al usuario
    const usuario = banco.buscarUsuarioPorId(usuarioId);

    // Comprobar que exista
    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    /* =========================================
       VALIDAR USUARIO DE LA SESIÓN
       Sistema de Gestión Bancaria v0.8.0
    ========================================= */

    // Recuperar la sesión activa
    const sesion = storageService.obtener(STORAGE_KEYS.SESION, null);

    // Comprobar que la sesión pertenezca al usuario
    if (!sesion || sesion.usuarioId !== usuarioId) {
      throw new Error(
        "No puedes eliminar un usuario diferente al autenticado.",
      );
    }

    // Recuperar todas las cuentas del usuario
    const cuentas = banco.obtenerCuentasDeUsuario(usuarioId);

    // Comprobar si alguna cuenta tiene saldo distinto de cero

    // Comprobar que todas las cuentas tengan saldo cero
    const tieneSaldoInvalido = cuentas.some((cuenta) => {
      const saldo = cuenta.saldo;

      return (
        saldo === null ||
        saldo === undefined ||
        String(saldo).trim() === "" ||
        !Number.isFinite(Number(saldo)) ||
        Number(saldo) !== 0
      );
    });

    // Impedir eliminar cuentas con saldo o saldo inválido
    if (tieneSaldoInvalido) {
      throw new Error(
        "No puedes eliminar tu usuario mientras tengas saldo en tus cuentas o exista un saldo inválido.",
      );
    }

    /* =========================================
       IDENTIFICAR CUENTAS DEL USUARIO
    ========================================= */

    // Crear un arreglo con los identificadores de sus cuentas
    const cuentasIds = cuentas.map((cuenta) => cuenta.id);

    /* =========================================
       PREPARAR USUARIOS Y CUENTAS
    ========================================= */

    // Conservar solamente los demás usuarios
    const usuariosRestantes = banco.usuarios.filter(
      (item) => item.id !== usuarioId,
    );

    // Conservar las cuentas de otros usuarios
    const cuentasRestantes = banco.cuentas.filter(
      (cuenta) => cuenta.usuarioId !== usuarioId,
    );

    /* =========================================
       PREPARAR MOVIMIENTOS RESTANTES
    ========================================= */

    // Identificar las cuentas que pertenecen al usuario
    const idsEliminados = new Set(cuentasIds);

    // Conservar los movimientos relacionados con otras cuentas
    const movimientosRestantes = banco.movimientos.filter((movimiento) => {
      const origenEliminado = idsEliminados.has(movimiento.cuentaOrigen);

      const destinoEliminado = idsEliminados.has(movimiento.cuentaDestino);

      // Conservar movimientos que involucren otras cuentas
      const origenEsOtraCuenta =
        movimiento.cuentaOrigen != null && !origenEliminado;

      const destinoEsOtraCuenta =
        movimiento.cuentaDestino != null && !destinoEliminado;

      return origenEsOtraCuenta || destinoEsOtraCuenta;
    });

    /* =========================================
       VERIFICAR INTEGRIDAD DE MOVIMIENTOS
    ========================================= */

    // Identificar las cuentas que permanecerán
    const cuentasRestantesIds = new Set(
      cuentasRestantes.map((cuenta) => cuenta.id),
    );
    // Comprobar que cada movimiento conservado
    // esté relacionado con una cuenta existente
    const movimientosValidos = movimientosRestantes.every(
      (movimiento) =>
        cuentasRestantesIds.has(movimiento.cuentaOrigen) ||
        cuentasRestantesIds.has(movimiento.cuentaDestino),
    );
    // Detener la operación si existen inconsistencias
    if (!movimientosValidos) {
      throw new Error(
        "No se puede eliminar el usuario porque existen movimientos inconsistentes.",
      );
    }

    /* =========================================
       PREPARAR RESPALDO PARA RECUPERACIÓN
    ========================================= */

    // Guardar una copia de los datos actuales
    const respaldo = {
      usuarios: localStorage.getItem(STORAGE_KEYS.USUARIOS),
      cuentas: localStorage.getItem(STORAGE_KEYS.CUENTAS),
      movimientos: localStorage.getItem(STORAGE_KEYS.MOVIMIENTOS),
    };

    // Preparar los nuevos datos como JSON
    const nuevosDatos = {
      usuarios: JSON.stringify(usuariosRestantes),
      cuentas: JSON.stringify(cuentasRestantes),
      movimientos: JSON.stringify(movimientosRestantes),
    };

    /* =========================================
       GUARDAR ELIMINACIÓN CON RECUPERACIÓN
    ========================================= */

    try {
      // Guardar los usuarios restantes
      localStorage.setItem(STORAGE_KEYS.USUARIOS, nuevosDatos.usuarios);

      // Guardar las cuentas restantes
      localStorage.setItem(STORAGE_KEYS.CUENTAS, nuevosDatos.cuentas);

      // Guardar los movimientos restantes
      localStorage.setItem(STORAGE_KEYS.MOVIMIENTOS, nuevosDatos.movimientos);
    } catch (error) {
      // Intentar recuperar los datos originales
      try {
        for (const clave of [
          STORAGE_KEYS.USUARIOS,
          STORAGE_KEYS.CUENTAS,
          STORAGE_KEYS.MOVIMIENTOS,
        ]) {
          const valorAnterior =
            clave === STORAGE_KEYS.USUARIOS
              ? respaldo.usuarios
              : clave === STORAGE_KEYS.CUENTAS
                ? respaldo.cuentas
                : respaldo.movimientos;

          if (valorAnterior === null) {
            localStorage.removeItem(clave);
          } else {
            localStorage.setItem(clave, valorAnterior);
          }
        }
      } catch (errorRecuperacion) {
        console.error(
          "No fue posible restaurar todos los datos:",
          errorRecuperacion,
        );
      }

      // Descartar la instancia bancaria anterior
      this._banco = null;

      throw new Error(
        "No fue posible completar la eliminación. Revisa los datos antes de continuar.",
      );
    }

    // Descartar la instancia anterior
    this._banco = null;

    // Confirmar que la operación terminó
    return true;
  } // Cierra eliminarUsuario()
} // Cierra la clase BancoService

/* =========================================
   EXPORTAR SERVICIO BANCARIO
========================================= */

export const bancoService = new BancoService();
