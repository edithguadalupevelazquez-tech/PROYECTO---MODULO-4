/* =========================================
   SERVICIO DE AUTENTICACIÓN
   Sistema de Gestión Bancaria v0.6.0
========================================= */

// Importar servicio de almacenamiento
import { STORAGE_KEYS, storageService } from "./StorageService.js";

/* =========================================
   CLASE AUTH SERVICE
========================================= */

class AuthService {
  /* =========================================
       INICIAR SESIÓN
    ========================================= */

  login(email, password) {
    // Recuperar usuarios registrados
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    // Normalizar el correo electrónico
    const emailNormalizado = String(email).trim().toLowerCase();

    // Buscar un usuario con las credenciales
    const usuario = usuarios.find(
      (u) =>
        u.email.toLowerCase() === emailNormalizado &&
        u.password === password &&
        u.activo !== false,
    );

    // Comprobar si las credenciales son correctas
    if (!usuario) {
      throw new Error("Correo o contraseña incorrectos.");
    }

    // Crear la sesión
    const sesion = {
      usuarioId: usuario.id,
      fechaInicio: new Date().toISOString(),
    };

    // Guardar la sesión en LocalStorage
    storageService.guardar(STORAGE_KEYS.SESION, sesion);

    // Devolver el usuario autenticado
    return usuario;
  }

  /* =========================================
   CERRAR SESIÓN
========================================= */

  logout() {
    // Eliminar únicamente la sesión
    storageService.eliminar(STORAGE_KEYS.SESION);
  }

  /* =========================================
   OBTENER USUARIO ACTUAL
========================================= */

  getCurrentUser() {
    // Recuperar la sesión guardada
    const sesion = storageService.obtener(STORAGE_KEYS.SESION, null);

    // Si no existe sesión, devolver null
    if (!sesion) {
      return null;
    }

    // Recuperar usuarios registrados
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    // Buscar al usuario autenticado
    return usuarios.find((usuario) => usuario.id === sesion.usuarioId) || null;
  }

  /* =========================================
   PROTEGER RUTA
========================================= */

  protegerRuta() {
    // Recuperar el usuario autenticado
    const usuario = this.getCurrentUser();

    // Si no hay usuario, regresar al login
    if (!usuario) {
      window.location.href = "index.html";

      return false;
    }

    // Permitir acceso
    return true;
  }
} // Cierra la clase AuthService

/* =========================================
   EXPORTAR SERVICIO DE AUTENTICACIÓN
========================================= */

export const authService = new AuthService();
