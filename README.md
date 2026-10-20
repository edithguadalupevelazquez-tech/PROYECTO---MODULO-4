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

v0.5.0 — Persistencia con LocalStorage y StorageService.

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
- sesion (reservada para versiones posteriores)

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

## Historial de versiones

- v0.1.0 — Estructura inicial del proyecto.
- v0.2.0 — Arquitectura modular y utilidades base.
- v0.3.0 — Modelos Usuario, Cuenta y Movimiento.
- v0.4.0 — Modelo Banco y reglas del dominio bancario.
