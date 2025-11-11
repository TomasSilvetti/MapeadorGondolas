# Implementación del Sistema de Proyectos

## Resumen
Se ha implementado un sistema completo de gestión de proyectos para el Mapeador de Góndolas, transformando la página principal en un dashboard con tema oscuro que permite crear, gestionar y acceder a múltiples proyectos de layouts de góndolas.

## Cambios Realizados

### 1. Tipos y Store de Proyectos

#### `types/index.ts`
- **Agregado**: Interface `Project` con los siguientes campos:
  - `id`: Identificador único del proyecto
  - `nombre`: Nombre del proyecto
  - `fechaCreacion`: Fecha de creación (ISO string)
  - `fechaModificacion`: Fecha de última modificación (ISO string)
  - `cantidadGondolas`: Contador de góndolas en el proyecto
  - `cantidadProductos`: Contador de productos en el proyecto
  - `gondolas`: Array de góndolas del proyecto
  - `products`: Array de productos del proyecto
  - `assignments`: Array de asignaciones del proyecto
  - `solverConfig`: Configuración del solver del proyecto

- **Agregado**: Interface `ProjectsStore` con métodos:
  - `loadProjects()`: Cargar proyectos desde localStorage
  - `createProject(nombre)`: Crear nuevo proyecto
  - `updateProject(id, data)`: Actualizar proyecto existente
  - `deleteProject(id)`: Eliminar proyecto
  - `setActiveProject(id)`: Establecer proyecto activo
  - `getActiveProject()`: Obtener proyecto activo
  - `syncActiveProject()`: Sincronizar proyecto activo

#### `stores/projects.ts` (NUEVO)
- Store de Zustand con persistencia en localStorage
- Gestión completa del ciclo de vida de proyectos
- Sincronización automática con localStorage
- Claves de almacenamiento:
  - `mapeador-gondolas-projects`: Lista de proyectos
  - `mapeador-gondolas-active-project`: ID del proyecto activo

### 2. Componentes Nuevos

#### `components/custom/ProjectCard.tsx` (NUEVO)
- Card visual para mostrar información de cada proyecto
- Muestra:
  - Nombre del proyecto
  - Fecha de creación y modificación
  - Cantidad de góndolas y productos (con iconos)
- Acciones disponibles:
  - Botón "Abrir" para acceder al canvas del proyecto
  - Botón "Editar" para cambiar el nombre
  - Botón "Eliminar" con confirmación
- Modales integrados para edición y eliminación
- Tema oscuro consistente con el resto de la aplicación

#### `components/custom/CreateProjectModal.tsx` (NUEVO)
- Modal para crear nuevos proyectos
- Input para nombre del proyecto
- Validación de nombre no vacío
- Al crear, redirige automáticamente al canvas del nuevo proyecto
- Soporte para Enter key para crear rápidamente
- Tema oscuro

### 3. Página Principal Rediseñada

#### `app/page.tsx`
- **Transformación completa** de landing page a dashboard de proyectos
- Tema oscuro aplicado (`bg-slate-900`)
- Navegación simplificada con título
- Grid responsive (1-3 columnas según viewport)
- Estado vacío elegante cuando no hay proyectos:
  - Icono de carpeta grande
  - Mensaje descriptivo
  - Botón CTA para crear primer proyecto
- Botón flotante "+" (FAB) cuando hay proyectos existentes
- Carga automática de proyectos desde localStorage al montar

### 4. Integración con el Mapeador

#### `app/map/page.tsx`
- **Carga automática del proyecto activo** al montar el componente
- Limpieza de stores antes de cargar para evitar duplicados
- Validación: redirige a home si no hay proyecto activo
- **Sincronización automática** con debounce de 1 segundo:
  - Guarda cambios en góndolas
  - Guarda cambios en productos
  - Guarda cambios en asignaciones
  - Guarda configuración del solver
  - Actualiza contadores automáticamente
- Control de carga única con estado `projectLoaded`

#### `components/custom/TopBar.tsx`
- **Agregado**: Botón "Inicio" para volver a la página principal
- Icono de casa con texto
- Separador visual entre botón y logo
- Navegación fluida con Next.js router

### 5. Tema Oscuro Global

#### `app/layout.tsx`
- Clase `dark` agregada al elemento `<html>`
- Activa el tema oscuro globalmente usando las variables CSS de Tailwind
- Idioma cambiado a español (`lang="es"`)

## Flujo de Usuario

### Crear Nuevo Proyecto
1. Usuario entra a la página principal
2. Si no hay proyectos, ve estado vacío con botón CTA
3. Si hay proyectos, ve grid de cards + botón flotante "+"
4. Click en crear proyecto abre modal
5. Ingresa nombre y confirma
6. Se crea proyecto y redirige automáticamente al canvas
7. Canvas inicia vacío, listo para diseñar

### Abrir Proyecto Existente
1. Usuario ve grid de proyectos en página principal
2. Cada card muestra información del proyecto
3. Click en "Abrir" en la card
4. Se establece como proyecto activo
5. Redirige al canvas
6. Canvas carga góndolas, productos y asignaciones del proyecto

### Editar Proyecto
1. Click en botón de editar (lápiz) en la card
2. Modal se abre con input pre-llenado
3. Modifica nombre y guarda
4. Card se actualiza inmediatamente

### Eliminar Proyecto
1. Click en botón de eliminar (basura) en la card
2. Modal de confirmación se abre
3. Confirma eliminación
4. Proyecto se elimina de localStorage
5. Grid se actualiza automáticamente

### Trabajar en el Canvas
1. Todos los cambios se sincronizan automáticamente cada segundo
2. Agregar/modificar/eliminar góndolas → se guarda
3. Cargar/modificar productos → se guarda
4. Ejecutar solver y obtener resultados → se guarda
5. Click en "Inicio" para volver a proyectos
6. Cambios persisten en localStorage

## Persistencia de Datos

### localStorage Keys
- `mapeador-gondolas-projects`: Array de objetos Project
- `mapeador-gondolas-active-project`: String con ID del proyecto activo

### Estructura de Datos
```typescript
{
  id: "uuid-v4",
  nombre: "Mi Proyecto",
  fechaCreacion: "2025-11-05T...",
  fechaModificacion: "2025-11-05T...",
  cantidadGondolas: 5,
  cantidadProductos: 120,
  gondolas: [...],
  products: [...],
  assignments: [...],
  solverConfig: {...}
}
```

## Consideraciones Técnicas

### Sincronización
- Debounce de 1 segundo para evitar writes excesivos
- Actualización automática de contadores
- Fecha de modificación se actualiza en cada cambio

### Limpieza de Stores
- Stores se limpian antes de cargar un proyecto
- Previene duplicados y estados inconsistentes
- Garantiza que cada proyecto tenga estado limpio

### Navegación
- Next.js router para navegación client-side
- Validación de proyecto activo en map page
- Redirección automática si no hay proyecto

### Tema Oscuro
- Variables CSS de Tailwind utilizadas
- Consistencia en todos los componentes
- Paleta de colores slate para fondos
- Colores de acento azul para acciones primarias

## Mejoras Futuras Sugeridas

1. **Exportar/Importar Proyectos**: Permitir backup en archivos JSON
2. **Duplicar Proyectos**: Crear copia de un proyecto existente
3. **Búsqueda y Filtros**: Buscar proyectos por nombre o fecha
4. **Ordenamiento**: Ordenar por fecha, nombre, o cantidad de elementos
5. **Miniaturas**: Generar preview visual del canvas para cada proyecto
6. **Estadísticas**: Dashboard con métricas agregadas de todos los proyectos
7. **Etiquetas/Categorías**: Organizar proyectos por categorías
8. **Historial de Cambios**: Tracking de modificaciones en cada proyecto
9. **Colaboración**: Sistema multi-usuario (requiere backend)
10. **Sincronización en la Nube**: Backup automático (requiere backend)

## Archivos Modificados

### Nuevos
- `stores/projects.ts`
- `components/custom/ProjectCard.tsx`
- `components/custom/CreateProjectModal.tsx`
- `docs/IMPLEMENTACION-PROYECTOS.md`

### Modificados
- `types/index.ts`
- `app/page.tsx`
- `app/layout.tsx`
- `app/map/page.tsx`
- `components/custom/TopBar.tsx`

## Testing Manual Recomendado

1. ✅ Crear primer proyecto desde estado vacío
2. ✅ Crear múltiples proyectos
3. ✅ Abrir proyecto y verificar que carga vacío
4. ✅ Agregar góndolas y verificar sincronización
5. ✅ Volver a home y verificar que contadores se actualizaron
6. ✅ Editar nombre de proyecto
7. ✅ Eliminar proyecto
8. ✅ Abrir proyecto con datos guardados
9. ✅ Verificar que datos persisten después de refresh
10. ✅ Verificar tema oscuro en todas las páginas


