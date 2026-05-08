# 📊 Inmuebles - Sistema de Gestión de Inmuebles y Tareas

<div align="center">

![Inmuebles Logo](https://img.shields.io/badge/Inmuebles-Real%20Estate%20Ops-blue?style=for-the-badge&logo=react)

**Una aplicación moderna de gestión de proyectos y tareas construida con React, TypeScript y HeroUI**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.11-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![HeroUI](https://img.shields.io/badge/HeroUI-2.4.22-FF6B6B?style=flat-square)](https://heroui.com/)

</div>

## 🚀 Características

- ✅ **Autenticación completa** - Registro e inicio de sesión con JWT
- 📋 **Gestión de proyectos** - Crear, listar y gestionar proyectos
- 📝 **Gestión de tareas** - Crear, editar, eliminar y cambiar estado de tareas
- 🔍 **Filtrado avanzado** - Búsqueda y filtros para proyectos y tareas
- 🎨 **Interfaz moderna** - Diseño responsivo con HeroUI y Tailwind CSS
- 🔒 **Rutas protegidas** - Navegación segura basada en autenticación
- 💾 **Persistencia** - Token de autenticación guardado en localStorage
- 🌙 **Tema oscuro/claro** - Soporte para cambio de tema

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 18.3.1** - Biblioteca de interfaz de usuario
- **TypeScript 5.6.3** - Tipado estático
- **Vite 6.0.11** - Herramienta de construcción y desarrollo
- **HeroUI 2.4.22** - Biblioteca de componentes de UI
- **Tailwind CSS 4.1.11** - Framework de CSS utilitario
- **Redux Toolkit 2.9.0** - Gestión de estado
- **React Router DOM 6.23.0** - Enrutamiento
- **Axios 1.12.2** - Cliente HTTP

### Herramientas de Desarrollo

- **ESLint** - Linter de código
- **Prettier** - Formateador de código
- **Husky** - Git hooks
- **lint-staged** - Linting en archivos staged

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (versión 8 o superior)
- **Git**

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd inmuebles_front
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto frontend:

```env
# URL del backend API
VITE_API_URL=http://127.0.0.1:8000

# Entorno de desarrollo
VITE_NODE_ENV=development
```

### 4. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── AppRouter.tsx   # Router principal
│   │   ├── navbar.tsx      # Barra de navegación
│   │   └── icons.tsx       # Iconos personalizados
│   ├── config/             # Configuración de la aplicación
│   │   └── site.ts         # Configuración del sitio
│   ├── layouts/            # Layouts de página
│   │   └── default.tsx     # Layout por defecto
│   ├── pages/              # Páginas de la aplicación
│   │   ├── login.tsx       # Página de inicio de sesión
│   │   ├── register.tsx    # Página de registro
│   │   ├── projects.tsx    # Página de proyectos
│   │   ├── tasks.tsx       # Página de tareas
│   │   └── task-detail.tsx # Página de detalle de tarea
│   ├── store/              # Estado global (Redux)
│   │   ├── slices/         # Redux slices
│   │   │   ├── authSlice.ts    # Estado de autenticación
│   │   │   ├── projectsSlice.ts # Estado de proyectos
│   │   │   └── tasksSlice.ts   # Estado de tareas
│   │   ├── api.ts          # Configuración de Axios
│   │   ├── hooks.ts        # Hooks de Redux
│   │   └── index.ts        # Store de Redux
│   ├── styles/             # Estilos globales
│   │   └── globals.css     # CSS global
│   ├── types/              # Definiciones de tipos
│   │   └── index.ts        # Tipos globales
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Punto de entrada
│   └── provider.tsx        # Proveedores de contexto
├── .env                    # Variables de entorno
├── .prettierrc             # Configuración de Prettier
├── package.json            # Dependencias y scripts
├── tailwind.config.js      # Configuración de Tailwind
├── tsconfig.json           # Configuración de TypeScript
└── vite.config.ts          # Configuración de Vite
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Construcción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la construcción de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
npm run format       # Formatea el código con Prettier

# Git hooks
npm run prepare      # Configura Husky para git hooks
```

## 🔧 Configuración de Desarrollo

### Prettier

El proyecto está configurado con Prettier para mantener un estilo de código consistente:

```json
{
  "singleQuote": true,
  "semi": false,
  "trailingComma": "es5",
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80
}
```

### ESLint

Configurado con reglas estrictas para TypeScript y React.

### Git Hooks

- **Pre-commit**: Ejecuta Prettier y ESLint en archivos staged
- **Husky**: Gestiona los git hooks automáticamente

## 🌐 API Backend

La aplicación se conecta a un backend API que debe estar ejecutándose en `http://127.0.0.1:8000`.

### Endpoints utilizados:

- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `GET /auth/me` - Información del usuario actual
- `GET /projects` - Listar proyectos
- `POST /projects` - Crear proyecto
- `GET /tasks` - Listar tareas
- `POST /tasks` - Crear tarea
- `PUT /tasks/{id}` - Actualizar tarea
- `DELETE /tasks/{id}` - Eliminar tarea

## 🎨 Características de UI/UX

- **Diseño responsivo** - Adaptable a todos los dispositivos
- **Tema oscuro/claro** - Cambio de tema dinámico
- **Componentes accesibles** - Cumple estándares de accesibilidad
- **Animaciones suaves** - Transiciones con Framer Motion
- **Feedback visual** - Estados de carga y mensajes de error

## 🚀 Despliegue

### Build para producción

```bash
npm run build
```

Los archivos estáticos se generarán en la carpeta `dist/`.

### Variables de entorno para producción

```env
VITE_API_URL=https://tu-api-backend.com
VITE_NODE_ENV=production
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - _Desarrollo inicial_ - [GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- [HeroUI](https://heroui.com/) por los componentes de UI
- [Vite](https://vitejs.dev/) por la herramienta de desarrollo
- [Tailwind CSS](https://tailwindcss.com/) por el framework de CSS
- [Redux Toolkit](https://redux-toolkit.js.org/) por la gestión de estado

---

<div align="center">

**¿Te gusta el proyecto? ¡Dale una ⭐!**

</div>
