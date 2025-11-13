# Intranet con Deno Fresh 2.1

Aplicación completa de intranet con autenticación y gestión de usuarios, noticias y tickets.

## Estructura del Proyecto

```
/
├── main.ts                     # Punto de entrada de la aplicación
├── deno.json                   # Configuración de Deno
├── routes/
|   |── (index)
│   |    └── index.ts           # Login  
│   └── (main)
│       ├── dashboard.ts        # DashBoard Admin
|       ├── news.ts             # Ruta Noticias
|       ├── user.ts             # Ruta Usuarios
│       └── tickets.ts          # Ruta Tickets
|
└── assets/
    └── styles.css               # Estilos CSS
```

## Instalación

1. Instala Deno si no lo tienes: https://deno.land/

2. Clona o descarga el proyecto

3. Ejecuta la aplicación en modo desarrollo:
```bash
deno task dev
```

4. Abre tu navegador en `http://localhost:8000`

## Notas

- Esta aplicación esta conectada al Backend de Trenfe
- Implementa validación del lado del cliente
- Implementa middleware basado en Cookies
- Añade manejo de errores más robusto según tus necesidades
