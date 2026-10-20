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

v0.4.0 — Modelo Banco y reglas del dominio bancario.

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

## Historial de versiones

- v0.1.0 — Estructura inicial del proyecto.
- v0.2.0 — Arquitectura modular y utilidades base.
- v0.3.0 — Modelos Usuario, Cuenta y Movimiento.
- v0.4.0 — Modelo Banco y reglas del dominio bancario.
