# Trabajo_Final

Sistema de gestión de turnos médicos con roles (Médico, Paciente, Admin).

## Requisitos

- Node.js 18+
- MySQL / MariaDB
- npm

## Instalación

```bash
npm install
```

## Base de datos

1. Crear la base de datos `prog3_turnos` (o el nombre que uses).
2. Importar el archivo SQL del dump (proporcionado por el grupo).
3. Copiar `.env.example` como `.env` y ajustar credenciales:

```
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
```

> El puerto por defecto de MySQL es `3306`. Ajustar según la instalación local.

## Ejecutar

```bash
npm run dev
```

El servidor inicia en `http://localhost:3000`.

## Documentación Swagger

```
http://localhost:3000/api-docs/
```

## Autenticación

Usar `Authorization: Bearer <token>` en los endpoints protegidos.

Endpoints públicos:

- `POST /api/v1/auth/login` — obtener token (email + contraseña)

Las contraseñas de prueba son el prefijo del email antes del `@` (ej: `lopmar@correo.com` → `lopmar`).

## Roles

| Rol     | ID |
|---------|----|
| Médico  | 1  |
| Paciente| 2  |
| Admin   | 3  |
