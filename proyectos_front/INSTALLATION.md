# 🚀 Guía de Instalación - Proyectos Frontend

Esta guía te ayudará a configurar y ejecutar el frontend de Proyectos en tu máquina local.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
  - Descarga desde: https://nodejs.org/
  - Verifica la instalación: `node --version`
- **npm** (versión 8 o superior)
  - Viene incluido con Node.js
  - Verifica la instalación: `npm --version`
- **Git**
  - Descarga desde: https://git-scm.com/
  - Verifica la instalación: `git --version`

## 🔧 Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
# Clona el repositorio
git clone <url-del-repositorio>
cd proyectos_front
```

### 2. Instalar Dependencias

```bash
# Instala todas las dependencias
npm install
```

Si encuentras errores de permisos, puedes usar:

```bash
# En Windows (PowerShell como administrador)
npm install --force

# En macOS/Linux
sudo npm install
```

### 3. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp env.example .env

# Edita el archivo .env con tu editor preferido
# Windows
notepad .env

# macOS/Linux
nano .env
```

**Contenido del archivo `.env`:**

```env
# URL del backend API
VITE_API_URL=http://127.0.0.1:8000

# Entorno de desarrollo
VITE_NODE_ENV=development
```

### 4. Verificar la Configuración

```bash
# Verifica que todas las dependencias estén instaladas
npm list --depth=0

# Verifica la configuración de TypeScript
npx tsc --noEmit
```

### 5. Ejecutar el Servidor de Desarrollo

```bash
# Inicia el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en:

- **URL Local**: http://localhost:5173
- **URL de Red**: http://[tu-ip]:5173

## 🐛 Solución de Problemas

### Error: Puerto en uso

Si el puerto 5173 está ocupado:

```bash
# Vite automáticamente usará el siguiente puerto disponible
# O puedes especificar un puerto diferente
npm run dev -- --port 3000
```

### Error: Dependencias faltantes

Si encuentras errores de dependencias:

```bash
# Limpia la caché de npm
npm cache clean --force

# Elimina node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstala las dependencias
npm install
```

### Error: Variables de entorno no cargadas

Asegúrate de que:

1. El archivo `.env` esté en la raíz del proyecto frontend
2. Las variables comiencen con `VITE_`
3. No haya espacios alrededor del signo `=`

```env
# ✅ Correcto
VITE_API_URL=http://127.0.0.1:8000

# ❌ Incorrecto
VITE_API_URL = http://127.0.0.1:8000
```

### Error: Backend no disponible

Si el frontend no puede conectarse al backend:

1. Verifica que el backend esté ejecutándose
2. Confirma la URL en el archivo `.env`
3. Verifica que no haya problemas de CORS

```bash
# Verifica la conectividad
curl http://127.0.0.1:8000/health

# O en Windows
powershell -Command "Invoke-WebRequest -Uri http://127.0.0.1:8000/health"
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build de producción

# Calidad de código
npm run lint         # Ejecutar ESLint
npm run format       # Formatear con Prettier

# Utilidades
npm run prepare      # Configurar Husky
```

## 📁 Estructura de Archivos Importantes

```
frontend/
├── .env                 # Variables de entorno (crear manualmente)
├── env.example          # Ejemplo de variables de entorno
├── package.json         # Dependencias y scripts
├── vite.config.ts       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind CSS
├── tsconfig.json        # Configuración de TypeScript
└── src/
    ├── store/           # Estado global (Redux)
    ├── pages/           # Páginas de la aplicación
    ├── components/      # Componentes reutilizables
    └── layouts/         # Layouts de página
```

## 🌐 Configuración de Red

### Acceso desde otros dispositivos

Para acceder desde otros dispositivos en tu red local:

```bash
# Ejecuta con acceso de red
npm run dev -- --host
```

Luego accede desde: `http://[tu-ip]:5173`

### Configuración de Proxy (opcional)

Si necesitas configurar un proxy, edita `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

## ✅ Verificación de la Instalación

Para verificar que todo está funcionando correctamente:

1. **Servidor ejecutándose**: http://localhost:5173
2. **Sin errores en consola**: Revisa la consola del navegador
3. **Conexión al backend**: Verifica que las peticiones API funcionen
4. **Hot reload**: Los cambios se reflejan automáticamente

## 🆘 Obtener Ayuda

Si encuentras problemas:

1. Revisa la consola del navegador (F12)
2. Verifica la consola de la terminal
3. Consulta los logs de Vite
4. Revisa la documentación de las dependencias

## 📚 Recursos Adicionales

- [Documentación de Vite](https://vitejs.dev/guide/)
- [Documentación de React](https://reactjs.org/docs/)
- [Documentación de HeroUI](https://heroui.com/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Redux Toolkit](https://redux-toolkit.js.org/)

---

¡Listo! Tu frontend de Proyectos debería estar funcionando correctamente. 🎉
