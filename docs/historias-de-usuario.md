# Historias de Usuario - Mapeador de Góndolas

## Orden de Desarrollo por Dependencias

Las historias están ordenadas de menor a mayor dependencia. Las primeras son fundamentales y las últimas dependen de las anteriores.

---

## 🔵 FASE 1: Fundamentos y Configuración (Sin dependencias)

### HU-001: Configuración Inicial del Proyecto
**Como** desarrollador  
**Quiero** configurar el proyecto Next.js con todas las dependencias necesarias  
**Para** tener la base técnica del proyecto lista

**Criterios de Aceptación:**
- [ x] Proyecto Next.js inicializado con TypeScript
- [x ] Shadcn UI configurado con tema personalizado
- [ x] Tailwind CSS configurado
- [ x] Zustand instalado y configurado
- [x ] Konva.js (react-konva) instalado
- [x ] PapaParse instalado
- [x ] Recharts instalado
- [x ] Estructura de carpetas creada (pages, components, stores, utils)
- [x ] ESLint y Prettier configurados
- [x ] Proyecto desplegado en Vercel (plan gratuito)

**Dependencias:** Ninguna

**Estimación:** 4 horas

---

### HU-002: Diseño del Sistema de Tipos y Modelos de Datos
**Como** desarrollador  
**Quiero** definir los tipos TypeScript para todas las entidades del sistema  
**Para** tener un código type-safe y bien estructurado

**Criterios de Aceptación:**
- [ ] Tipo `Product` definido (id, nombre, precio, margen, popularidad, categoría, stock)
- [ ] Tipo `Gondola` definido (id, tipo, posición, rotación, largo, estantes)
- [ ] Tipo `Shelf` definido (id, número, espacios, restricciones)
- [ ] Tipo `Space` definido (id, posición, categorías permitidas/prohibidas)
- [ ] Tipo `Assignment` definido (productId, spaceId, gondolaId, shelfId)
- [ ] Tipo `SolverConfig` definido (pesos y parámetros)
- [ ] Enums para categorías, tipos de góndola, estados
- [ ] Interfaces exportadas en archivo central de tipos

**Dependencias:** HU-001

**Estimación:** 3 horas

---

## 🟢 FASE 2: Gestión de Estado (Depende de tipos)

### HU-003: Store de Productos con Zustand
**Como** desarrollador  
**Quiero** crear el store de productos con Zustand  
**Para** gestionar el estado de los productos en toda la aplicación

**Criterios de Aceptación:**
- [ ] Store `useProductsStore` creado
- [ ] Estado: array de productos
- [ ] Acción: `setProducts(products: Product[])`
- [ ] Acción: `updateProduct(id: string, data: Partial<Product>)`
- [ ] Acción: `getProductById(id: string)`
- [ ] Acción: `getProductsByCategory(category: string)`
- [ ] Acción: `clearProducts()`
- [ ] Selector: productos con stock disponible
- [ ] Selector: productos ordenados por popularidad
- [ ] Selector: productos ordenados por margen

**Dependencias:** HU-002

**Estimación:** 3 horas

---

### HU-004: Store de Góndolas con Zustand
**Como** desarrollador  
**Quiero** crear el store de góndolas con Zustand  
**Para** gestionar el estado de las góndolas y su configuración

**Criterios de Aceptación:**
- [ ] Store `useGondolasStore` creado
- [ ] Estado: array de góndolas
- [ ] Acción: `addGondola(gondola: Gondola)`
- [ ] Acción: `updateGondola(id: string, data: Partial<Gondola>)`
- [ ] Acción: `deleteGondola(id: string)`
- [ ] Acción: `updateGondolaPosition(id: string, x: number, y: number)`
- [ ] Acción: `updateGondolaRotation(id: string, rotation: number)`
- [ ] Acción: `updateGondolaShelves(id: string, shelves: Shelf[])`
- [ ] Selector: góndola por ID
- [ ] Selector: total de espacios disponibles

**Dependencias:** HU-002

**Estimación:** 3 horas

---

### HU-005: Store de Asignaciones con Zustand
**Como** desarrollador  
**Quiero** crear el store de asignaciones producto-espacio  
**Para** gestionar qué producto está en qué espacio

**Criterios de Aceptación:**
- [ ] Store `useAssignmentsStore` creado
- [ ] Estado: array de asignaciones
- [ ] Acción: `assignProduct(productId: string, spaceId: string, gondolaId: string, shelfId: string)`
- [ ] Acción: `unassignProduct(productId: string)`
- [ ] Acción: `clearAssignments()`
- [ ] Acción: `clearGondolaAssignments(gondolaId: string)`
- [ ] Selector: asignaciones por góndola
- [ ] Selector: asignaciones por estante
- [ ] Selector: productos sin asignar
- [ ] Selector: espacios ocupados/disponibles

**Dependencias:** HU-002

**Estimación:** 3 horas

---

### HU-006: Store de Configuración del Solver
**Como** desarrollador  
**Quiero** crear el store de configuración del solver  
**Para** gestionar los parámetros y pesos del algoritmo

**Criterios de Aceptación:**
- [ ] Store `useSolverConfigStore` creado
- [ ] Estado: configuración con valores por defecto
- [ ] Parámetro: peso de margen de ganancia (0-100)
- [ ] Parámetro: peso de popularidad (0-100)
- [ ] Parámetro: estantes óptimos (array, default [4, 5])
- [ ] Acción: `updateConfig(config: Partial<SolverConfig>)`
- [ ] Acción: `resetConfig()`
- [ ] Validación: suma de pesos = 100%

**Dependencias:** HU-002

**Estimación:** 2 horas

---

## 🟡 FASE 3: Carga y Parseo de Datos (Depende de stores)

### HU-007: Utilidad de Parseo de CSV
**Como** desarrollador  
**Quiero** crear una utilidad para parsear archivos CSV de productos  
**Para** convertir los datos CSV en objetos Product

**Criterios de Aceptación:**
- [ ] Función `parseProductsCSV(file: File): Promise<Product[]>`
- [ ] Usa PapaParse para parsear el archivo
- [ ] Valida que existan todas las columnas requeridas
- [ ] Valida tipos de datos (precio > 0, margen entre 0-1, etc.)
- [ ] Maneja errores de parseo con mensajes claros
- [ ] Retorna array de productos válidos
- [ ] Reporta productos con errores (opcional: array de errores)
- [ ] Genera IDs únicos si no existen en el CSV

**Dependencias:** HU-002

**Estimación:** 4 horas

---

### HU-008: Componente de Carga de CSV
**Como** usuario  
**Quiero** cargar un archivo CSV con los productos del supermercado  
**Para** tener los datos disponibles en la aplicación

**Criterios de Aceptación:**
- [ ] Componente `CSVUploader` con drag & drop
- [ ] Zona visual para arrastrar archivo
- [ ] También permite click para seleccionar archivo
- [ ] Acepta solo archivos .csv
- [ ] Muestra loading spinner durante el parseo
- [ ] Muestra mensaje de éxito con cantidad de productos cargados
- [ ] Muestra errores de validación si los hay
- [ ] Botón para limpiar y cargar nuevo archivo
- [ ] Actualiza el store de productos al cargar exitosamente
- [ ] Muestra preview de primeros 5 productos cargados

**Dependencias:** HU-003, HU-007

**Estimación:** 5 horas

---

## 🟠 FASE 4: Visualización del Mapa (Depende de stores y Konva)

### HU-009: Canvas Base del Mapa con Konva
**Como** desarrollador  
**Quiero** crear el canvas base del mapa usando Konva  
**Para** tener el área de trabajo donde se colocarán las góndolas

**Criterios de Aceptación:**
- [ ] Componente `MapCanvas` con Stage y Layer de Konva
- [ ] Canvas responsive (ocupa el área disponible)
- [ ] Grid de fondo para referencia visual
- [ ] Zoom in/out con rueda del mouse
- [ ] Pan (arrastrar el mapa) con click derecho o espacio + drag
- [ ] Límites de zoom (min: 0.5x, max: 3x)
- [ ] Indicador de escala/zoom actual
- [ ] Reset de vista (botón para volver a zoom 1x y centro)
- [ ] Coordenadas del mouse visibles (para debug)

**Dependencias:** HU-001

**Estimación:** 6 horas

---

### HU-010: Componente Visual de Góndola en el Mapa
**Como** desarrollador  
**Quiero** crear el componente visual de una góndola en Konva  
**Para** representar góndolas en el mapa

**Criterios de Aceptación:**
- [ ] Componente `GondolaShape` que renderiza un rectángulo en Konva
- [ ] Diferenciación visual entre góndola normal y heladera (color/patrón)
- [ ] Muestra el largo configurado de la góndola
- [ ] Muestra etiqueta con ID o nombre de la góndola
- [ ] Soporta rotación (0°, 90°, 180°, 270°)
- [ ] Highlight al hacer hover
- [ ] Selección visual al hacer click
- [ ] Dimensiones proporcionales a la configuración real

**Dependencias:** HU-009

**Estimación:** 5 horas

---

### HU-011: Agregar Góndolas al Mapa
**Como** usuario  
**Quiero** agregar góndolas al mapa del supermercado  
**Para** diseñar el layout de mi tienda

**Criterios de Aceptación:**
- [ ] Botón "Agregar Góndola Normal" en la UI
- [ ] Botón "Agregar Heladera" en la UI
- [ ] Al agregar, aparece en el centro del canvas
- [ ] Cada góndola tiene un ID único generado automáticamente
- [ ] Góndola se agrega al store de góndolas
- [ ] Góndola se renderiza inmediatamente en el mapa
- [ ] Valores por defecto: 5 estantes, 10 espacios por estante, largo 3 metros
- [ ] Contador de góndolas totales visible

**Dependencias:** HU-004, HU-010

**Estimación:** 4 horas

---

### HU-012: Mover y Rotar Góndolas en el Mapa
**Como** usuario  
**Quiero** mover y rotar las góndolas en el mapa  
**Para** organizar el layout según mi diseño

**Criterios de Aceptación:**
- [ ] Góndolas son draggables (arrastrar con mouse)
- [ ] Posición se actualiza en tiempo real en el store
- [ ] Botones de rotación (90° horario/antihorario) al seleccionar góndola
- [ ] Atajo de teclado: R para rotar 90° horario
- [ ] Snap to grid opcional (configurable)
- [ ] Muestra coordenadas X, Y de la góndola seleccionada
- [ ] Previene que góndolas se salgan del canvas
- [ ] Feedback visual durante el arrastre

**Dependencias:** HU-011

**Estimación:** 5 horas

---

### HU-013: Eliminar Góndolas del Mapa
**Como** usuario  
**Quiero** eliminar góndolas del mapa  
**Para** corregir errores o rediseñar el layout

**Criterios de Aceptación:**
- [ ] Botón "Eliminar" al seleccionar una góndola
- [ ] Atajo de teclado: Delete o Backspace
- [ ] Confirmación antes de eliminar
- [ ] Góndola se elimina del store
- [ ] Góndola desaparece del canvas
- [ ] Asignaciones de esa góndola se eliminan también
- [ ] Mensaje de confirmación de eliminación
- [ ] No se puede eliminar si no hay góndola seleccionada

**Dependencias:** HU-011, HU-005

**Estimación:** 3 horas

---

## 🔴 FASE 5: Configuración de Góndolas (Depende de mapa y stores)

### HU-014: Vista Frontal de Góndola
**Como** usuario  
**Quiero** ver la vista frontal de una góndola al hacer click en ella  
**Para** configurar sus estantes y espacios

**Criterios de Aceptación:**
- [ ] Click en góndola abre modal o página de vista frontal
- [ ] Vista frontal muestra estantes apilados verticalmente
- [ ] Cada estante muestra sus espacios horizontalmente
- [ ] Numeración de estantes (1 desde abajo)
- [ ] Estantes 4 y 5 destacados visualmente (zona óptima)
- [ ] Espacios numerados dentro de cada estante
- [ ] Título muestra ID/nombre de la góndola
- [ ] Botón para cerrar y volver al mapa
- [ ] Responsive (se adapta a diferentes tamaños de pantalla)

**Dependencias:** HU-011

**Estimación:** 6 horas

---

### HU-015: Configurar Cantidad de Estantes y Espacios
**Como** usuario  
**Quiero** configurar la cantidad de estantes y espacios por estante  
**Para** que la góndola refleje mi configuración real

**Criterios de Aceptación:**
- [ ] Input numérico para cantidad de estantes (1-10)
- [ ] Input numérico para espacios por estante (1-30)
- [ ] Cambios se reflejan inmediatamente en la vista frontal
- [ ] Cambios se guardan en el store de góndolas
- [ ] Si se reduce cantidad, se eliminan estantes/espacios del final
- [ ] Si se aumenta cantidad, se crean nuevos con configuración por defecto
- [ ] Validación: mínimo 1 estante, mínimo 1 espacio
- [ ] Botón "Aplicar" para confirmar cambios
- [ ] Advertencia si hay productos asignados que se perderían

**Dependencias:** HU-014

**Estimación:** 5 horas

---

### HU-016: Configurar Restricciones de Categorías por Espacio
**Como** usuario  
**Quiero** definir qué categorías pueden o no pueden ir en cada espacio  
**Para** tener control sobre la disposición de productos

**Criterios de Aceptación:**
- [ ] Click en un espacio abre panel de configuración
- [ ] Lista de todas las categorías disponibles
- [ ] Checkbox para permitir/prohibir cada categoría
- [ ] Opción "Permitir todas" por defecto
- [ ] Opción "Prohibir todas" y seleccionar permitidas
- [ ] Cambios se guardan en el store
- [ ] Indicador visual en espacios con restricciones
- [ ] Aplicar restricción a múltiples espacios a la vez (selección múltiple)
- [ ] Copiar restricciones de un espacio a otros

**Dependencias:** HU-014

**Estimación:** 6 horas

---

### HU-017: Configurar Largo de Góndola
**Como** usuario  
**Quiero** configurar el largo de cada góndola  
**Para** que represente las dimensiones reales

**Criterios de Aceptación:**
- [ ] Input numérico para largo en metros (1-20)
- [ ] Cambio se refleja visualmente en el mapa
- [ ] Cambio se guarda en el store
- [ ] Unidad de medida visible (metros)
- [ ] Validación: mínimo 1 metro
- [ ] Preview del cambio antes de aplicar
- [ ] Góndola se redimensiona proporcionalmente en el canvas

**Dependencias:** HU-011, HU-014

**Estimación:** 3 horas

---

## 🟣 FASE 6: Algoritmo Solver (Depende de todo lo anterior)

### HU-018: Panel de Configuración del Solver
**Como** usuario  
**Quiero** configurar los parámetros del algoritmo solver  
**Para** ajustar cómo se optimiza la disposición de productos

**Criterios de Aceptación:**
- [ ] Página o modal de configuración del solver
- [ ] Slider para peso de margen de ganancia (0-100%)
- [ ] Slider para peso de popularidad (0-100%)
- [ ] Validación: suma de pesos = 100%
- [ ] Ajuste automático del otro peso al mover uno
- [ ] Input para estantes óptimos (default: 4, 5)
- [ ] Preview de cómo afectan los pesos (ejemplo visual)
- [ ] Botón "Restaurar valores por defecto"
- [ ] Botón "Guardar configuración"
- [ ] Cambios se guardan en el store de configuración

**Dependencias:** HU-006

**Estimación:** 5 horas

---

### HU-019: Algoritmo Solver - Implementación Core
**Como** desarrollador  
**Quiero** implementar el algoritmo de optimización  
**Para** calcular la mejor ubicación de cada producto

**Criterios de Aceptación:**
- [ ] Función `runSolver(products, gondolas, config): Assignment[]`
- [ ] Calcula score por producto: `score = (margen * pesoMargen) + (popularidad * pesoPop)`
- [ ] Ordena productos por score descendente
- [ ] Asigna productos de mayor score a estantes óptimos primero
- [ ] Respeta restricciones de categoría por espacio
- [ ] Verifica stock disponible (stock > 0)
- [ ] Distribuye productos de menor score hacia arriba/abajo
- [ ] Maneja caso de más productos que espacios (prioriza por score)
- [ ] Maneja caso de más espacios que productos (algunos quedan vacíos)
- [ ] Retorna array de asignaciones optimizadas

**Dependencias:** HU-003, HU-004, HU-005, HU-006

**Estimación:** 8 horas

---

### HU-020: Ejecutar Solver desde la UI
**Como** usuario  
**Quiero** ejecutar el algoritmo solver con un botón  
**Para** obtener la disposición óptima de productos

**Criterios de Aceptación:**
- [ ] Botón "Ejecutar Solver" prominente en la UI
- [ ] Validaciones antes de ejecutar:
  - [ ] Hay productos cargados
  - [ ] Hay góndolas configuradas
  - [ ] Hay espacios disponibles
- [ ] Muestra loading spinner durante la ejecución
- [ ] Muestra progreso estimado (opcional)
- [ ] Al finalizar, actualiza el store de asignaciones
- [ ] Muestra mensaje de éxito con estadísticas:
  - [ ] Productos asignados
  - [ ] Productos sin asignar (y razones)
  - [ ] Espacios ocupados/disponibles
- [ ] Opción de cancelar ejecución (si toma mucho tiempo)
- [ ] Botón deshabilitado durante la ejecución

**Dependencias:** HU-019, HU-018

**Estimación:** 5 horas

---

### HU-021: Visualizar Resultados del Solver en el Mapa
**Como** usuario  
**Quiero** ver los productos asignados en cada góndola del mapa  
**Para** entender la disposición optimizada

**Criterios de Aceptación:**
- [ ] Góndolas con productos asignados tienen indicador visual
- [ ] Color o badge muestra % de ocupación de la góndola
- [ ] Tooltip al hacer hover muestra:
  - [ ] Cantidad de productos asignados
  - [ ] % de ocupación
  - [ ] Categorías presentes
- [ ] Góndolas vacías tienen indicador diferente
- [ ] Leyenda explicando los colores/indicadores

**Dependencias:** HU-020

**Estimación:** 4 horas

---

### HU-022: Visualizar Resultados del Solver en Vista Frontal
**Como** usuario  
**Quiero** ver los productos asignados en cada espacio de la góndola  
**Para** revisar la disposición detallada

**Criterios de Aceptación:**
- [ ] Cada espacio muestra el producto asignado (nombre o código)
- [ ] Color de fondo indica categoría del producto
- [ ] Tooltip muestra información completa del producto:
  - [ ] Nombre
  - [ ] Precio
  - [ ] Margen
  - [ ] Popularidad
  - [ ] Stock
- [ ] Espacios vacíos claramente identificados
- [ ] Estantes óptimos (4-5) destacados visualmente
- [ ] Scroll horizontal si hay muchos espacios
- [ ] Opción de zoom para ver mejor

**Dependencias:** HU-020, HU-014

**Estimación:** 5 horas

---

### HU-023: Ajuste Manual de Asignaciones
**Como** usuario  
**Quiero** modificar manualmente las asignaciones del solver  
**Para** hacer ajustes según mi criterio

**Criterios de Aceptación:**
- [ ] Drag & drop de productos entre espacios en vista frontal
- [ ] Click en espacio para asignar/cambiar producto (selector)
- [ ] Click derecho en espacio para desasignar producto
- [ ] Validación de restricciones de categoría al mover
- [ ] Advertencia si se mueve producto de zona óptima a no óptima
- [ ] Cambios se guardan inmediatamente en el store
- [ ] Opción "Deshacer" última modificación
- [ ] Botón "Restaurar resultados del solver" (descartar cambios manuales)

**Dependencias:** HU-022

**Estimación:** 6 horas

---

## 🟤 FASE 7: Reportes (Depende de solver y asignaciones)

### HU-024: Reporte de Productos Asignados
**Como** usuario  
**Quiero** ver un reporte de todos los productos asignados  
**Para** tener una vista general de la disposición

**Criterios de Aceptación:**
- [ ] Tabla con columnas:
  - [ ] Producto (nombre)
  - [ ] Categoría
  - [ ] Góndola
  - [ ] Estante
  - [ ] Espacio
  - [ ] Margen
  - [ ] Popularidad
  - [ ] Score calculado
- [ ] Ordenamiento por cualquier columna
- [ ] Filtros por categoría, góndola, estante
- [ ] Búsqueda por nombre de producto
- [ ] Paginación (50 productos por página)
- [ ] Exportar a CSV (opcional para MVP)
- [ ] Total de productos asignados

**Dependencias:** HU-020

**Estimación:** 5 horas

---

### HU-025: Reporte de Productos No Asignados
**Como** usuario  
**Quiero** ver qué productos no fueron asignados y por qué  
**Para** entender las limitaciones y tomar decisiones

**Criterios de Aceptación:**
- [ ] Tabla de productos no asignados
- [ ] Columna con razón de no asignación:
  - [ ] Sin stock
  - [ ] Sin espacios disponibles
  - [ ] Restricciones de categoría
  - [ ] Otros
- [ ] Contador total de productos no asignados
- [ ] Agrupación por razón
- [ ] Sugerencias para resolver (ej: "Agregar más góndolas")
- [ ] Filtros por razón y categoría

**Dependencias:** HU-020

**Estimación:** 4 horas

---

### HU-026: Reporte de Ocupación por Góndola
**Como** usuario  
**Quiero** ver el % de ocupación de cada góndola  
**Para** identificar góndolas subutilizadas o sobrecargadas

**Criterios de Aceptación:**
- [ ] Tabla con columnas:
  - [ ] Góndola (ID/nombre)
  - [ ] Tipo (normal/heladera)
  - [ ] Espacios totales
  - [ ] Espacios ocupados
  - [ ] % de ocupación
  - [ ] Categorías presentes
- [ ] Gráfico de barras con % de ocupación por góndola (Recharts)
- [ ] Color coding: verde (>80%), amarillo (50-80%), rojo (<50%)
- [ ] Ordenamiento por % de ocupación
- [ ] Promedio de ocupación total

**Dependencias:** HU-020

**Estimación:** 5 horas

---

### HU-027: Reporte de Rentabilidad por Góndola
**Como** usuario  
**Quiero** ver la rentabilidad estimada de cada góndola  
**Para** evaluar el valor de cada ubicación

**Criterios de Aceptación:**
- [ ] Tabla con columnas:
  - [ ] Góndola
  - [ ] Margen promedio de productos
  - [ ] Popularidad promedio
  - [ ] Score promedio
  - [ ] Cantidad de productos
- [ ] Gráfico de barras comparando rentabilidad (Recharts)
- [ ] Ordenamiento por cualquier métrica
- [ ] Identificación de góndolas "premium" (score alto)
- [ ] Identificación de góndolas de bajo rendimiento

**Dependencias:** HU-020

**Estimación:** 5 horas

---

### HU-028: Reporte de Distribución de Categorías
**Como** usuario  
**Quiero** ver cómo se distribuyen las categorías en el supermercado  
**Para** asegurar una buena variedad

**Criterios de Aceptación:**
- [ ] Gráfico de pie/dona con % por categoría (Recharts)
- [ ] Tabla de categorías con:
  - [ ] Nombre de categoría
  - [ ] Cantidad de productos asignados
  - [ ] % del total
  - [ ] Góndolas donde está presente
- [ ] Mapa de calor: categorías por góndola (opcional)
- [ ] Identificación de categorías sobre/sub representadas

**Dependencias:** HU-020

**Estimación:** 5 horas

---

### HU-029: Dashboard de Reportes Principal
**Como** usuario  
**Quiero** tener un dashboard con métricas clave  
**Para** tener una vista rápida del estado del sistema

**Criterios de Aceptación:**
- [ ] Cards con métricas principales:
  - [ ] Total de productos cargados
  - [ ] Total de productos asignados
  - [ ] Total de góndolas
  - [ ] % de ocupación global
  - [ ] Margen promedio de productos asignados
  - [ ] Popularidad promedio
- [ ] Gráfico de distribución de productos por estante (Recharts)
- [ ] Gráfico mostrando productos en zona óptima vs otras zonas
- [ ] Accesos rápidos a reportes detallados
- [ ] Última ejecución del solver (fecha/hora)

**Dependencias:** HU-024, HU-025, HU-026, HU-027, HU-028

**Estimación:** 6 horas

---

## ⚪ FASE 8: Navegación y UX (Depende de todas las vistas)

### HU-030: Navegación Principal de la Aplicación
**Como** usuario  
**Quiero** navegar fácilmente entre las diferentes secciones  
**Para** usar todas las funcionalidades de la aplicación

**Criterios de Aceptación:**
- [ ] Navbar/Sidebar con navegación a:
  - [ ] Mapa (vista principal)
  - [ ] Configuración del Solver
  - [ ] Reportes
  - [ ] Carga de Productos (CSV)
- [ ] Indicador de sección activa
- [ ] Breadcrumbs en vistas anidadas
- [ ] Logo/nombre de la aplicación
- [ ] Responsive: menú hamburguesa en mobile
- [ ] Atajos de teclado para navegación (opcional)

**Dependencias:** HU-009, HU-018, HU-029, HU-008

**Estimación:** 4 horas

---

### HU-031: Estados de Carga y Errores
**Como** usuario  
**Quiero** ver feedback claro cuando algo está cargando o falla  
**Para** entender el estado de la aplicación

**Criterios de Aceptación:**
- [ ] Spinners/skeletons durante cargas
- [ ] Mensajes de error claros y accionables
- [ ] Toasts/notificaciones para acciones exitosas
- [ ] Página de error 404 personalizada
- [ ] Manejo de errores de parseo de CSV
- [ ] Manejo de errores del solver
- [ ] Botones de reintento en errores
- [ ] Estados vacíos con ilustraciones/mensajes útiles

**Dependencias:** Todas las HU anteriores

**Estimación:** 5 horas

---

### HU-032: Ayuda y Onboarding
**Como** usuario nuevo  
**Quiero** entender cómo usar la aplicación  
**Para** aprovechar todas sus funcionalidades

**Criterios de Aceptación:**
- [ ] Tour guiado en primera visita (opcional)
- [ ] Tooltips explicativos en funciones clave
- [ ] Página de ayuda/documentación
- [ ] Ejemplos de archivo CSV para descargar
- [ ] Video tutorial o GIFs animados (opcional)
- [ ] FAQs comunes
- [ ] Botón de ayuda (?) en secciones complejas

**Dependencias:** HU-030

**Estimación:** 6 horas

---

## 📊 Resumen de Estimaciones

### Por Fase:
- **Fase 1 - Fundamentos:** 7 horas (2 HU)
- **Fase 2 - Estado:** 11 horas (4 HU)
- **Fase 3 - Carga de Datos:** 9 horas (2 HU)
- **Fase 4 - Mapa:** 28 horas (5 HU)
- **Fase 5 - Configuración:** 28 horas (6 HU)
- **Fase 6 - Solver:** 43 horas (8 HU)
- **Fase 7 - Reportes:** 30 horas (6 HU)
- **Fase 8 - UX:** 15 horas (3 HU)

### Total: ~171 horas (~4-5 semanas de desarrollo)

---

## 🎯 Orden de Desarrollo Recomendado

### Sprint 1 (Semana 1): Fundamentos
- HU-001, HU-002, HU-003, HU-004, HU-005, HU-006

### Sprint 2 (Semana 2): Carga y Mapa Básico
- HU-007, HU-008, HU-009, HU-010, HU-011, HU-012, HU-013

### Sprint 3 (Semana 3): Configuración de Góndolas
- HU-014, HU-015, HU-016, HU-017

### Sprint 4 (Semana 4): Solver
- HU-018, HU-019, HU-020, HU-021, HU-022, HU-023

### Sprint 5 (Semana 5): Reportes y Pulido
- HU-024, HU-025, HU-026, HU-027, HU-028, HU-029, HU-030, HU-031, HU-032

---

## 📝 Notas Importantes

1. **Prioridad del MVP:** Las HU marcadas con 🔴 son críticas para el MVP
2. **Testing:** Cada HU debe incluir pruebas manuales mínimas
3. **Documentación:** Actualizar README con cada funcionalidad nueva
4. **Deploy continuo:** Desplegar a Vercel después de cada fase completada
5. **Feedback:** Recoger feedback del usuario después de cada sprint

---

**Fecha de Creación:** 29 de Octubre, 2025  
**Versión:** 1.0  
**Estado:** Listo para desarrollo

