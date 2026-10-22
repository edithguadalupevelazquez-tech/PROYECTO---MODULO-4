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

v0.8.0 — Gestión de cuenta, actualización de perfil, cambio de contraseña y eliminación de usuarios ficticios.

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

## Versión v0.7.0 — Servicio bancario y dashboard

En esta versión se implementó BancoService para
centralizar la consulta y administración de los datos
bancarios del sistema.

### BancoService

Archivo: js/services/BancoService.js

Métodos implementados:

- cargarBanco(): recupera los datos de LocalStorage y reconstruye las instancias de los modelos bancarios.
- obtenerInstanciaBanco(): devuelve el banco actual.
- recargarBanco(): actualiza la instancia desde LocalStorage.
- guardarBanco(): guarda usuarios, cuentas y movimientos.
- obtenerDatosUsuario(): consulta los datos bancarios de un usuario específico.
- obtenerResumenUsuario(): calcula el resumen bancario de un usuario.

### Dashboard bancario

Archivos principales:

- dashboard.html
- js/ui/DashboardUI.js
- css/styles.css

El dashboard muestra:

- Nombre del usuario autenticado.
- Saldo total de sus cuentas.
- Cantidad de cuentas bancarias.
- Cantidad de movimientos.
- Número de cuenta principal.
- Tipo de cuenta.
- Saldo disponible.

### Arquitectura

El dashboard utiliza AuthService para identificar
al usuario autenticado y BancoService para consultar
su información bancaria.

StorageService administra la persistencia en LocalStorage.

### Pruebas realizadas

- Recuperación de usuarios, cuentas y movimientos.
- Reconstrucción de instancias de Banco y Cuenta.
- Consulta del resumen bancario de un usuario.
- Visualización del dashboard en Chrome.
- Cierre de sesión.
- Conservación de los datos después de recargar.
- Conservación de usuarios y cuentas al cerrar sesión.

### Consideraciones de seguridad

Este proyecto es una simulación educativa.

LocalStorage no proporciona autenticación segura
ni debe utilizarse para almacenar contraseñas reales
o información bancaria sensible.

## Versión v0.8.0 — Gestión de cuenta y seguridad

En esta versión se implementó la página **Mi cuenta**, que permite consultar información bancaria y administrar los datos personales de los usuarios ficticios.

### Funcionalidades implementadas

- Visualización de la información de la cuenta bancaria.
- Consulta del número de cuenta, tipo, saldo y fecha de apertura.
- Actualización de nombre, correo electrónico y teléfono.
- Validación de campos obligatorios y correos duplicados.
- Cambio de contraseña ficticia.
- Validación de la contraseña actual.
- Confirmación de la nueva contraseña.
- Persistencia de cambios mediante LocalStorage.
- Eliminación de usuarios ficticios y sus cuentas bancarias.
- Validación de saldo cero antes de permitir la eliminación.
- Conservación de movimientos compartidos con otras cuentas.
- Doble confirmación de eliminación mediante SweetAlert2.
- Comprobación de que la sesión corresponde al usuario seleccionado.
- Cierre de sesión después de una eliminación exitosa.

### Archivos principales

- `cuenta.html`: página Mi cuenta.
- `js/ui/CuentaUI.js`: interfaz, formularios y eventos.
- `js/services/BancoService.js`: actualización de usuarios, cambio de contraseña y eliminación.
- `js/services/AuthService.js`: autenticación y gestión de sesiones.
- `js/services/StorageService.js`: persistencia mediante LocalStorage.
- `css/styles.css`: estilos de la interfaz.

### Pruebas realizadas

- Visualización de información bancaria en Chrome.
- Actualización de datos personales.
- Persistencia de cambios después de recargar.
- Validación de contraseñas incorrectas.
- Cambio exitoso de contraseña.
- Inicio de sesión con la nueva contraseña ficticia.
- Validación de cuentas con saldo cero.
- Doble confirmación antes de eliminar.
- Eliminación de un usuario ficticio desechable.
- Conservación de los demás usuarios, cuentas y movimientos.
- Comprobación básica de integridad de datos.
- Verificación de sintaxis mediante `node --check`.

### Consideraciones de seguridad

Este proyecto es exclusivamente educativo.

La autenticación y las operaciones bancarias se simulan mediante JavaScript y LocalStorage.

Las contraseñas se almacenan de forma no segura para fines de aprendizaje. No deben utilizarse contraseñas reales ni información bancaria sensible.

La validación de sesión en el navegador no constituye autorización segura para un sistema de producción.

La recuperación de datos ante errores de almacenamiento es de mejor esfuerzo y no garantiza transacciones atómicas.

## Historial de versiones

- v0.1.0 — Estructura inicial del proyecto.
- v0.2.0 — Arquitectura modular y utilidades base.
- v0.3.0 — Modelos Usuario, Cuenta y Movimiento.
- v0.4.0 — Modelo Banco y reglas del dominio bancario.
- v0.5.0 — Persistencia con LocalStorage y StorageService.
- v0.6.0 — Registro de usuarios, autenticación, sesiones y dashboard.
- v0.7.0 — BancoService y dashboard bancario con resumen de cuentas y movimientos.
- v0.8.0 — Gestión de cuenta, actualización de perfil, cambio de contraseña y eliminación de usuarios ficticios.
