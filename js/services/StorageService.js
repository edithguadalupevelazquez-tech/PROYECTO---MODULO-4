/* =========================================
   SERVICIO DE ALMACENAMIENTO
   Sistema de Gestión Bancaria v0.5.0
========================================= */

/* =========================================
   CLAVES DE LOCALSTORAGE
========================================= */

export const STORAGE_KEYS = {
  USUARIOS: "usuarios",

  CUENTAS: "cuentas",

  MOVIMIENTOS: "movimientos",

  SESION: "sesion",
};

/* =========================================
   CLASE STORAGE SERVICE
========================================= */

class StorageService {
  /* =========================================
       GUARDAR INFORMACIÓN
    ========================================= */

  guardar(clave, valor) {
    // Convertir el valor a texto JSON
    const valorJSON = JSON.stringify(valor);

    // Guardar información en LocalStorage
    localStorage.setItem(clave, valorJSON);
  }

  /* =========================================
   OBTENER INFORMACIÓN
========================================= */

  obtener(clave, valorPorDefecto = null) {
    // Recuperar el valor almacenado
    const valor = localStorage.getItem(clave);

    // Si no existe, devolver el valor por defecto
    if (valor === null) {
      return valorPorDefecto;
    }

    // Convertir el texto JSON a JavaScript
    try {
      return JSON.parse(valor);
    } catch (error) {
      console.error(
        `No fue posible leer la clave "${clave}" de LocalStorage.`,
        error,
      );

      return valorPorDefecto;
    }
  }

  /* =========================================
   ELIMINAR INFORMACIÓN
========================================= */

  eliminar(clave) {
    // Eliminar únicamente la clave indicada
    localStorage.removeItem(clave);
  }

  /* =========================================
   LIMPIAR LOCALSTORAGE
========================================= */

  limpiar() {
    // Eliminar todas las claves del sitio
    localStorage.clear();
  }
}

/* =========================================
   CREAR INSTANCIA DEL SERVICIO
========================================= */

export const storageService = new StorageService();
