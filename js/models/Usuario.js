/* =========================================
   MODELO USUARIO
   Sistema de Gestión Bancaria v0.3.0
========================================= */

// Importamos la función para generar IDs
import { generarId } from "../utils/helpers.js";

// Exportamos nuestra clase Usuario
export class Usuario {
  constructor({ id = generarId(), nombre, email, telefono, password }) {
    // Identificador único del usuario
    this.id = id;

    // Nombre del usuario
    this.nombre = nombre;

    // Correo electrónico
    this.email = email;

    // Teléfono
    this.telefono = telefono;

    // Contraseña de demostración
    this.password = password;
  }
}
