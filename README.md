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

v0.2.0 — Arquitectura modular y utilidades base.

## Utilidades implementadas

### Validadores

Archivo: js/utils/validators.js

- validarCampoObligatorio(): comprueba que un campo tenga información.
- validarMonto(): comprueba que un monto sea numérico, finito y positivo.

### Funciones auxiliares

Archivo: js/utils/helpers.js

- generarId(): genera identificadores para los registros del sistema.

### Formateadores

Archivo: js/utils/formatters.js

- formatCurrency(): convierte valores a formato monetario MXN.
- formatDate(): presenta fechas en formato regional mexicano.
- formatAccountNumber(): separa números de cuenta en grupos de cuatro dígitos.

## Historial de versiones

- v0.1.0 — Estructura inicial del proyecto.
- v0.2.0 — Arquitectura modular y utilidades base.
