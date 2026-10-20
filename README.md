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

v0.3.0 — Programación Orientada a Objetos y modelos bancarios.

## Modelos implementados

### Usuario.js

Representa a un usuario del sistema bancario.

Propiedades:

- id
- nombre
- email
- telefono
- password (solo demostración educativa)

### Cuenta.js

Representa una cuenta bancaria.

Propiedades:

- id
- numeroCuenta
- usuarioId
- saldo

Métodos:

- depositar()
- retirar()

### Movimiento.js

Representa un movimiento bancario.

Propiedades:

- id
- tipo
- monto
- descripcion
- cuentaOrigen
- cuentaDestino
- saldoResultante
- fecha

## Historial de versiones

- v0.1.0 — Estructura inicial del proyecto.
- v0.2.0 — Arquitectura modular y utilidades base.
- v0.3.0 — Modelos Usuario, Cuenta y Movimiento.
