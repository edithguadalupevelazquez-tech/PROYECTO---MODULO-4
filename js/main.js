/* =========================================
   SISTEMA DE GESTIÓN BANCARIA v0.6.0
   IMPORTACIONES
========================================= */

import { Usuario } from "./models/Usuario.js";

import { Cuenta } from "./models/Cuenta.js";

import { generarNumeroCuenta } from "./utils/helpers.js";

import { validarCampoObligatorio } from "./utils/validators.js";

import { STORAGE_KEYS, storageService } from "./services/StorageService.js";

import { authService } from "./services/AuthService.js";

/* =========================================
   INICIALIZAR LOCALSTORAGE
========================================= */

function inicializarStorage() {
  const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, null);

  const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, null);

  const movimientos = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, null);

  // Crear arreglos vacíos solamente si no existen
  if (usuarios === null) {
    storageService.guardar(STORAGE_KEYS.USUARIOS, []);
  }

  if (cuentas === null) {
    storageService.guardar(STORAGE_KEYS.CUENTAS, []);
  }

  if (movimientos === null) {
    storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, []);
  }
}

/* =========================================
   MANEJAR REGISTRO
========================================= */

function manejarRegistro(event) {
  // Evitar que el formulario recargue la página
  event.preventDefault();

  // Obtener valores de los campos
  const nombre = document.querySelector("#registroNombre").value.trim();

  const email = document
    .querySelector("#registroEmail")
    .value.trim()
    .toLowerCase();

  const telefono = document.querySelector("#registroTelefono").value.trim();

  const password = document.querySelector("#registroPassword").value;

  const confirmarPassword = document.querySelector(
    "#registroConfirmPassword",
  ).value;

  /* =========================================
   VALIDAR CAMPOS OBLIGATORIOS
========================================= */

  if (
    !validarCampoObligatorio(nombre) ||
    !validarCampoObligatorio(email) ||
    !validarCampoObligatorio(password)
  ) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Completa los campos obligatorios.",
    });

    return;
  }

  /* =========================================
   VALIDAR LONGITUD DE CONTRASEÑA
========================================= */

  if (password.length < 6) {
    Swal.fire({
      icon: "warning",
      title: "Contraseña inválida",
      text: "La contraseña debe tener al menos 6 caracteres.",
    });

    return;
  }

  /* =========================================
   CONFIRMAR CONTRASEÑA
========================================= */

  if (password !== confirmarPassword) {
    Swal.fire({
      icon: "warning",
      title: "Contraseñas diferentes",
      text: "Las contraseñas no coinciden.",
    });

    return;
  }

  /* =========================================
   VALIDACIONES SUPERADAS
========================================= */

  /* =========================================
   VALIDAR CORREO DUPLICADO
========================================= */

  // Recuperar usuarios almacenados
  const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

  // Buscar si el correo ya está registrado
  const correoExiste = usuarios.some(
    (usuario) => usuario.email.trim().toLowerCase() === email,
  );

  // Evitar registros duplicados
  if (correoExiste) {
    Swal.fire({
      icon: "error",
      title: "Correo ya registrado",
      text: "Ya existe un usuario con ese correo electrónico.",
    });

    return;
  }

  /* =========================================
   VALIDACIONES SUPERADAS
========================================= */

  /* =========================================
   CREAR USUARIO Y CUENTA BANCARIA
========================================= */

  try {
    // Crear usuario ficticio
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      telefono,
      password,
    });

    // Crear un número de cuenta que no esté repetido
    const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);

    let numeroCuenta;
    let numeroRepetido;

    do {
      numeroCuenta = generarNumeroCuenta();

      numeroRepetido = cuentas.some(
        (cuenta) => cuenta.numeroCuenta === numeroCuenta,
      );
    } while (numeroRepetido);

    // Crear cuenta asociada al usuario
    const nuevaCuenta = new Cuenta({
      numeroCuenta,
      usuarioId: nuevoUsuario.id,
    });

    // Guardar usuario y cuenta
    storageService.guardar(STORAGE_KEYS.USUARIOS, [...usuarios, nuevoUsuario]);

    storageService.guardar(STORAGE_KEYS.CUENTAS, [...cuentas, nuevaCuenta]);

    // Mostrar confirmación
    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text: "Tu usuario y cuenta de demostración fueron creados.",
    });

    // Limpiar formulario
    event.target.reset();

    console.log("Usuario registrado correctamente.");
    console.log("Número de cuenta:", numeroCuenta);
  } catch (error) {
    console.error("Error durante el registro:", error);

    Swal.fire({
      icon: "error",
      title: "No se pudo completar el registro",
      text: "Intenta nuevamente.",
    });
  }
} // Cierra la función manejarRegistro()

/* =========================================
   MANEJAR INICIO DE SESIÓN
   Sistema de Gestión Bancaria v0.6.0
========================================= */

async function manejarLogin(event) {
  // Evitar que el formulario recargue la página
  event.preventDefault();

  // Obtener los valores del formulario
  const email = document
    .querySelector("#loginEmail")
    .value.trim()
    .toLowerCase();

  const password = document.querySelector("#loginPassword").value;

  // Validar campos obligatorios
  if (!email || !password) {
    await Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Ingresa tu correo y contraseña.",
    });

    return;
  }

  try {
    // Comprobar credenciales y crear sesión
    const usuario = authService.login(email, password);

    // Mostrar mensaje de bienvenida
    await Swal.fire({
      icon: "success",
      title: "Inicio de sesión exitoso",
      text: `Bienvenido, ${usuario.nombre}`,
    });

    console.log("Inicio de sesión correcto.");
    window.location.href = "./dashboard.html";
  } catch (error) {
    await Swal.fire({
      icon: "error",
      title: "No fue posible iniciar sesión",
      text: "Correo o contraseña incorrectos.",
    });
  }
}

/* =========================================
   INICIALIZAR APLICACIÓN
========================================= */

function init() {
  inicializarStorage();

  const formRegistro = document.querySelector("#formRegistro");

  /* =========================================
   CONECTAR FORMULARIO DE LOGIN
========================================= */

  const formLogin = document.querySelector("#formLogin");

  if (formLogin) {
    formLogin.addEventListener("submit", manejarLogin);
  }

  if (formRegistro) {
    formRegistro.addEventListener("submit", manejarRegistro);
  }

  console.log("Sistema de Gestión Bancaria - v0.6.0");
}

init();
