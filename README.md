# Intranet con Deno Fresh 2.1

Aplicación completa de intranet con autenticación y gestión de usuarios, noticias y tickets.

## Estructura del Proyecto

```
/
├── main.ts                      # Punto de entrada de la aplicación
├── deno.json                    # Configuración de Deno
├── routes/
│   ├── index.tsx                # Página de login
│   ├── dashboard.tsx            # Dashboard principal
│   ├── usuarios.tsx             # Página de usuarios
│   ├── noticias.tsx             # Página de noticias
│   ├── tickets.tsx              # Página de tickets
│   └── api/
│       ├── login.ts             # Endpoint de autenticación
│       └── logout.ts            # Endpoint de cierre de sesión
├── islands/
│   ├── UsuariosIsland.tsx       # Componente interactivo de usuarios
│   ├── NoticiasIsland.tsx       # Componente interactivo de noticias
│   └── TicketsIsland.tsx        # Componente interactivo de tickets
└── static/
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

## Configuración de la API

Todas las llamadas a la API usan URLs de ejemplo que debes reemplazar:

### Endpoints que debes configurar:

**Autenticación:**
- `POST https://api.ejemplo.com/auth/login` - Login
  - Body: `{ "email": "string", "password": "string" }`
  - Respuesta: `{ "token": "string" }`

**Usuarios:**
- `GET https://api.ejemplo.com/usuarios` - Listar usuarios
- `POST https://api.ejemplo.com/usuarios` - Crear usuario
- `PUT https://api.ejemplo.com/usuarios/:id` - Actualizar usuario
- `DELETE https://api.ejemplo.com/usuarios/:id` - Eliminar usuario

**Noticias:**
- `GET https://api.ejemplo.com/noticias` - Listar noticias
- `POST https://api.ejemplo.com/noticias` - Crear noticia
- `PUT https://api.ejemplo.com/noticias/:id` - Actualizar noticia
- `DELETE https://api.ejemplo.com/noticias/:id` - Eliminar noticia

**Tickets:**
- `GET https://api.ejemplo.com/tickets` - Listar tickets
- `POST https://api.ejemplo.com/tickets` - Crear ticket
- `PUT https://api.ejemplo.com/tickets/:id` - Actualizar ticket
- `DELETE https://api.ejemplo.com/tickets/:id` - Eliminar ticket

### Reemplazar URLs

Busca y reemplaza `https://api.ejemplo.com` con tu URL de API real en los siguientes archivos:
- `routes/api/login.ts`
- `islands/UsuariosIsland.tsx`
- `islands/NoticiasIsland.tsx`
- `islands/TicketsIsland.tsx`

## Características

✅ Autenticación con JWT
✅ CRUD completo para usuarios, noticias y tickets
✅ Interfaz responsive
✅ Modales para crear/editar
✅ Confirmación antes de eliminar
✅ Badges de estado y prioridad
✅ Navegación entre secciones
✅ Cierre de sesión

## Modelos de Datos

### Usuario
```typescript
{
  id: number,
  nombre: string,
  email: string,
  rol: "admin" | "editor" | "usuario"
}
```

### Noticia
```typescript
{
  id: number,
  titulo: string,
  contenido: string,
  categoria: "general" | "tecnologia" | "recursos_humanos" | "eventos",
  fecha: string (ISO)
}
```

### Ticket
```typescript
{
  id: number,
  titulo: string,
  descripcion: string,
  prioridad: "baja" | "media" | "alta" | "urgente",
  estado: "abierto" | "en_proceso" | "resuelto" | "cerrado",
  fecha: string (ISO)
}
```

## Personalización

Para personalizar los estilos, edita `static/styles.css`. Los colores principales están definidos en las clases CSS y puedes cambiarlos fácilmente.

## Seguridad

- El token JWT se almacena en una cookie HttpOnly
- Todas las peticiones a la API incluyen el token en el header Authorization
- Las rutas protegidas verifican la cookie antes de mostrar contenido

## Notas

- Esta aplicación es un template base que necesita conectarse a una API real
- Implementa validación del lado del cliente, pero debes tener validación en el servidor también
- Considera agregar middleware para proteger rutas automáticamente
- Añade manejo de errores más robusto según tus necesidades