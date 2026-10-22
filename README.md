# Sistema de Gestión Bancaria

Proyecto integrador correspondiente al Módulo 4.

El objetivo es desarrollar progresivamente un sistema bancario utilizando JavaScript moderno, arquitectura modular, programación orientada a objetos y programación funcional.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- ECMAScript Modules
- Node.js
- npm
- Git
- GitHub

## Arquitectura

El proyecto utilizará las siguientes capas:

- Models
- Services
- UI
- Utils
- Tests

## Funcionalidades previstas

Durante las siguientes versiones se desarrollarán:

- Registro de usuarios.
- Inicio de sesión.
- Gestión de cuentas.
- Depósitos.
- Transferencias.
- Historial de movimientos.
- Persistencia con LocalStorage.
- Manipulación del DOM.
- Manejo de eventos.
- Validaciones.
- Formateadores.
- Librerías visuales.
- Pruebas automatizadas con Jest.
- Git y GitHub.

## Versión actual

v0.6.0 — Registro de usuarios, autenticación, sesiones y dashboard.

## Modelo Banco

Archivo: js/models/Banco.js

La clase Banco coordina usuarios, cuentas y movimientos bancarios.

### Gestión de usuarios

- agregarUsuario()
- buscarUsuarioPorId()

### Gestión de cuentas

- agregarCuenta()
- buscarCuentaPorId()
- buscarCuentaPorNumero()
- obtenerCuentasDeUsuario()

### Gestión de movimientos

- registrarMovimiento()
- obtenerMovimientosDeCuenta()

### Operaciones bancarias

- realizarDeposito()

Este método permite:

1. Validar el monto.
2. Buscar la cuenta bancaria.
3. Actualizar el saldo.
4. Crear automáticamente un movimiento.
5. Registrar el movimiento en el historial.

### Reglas implementadas

- Evitar usuarios con identificadores duplicados.
- Impedir cuentas sin propietario registrado.
- Evitar cuentas duplicadas.
- Rechazar depósitos con montos inválidos.
- Rechazar depósitos en cuentas inexistentes.

## Persistencia con LocalStorage

A partir de v0.5.0, el Sistema de Gestión Bancaria
permite guardar y recuperar información del banco
utilizando LocalStorage.

### Servicio de almacenamiento

Archivo: js/services/StorageService.js

Métodos implementados:

- guardar(): almacena información.
- obtener(): recupera información almacenada.
- eliminar(): elimina una clave específica.
- limpiar(): elimina las claves del origen.

### Datos almacenados

El sistema utiliza las siguientes claves:

- usuarios
- cuentas
- movimientos

- sesion: almacena el identificador del usuario autenticado y la fecha de inicio de sesión.

### Serialización

JSON.stringify() convierte objetos JavaScript
en texto JSON.

JSON.parse() recupera los datos almacenados.

### Reconstrucción de instancias

Después de recuperar la información, el sistema
reconstruye los objetos utilizando:

- new Usuario()
- new Cuenta()
- new Movimiento()

Esto permite conservar los métodos definidos
en las clases.

### Pruebas realizadas

- Recuperación de usuarios.
- Recuperación de cuentas.
- Recuperación de movimientos.
- Persistencia del saldo.
- Reconstrucción de instancias.
- Conservación de métodos de Cuenta.
- Validación de datos después de recargar Chrome.

Nota: proyecto educativo con información ficticia.
No utilizar contraseñas reales en LocalStorage.

## Versión v0.6.0 — Registro y autenticación

En esta versión se implementó una interfaz de autenticación
para el Sistema de Gestión Bancaria.

### Funcionalidades implementadas

- Formulario de registro de usuarios.
- Formulario de inicio de sesión.
- Validación de campos obligatorios.
- Validación de contraseñas.
- Prevención de correos electrónicos duplicados.
- Generación automática de números de cuenta ficticios.
- Creación de usuarios y cuentas bancarias.
- Persistencia de datos mediante LocalStorage.
- Inicio y cierre de sesión.
- Dashboard con información del usuario autenticado.
- Visualización del número de cuenta y saldo.
- Redirección cuando no existe una sesión activa.
- Alertas y confirmaciones con SweetAlert2.

### Archivos principales

- index.html: formularios de registro e inicio de sesión.
- dashboard.html: panel del usuario autenticado.
- css/styles.css: estilos de la interfaz.
- js/main.js: registro, validaciones y login.
- js/services/AuthService.js: autenticación y sesiones.
- js/services/StorageService.js: persistencia de datos.
- js/ui/dashboard.js: visualización del dashboard.
- js/utils/helpers.js: generación de números de cuenta.

### Pruebas realizadas

- Registro exitoso de usuarios ficticios.
- Detección de correos duplicados.
- Validación de contraseñas.
- Inicio de sesión con credenciales correctas.
- Rechazo de credenciales incorrectas.
- Persistencia de la sesión después de recargar.
- Visualización del usuario, cuenta y saldo.
- Cierre de sesión.
- Redirección al login sin sesión activa.

### Consideraciones de seguridad

Este proyecto es exclusivamente educativo.

La autenticación se simula en el navegador mediante
LocalStorage. No debe utilizarse con contraseñas reales,
información bancaria auténtica ni en producción.

## Historial de versiones

- v0.1.0 — Estructura inicial del proyecto.
- v0.2.0 — Arquitectura modular y utilidades base.
- v0.3.0 — Modelos Usuario, Cuenta y Movimiento.
- v0.4.0 — Modelo Banco y reglas del dominio bancario.
- v0.5.0 — Persistencia con LocalStorage y StorageService.
- v0.6.0 — Registro de usuarios, autenticación, sesiones y dashboard.
