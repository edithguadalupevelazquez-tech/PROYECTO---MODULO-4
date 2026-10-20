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

import { Banco } from "./models/Banco.js";

/* =========================================
   IMPORTAR SERVICIO DE PERSISTENCIA
========================================= */

import { STORAGE_KEYS, storageService } from "./services/StorageService.js";

//PUNTO DE ENTRADA DE LA APLICACIÓN

console.log("Sistema de Gestión Bancaria - v0.5.0");

/* =========================================
   GUARDAR ESTADO DEL BANCO
========================================= */

function guardarBanco(banco) {
  // Guardar usuarios
  storageService.guardar(STORAGE_KEYS.USUARIOS, banco.usuarios);

  // Guardar cuentas
  storageService.guardar(STORAGE_KEYS.CUENTAS, banco.cuentas);

  // Guardar movimientos
  storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, banco.movimientos);
}

/* =========================================
   CARGAR BANCO DESDE LOCALSTORAGE
   Sistema de Gestión Bancaria v0.5.0
========================================= */

function cargarBanco() {
  /* =========================================
       RECUPERAR USUARIOS
    ========================================= */

  const usuariosGuardados = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

  /* =========================================
       RECUPERAR CUENTAS
    ========================================= */

  const cuentasGuardadas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);

  /* =========================================
       RECUPERAR MOVIMIENTOS
    ========================================= */

  const movimientosGuardados = storageService.obtener(
    STORAGE_KEYS.MOVIMIENTOS,
    [],
  );

  /* =========================================
       RECONSTRUIR INSTANCIAS
    ========================================= */

  const usuarios = usuariosGuardados.map((usuario) => new Usuario(usuario));

  const cuentas = cuentasGuardadas.map((cuenta) => new Cuenta(cuenta));

  const movimientos = movimientosGuardados.map(
    (movimiento) => new Movimiento(movimiento),
  );

  /* =========================================
       CREAR BANCO CON DATOS RECUPERADOS
    ========================================= */

  return new Banco({
    usuarios,
    cuentas,
    movimientos,
  });
}

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
   VERSION v0.5.0
========================================= */

console.log("Sistema de Gestión Bancaria - POO v0.5.0");
/* =========================================
   CREAR BANCO
========================================= */

const bancoDemo = cargarBanco();

/* =========================================
   DATOS INICIALES DEL BANCO
========================================= */

// Crear datos solo cuando no existan usuarios
if (bancoDemo.usuarios.length === 0) {
  // Crear usuario de demostración
  const usuarioDemo = new Usuario({
    nombre: "Ana López",
    email: "ana@ejemplo.com",
    telefono: "5512345678",
    password: "123456",
  });

  bancoDemo.agregarUsuario(usuarioDemo);

  // Crear cuenta bancaria
  const cuentaDemo = new Cuenta({
    numeroCuenta: "123456789012",
    usuarioId: usuarioDemo.id,
  });

  bancoDemo.agregarCuenta(cuentaDemo);

  // Realizar depósito inicial
  bancoDemo.realizarDeposito({
    cuentaId: cuentaDemo.id,
    monto: 1000,
    descripcion: "Depósito inicial",
  });

  // Guardar usuarios, cuentas y movimientos
  guardarBanco(bancoDemo);

  console.log("Datos iniciales creados y guardados.");
}

/* =========================================
   MOSTRAR DATOS RECUPERADOS
========================================= */

console.log("Banco recuperado:", bancoDemo);

console.log("Usuarios almacenados:", bancoDemo.usuarios.length);

console.log("Cuentas almacenadas:", bancoDemo.cuentas.length);

console.log("Movimientos almacenados:", bancoDemo.movimientos.length);

/* =========================================
   COMPROBAR SALDO PERSISTIDO
========================================= */

const cuentaPrincipal = bancoDemo.cuentas[0] || null;

if (cuentaPrincipal) {
  console.log("Saldo persistido:", formatCurrency(cuentaPrincipal.saldo));

  // Comprobar reconstrucción de la clase
  console.log(
    "¿La cuenta es instancia de Cuenta?",
    cuentaPrincipal instanceof Cuenta,
  );

  // Comprobar que conserva sus métodos
  console.log("Tipo de depositar:", typeof cuentaPrincipal.depositar);
}
