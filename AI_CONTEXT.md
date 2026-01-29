# Contexto del Proyecto y Guías para IA (Gemini / Copilot)

Este documento sirve como contexto global para entender la arquitectura, preferencias de trabajo y estándares del proyecto **Gym System**.

## 1. Identidad del Proyecto
- **Nombre**: Gym System.
- **Tipo**: Aplicación de Escritorio (Electron).
- **Propósito**: Sistema de gestión para gimnasios (Socios, Membresías, Pagos, Control de Acceso).
- **Idioma de Comunicación**: **ESPAÑOL** (Siempre).

## 2. Stack Tecnológico

### Core
- **Runtime**: Electron (Backend), Node.js.
- **Frontend**: React 19, Vite.
- **Lenguaje**: **TypeScript** (Estricto).
- **Base de Datos**: SQLite (usando `better-sqlite3`).

### Estilos & UI
- **Framework CSS**: Tailwind CSS v4.
- **Componentes**: Shadcn UI (Radix UI + Tailwind).
- **Iconos**: Lucide React.
- **Estética**: Diseño moderno, limpio, "Premium", con énfasis en UX.

### Herramientas de Build
- **Bundler Main**: `tsup`.
- **Bundler Renderer**: `vite`.
- **Scripts**: `npm run dev:electron` (Desarrollo), `npm run build` (Producción).

## 3. Arquitectura del Proyecto

El proyecto sigue una separación estricta entre **Main Process** (Backend) y **Renderer Process** (Frontend).

### Estructura de Directorios
```
/
├── main/                 # Proceso Principal (Backend)
│   ├── database/         # Conexión y Migraciones (.sql)
│   ├── modules/          # Lógica de Negocio (por dominio: users, members, etc.)
│   │   ├── *.ipc.ts      # Handlers de IPC (Controladores)
│   │   ├── *.service.ts  # Lógica de negocio pura
│   │   └── *.repository.ts # Acceso a Base de Datos (SQL)
│   ├── main.ts           # Entry Point (Ventanas, Lifecycle)
│   └── preload.ts        # IPC Bridge (ContextBridge)
│
├── renderer/             # Proceso de UI (Frontend)
│   ├── components/       # Componentes Reutilizables (ui/ = Shadcn, layout/)
│   ├── modules/          # Vistas por dominio (home, members, memberships)
│   │   ├── pages/        # Componentes de Página conmpletos
│   │   └── components/   # Componentes específicos del módulo (Forms/Sheets)
│   ├── router/           # Configuración de rutas (React Router)
│   └── App.tsx           # Root Component
│
└── shared/               # Código Compartido
    └── types/            # Definiciones de Tipos (DB Models, IPC Contracts)
```

## 4. Convenciones de Código

### TypeScript
- **No usar `any`**: Siempre definir interfaces o tipos.
- **Interfaces Compartidas**: Los modelos de datos (ej. `Member`, `Membership`) deben estar en `shared/types/db-models.ts`.
- **Strict Mode**: Habilitado.

### Manejo de Formularios y Validación (Zod)
- **Patrón `z.input` vs `z.infer`**:
    - Usar `z.input<typeof Schema>` para los valores del formulario (`useForm`). Esto permite manejar campos opcionales que tienen valores por defecto (`default()`) como `undefined` o `null` en la entrada.
    - Usar `z.infer<typeof Schema>` solo cuando necesites el tipo final de salida (output) validado.
- **Campos Opcionales**:
    - En la UI, tratar `undefined` como `null` o valor vacío explícito.
    - Asegurar que `is_active` (boolean) tenga siempre un valor (`true`/`false`) y no `undefined` al enviar al backend.

### Manejo de Fechas y Horas
- **Estándar**: Usar **Hora Local** para persistencia y lógica de negocio, a menos que se especifique lo contrario.
- **Formato de Almacenamiento (DB)**: Strings ISO `YYYY-MM-DD` (solo fecha) o `YYYY-MM-DD HH:MM:SS` (fecha y hora).
- **Frontend**:
    - **EVITAR** `toISOString()` para fechas seleccionadas por el usuario (ej. inputs `date`), ya que convierte a UTC y puede cambiar el día dependiendo de la zona horaria.
    - **USAR** `date.getFullYear()`, `date.getMonth()`, etc., o librerías como `date-fns` para formatear a string local (`yyyy-MM-dd`).
    - Para mostrar fechas: Usar `date-fns` con locale `es` (Español).

### Patrones de Diseño
- **Backend**: Arquitectura en Capas (IPC -> Service -> Repository -> DB).
    - Los repositorios ejecutan SQL puro (`db.prepare()`).
    - Los servicios manejan validaciones y lógica.
    - Los IPC handlers solo exponen métodos al frontend.
- **Frontend**: Modular.
    - Agrupar páginas y componentes por "funcionalidad" en `renderer/modules/`.
    - Usar `window.api` (tipado en `window.d.ts` implícito por preload) para comunicarse con el backend.

### Base de Datos
- **Migraciones**: Archivos SQL numerados en `main/database/migrations` (ej. `001_initial.sql`).
- **Acceso**: `better-sqlite3` en modo síncrono para lecturas/escrituras rápidas (WAL mode activado).

## 5. Preferencias del Usuario
- **Idioma**: Responder y comentar siempre en Español.
- **Commits**: Mensajes de commit en Español, imperativo (ej. "Agregar filtro de socios", "Corregir error de build").
- **Estilo de Respuesta**: Explicaciones claras, paso a paso, actuando como un Senior Developer ("Soy un ingeniero de software experto...").
- **Proactividad**: Si ves un error potencial o una mejora de UX obvia, sugiérela.

## 6. Comandos Comunes
- **Iniciar Desarrollo**: `npm run dev:electron`
- **Build Producción**: `npm run build`
- **Empaquetar**: `npm run dist` (cuando se configure electron-builder).
