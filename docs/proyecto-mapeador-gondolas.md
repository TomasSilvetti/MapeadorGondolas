# Mapeador de Góndolas - Especificaciones del Proyecto

## Descripción General
Software web para optimizar la disposición de productos en un supermercado mediante un sistema de mapeo visual de góndolas y un algoritmo solver que determina la ubicación óptima de productos.

---

## Objetivos del MVP

### Funcionalidad Principal
1. **Vista de Mapa (Sandbox)**
   - Vista superior del supermercado
   - Colocación interactiva de góndolas para armar el layout
   - Drag and drop para posicionar góndolas

2. **Vista de Góndola Individual**
   - Al hacer click en una góndola, se abre vista frontal
   - Configuración de estantes (cantidad variable)
   - Configuración de espacios por estante
   - Restricciones de categorías por espacio

3. **Gestión de Productos**
   - Carga mediante archivo CSV
   - Atributos: precio, margen de ganancia, popularidad, categoría, stock
   - ~500 productos para pruebas

4. **Algoritmo Solver**
   - Optimiza ubicación según margen de ganancia y popularidad
   - Prioriza estantes 4 y 5 (altura de vista) para productos más rentables/populares
   - Distribuye productos menos rentables hacia arriba o abajo
   - Panel de configuración de pesos (margen vs popularidad)
   - Ejecución mediante botón (puede tomar varios segundos)
   - Verifica stock antes de asignar

5. **Reportes**
   - Pestaña con reportes simples
   - Visualización de resultados del solver

---

## Especificaciones Técnicas

### Stack Tecnológico

#### Frontend
- **Framework:** Next.js
- **UI Components:** Shadcn UI
- **Canvas Interactivo:** Konva.js (react-konva)
- **Parsing CSV:** PapaParse
- **Gráficos/Charts:** Recharts
- **Estado Global:** Zustand
- **Hosting:** Vercel (plan gratuito)

#### Backend
- **No se utilizará base de datos en el MVP**
- Todo funciona en memoria del navegador
- Los datos se cargan desde CSV y persisten solo durante la sesión

### Arquitectura

```
┌─────────────────────────────────────────────┐
│      Next.js App (Vercel) - Solo Frontend   │
├─────────────────────────────────────────────┤
│  Pages:                                     │
│  ├─ /map (vista superior + sandbox)         │
│  ├─ /gondola/[id] (vista frontal)          │
│  ├─ /config (pesos del solver)             │
│  └─ /reports (reportes simples)            │
├─────────────────────────────────────────────┤
│  Components (Shadcn + Custom):              │
│  ├─ MapCanvas (Konva.js)                   │
│  ├─ GondolaView (Konva.js)                 │
│  ├─ CSVUploader (drag & drop)              │
│  ├─ SolverConfig (sliders para pesos)      │
│  └─ ReportTables/Charts (Recharts)         │
├─────────────────────────────────────────────┤
│  State Management (Zustand):               │
│  ├─ Products store                          │
│  ├─ Gondolas store                          │
│  ├─ Assignments store                       │
│  └─ Solver config store                     │
├─────────────────────────────────────────────┤
│  Utils:                                     │
│  ├─ csvParser.ts (PapaParse)               │
│  └─ solverAlgorithm.ts (custom JS)         │
└─────────────────────────────────────────────┘
```

---

## Especificaciones de Góndolas

### Tipos de Góndolas
1. **Góndola Normal**
   - Estantes configurables (cantidad variable)
   - Largo configurable
   - Profundidad fija (no configurable)
   - Una sola cara (no góndolas de doble cara)
   - Rotación configurable

2. **Heladeras**
   - Misma estructura que góndolas normales
   - Diferenciación visual simple
   - Estantes configurables
   - Largo configurable

### Configuración de Góndolas
- **Cantidad:** 20-30 góndolas aproximadamente
- **Estantes por góndola:** Variable, configurable
- **Espacios por estante:** Variable, configurable
- **Restricciones:** Categorías permitidas/prohibidas por espacio
- **Dimensiones:** Solo largo y altura (cantidad de estantes) son configurables

---

## Especificaciones de Productos

### Atributos de Productos
- Nombre
- Precio
- Margen de ganancia
- Popularidad/ventas
- Categoría
- Stock (para verificación, no para optimización)

### Carga de Productos
- **Método:** Archivo CSV con drag & drop
- **Cantidad:** ~500 productos para pruebas
- **Actualización:** Cada vez que se carga un nuevo CSV
- **Dimensiones físicas:** No se consideran (espacios arbitrarios)

---

## Algoritmo Solver

### Objetivo
Asignar cada producto al espacio óptimo considerando:
- Margen de ganancia (peso configurable)
- Popularidad/ventas (peso configurable)
- Restricciones de categoría por espacio
- Disponibilidad de stock

### Criterios de Optimización
- **Estantes óptimos:** 4 y 5 (contando desde abajo) = altura de vista
- **Productos prioritarios:** Mayor margen + mayor popularidad → estantes 4-5
- **Productos secundarios:** Menor margen/popularidad → estantes alejados (arriba o abajo)

### Configuración
- Panel con sliders/inputs para ajustar pesos
- Pesos configurables:
  - Peso de margen de ganancia
  - Peso de popularidad
  - (Otros parámetros según necesidad)

### Ejecución
- Botón para ejecutar solver
- Proceso puede tomar varios segundos
- Se ejecuta en el navegador (JavaScript)
- Implementación custom (greedy algorithm o similar)

### Restricciones
- Respetar categorías permitidas/prohibidas por espacio
- No asignar productos sin stock
- Un producto por espacio

---

## Flujo de Trabajo del Usuario

1. **Inicio de Sesión**
   - Entrar a la aplicación (sin autenticación en MVP)

2. **Carga de Datos**
   - Drag & drop de archivo CSV con productos
   - Sistema parsea y carga productos en memoria

3. **Diseño del Layout**
   - Vista de mapa superior
   - Agregar góndolas (normales o heladeras)
   - Posicionar góndolas en el espacio
   - Rotar góndolas según necesidad

4. **Configuración de Góndolas**
   - Click en góndola → vista frontal
   - Configurar cantidad de estantes
   - Configurar espacios por estante
   - Definir restricciones de categoría por espacio

5. **Configuración del Solver**
   - Ir a panel de configuración
   - Ajustar pesos (margen vs popularidad)
   - Ajustar otros parámetros

6. **Ejecución del Solver**
   - Presionar botón "Ejecutar Solver"
   - Esperar cálculo (varios segundos)
   - Ver resultados en mapa y góndolas

7. **Revisión de Resultados**
   - Ver productos asignados en cada góndola
   - Consultar reportes
   - Ajustar manualmente si es necesario

---

## Consideraciones de Usuarios

- **Usuarios simultáneos:** Menos de 20
- **Roles:** No hay diferenciación de usuarios en MVP
- **Autenticación:** No requerida en MVP
- **Sesiones:** Los datos persisten solo durante la sesión del navegador
- **Recarga de página:** Se pierden todos los datos (sin persistencia en MVP)

---

## Reportes

### Tipos de Reportes (Simples)
- Productos asignados por góndola
- Productos por estante
- Distribución de categorías
- Productos no asignados (sin stock o sin espacio)
- Rentabilidad por góndola/estante
- (Otros reportes básicos según necesidad)

### Visualización
- Tablas con Shadcn UI
- Gráficos con Recharts
- Exportación: No requerida en MVP

---

## Limitaciones del MVP

### No Incluido en MVP
- ❌ Base de datos
- ❌ Persistencia entre sesiones
- ❌ Autenticación de usuarios
- ❌ Múltiples escenarios/configuraciones paralelas
- ❌ Dimensiones físicas reales de productos
- ❌ Góndolas de doble cara
- ❌ Integración con sistemas externos
- ❌ Exportación de layouts (PDF, imágenes)
- ❌ Gestión de inventario en tiempo real
- ❌ Actualización automática de datos de ventas

### Simplificaciones
- Espacios arbitrarios (no dimensiones reales)
- Solo una cara por góndola
- Profundidad fija de góndolas
- Carga manual de CSV
- Sin backend

---

## Presupuesto y Hosting

- **Presupuesto:** $0 USD
- **Hosting:** Vercel (plan gratuito)
- **Límites del plan gratuito:**
  - Ancho de banda suficiente para <20 usuarios
  - Sin límite de deploys
  - Dominio .vercel.app incluido

---

## Próximos Pasos (Post-MVP)

### Funcionalidades Futuras
1. Persistencia con localStorage o base de datos
2. Autenticación y roles de usuario
3. Múltiples escenarios para comparar
4. Dimensiones físicas de productos
5. Exportación de layouts
6. Integración con sistemas de inventario
7. Actualización automática de datos de ventas
8. Góndolas de doble cara
9. Historial de cambios
10. Análisis predictivo

### Mejoras Técnicas
1. Optimización del algoritmo solver
2. Web Workers para cálculos pesados
3. Progressive Web App (PWA)
4. Modo offline
5. Tests automatizados
6. CI/CD pipeline

---

## Notas de Desarrollo

### Dependencias Principales
```json
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "react-konva": "latest",
    "konva": "latest",
    "zustand": "latest",
    "papaparse": "latest",
    "recharts": "latest",
    "@radix-ui/react-*": "latest (Shadcn dependencies)",
    "tailwindcss": "latest"
  }
}
```

### Estructura de Datos en Zustand

#### Products Store
```typescript
{
  products: Product[],
  loadProducts: (csvData) => void,
  updateProduct: (id, data) => void
}
```

#### Gondolas Store
```typescript
{
  gondolas: Gondola[],
  addGondola: (gondola) => void,
  updateGondola: (id, data) => void,
  deleteGondola: (id) => void
}
```

#### Assignments Store
```typescript
{
  assignments: Assignment[], // producto -> espacio
  assignProduct: (productId, spaceId) => void,
  clearAssignments: () => void
}
```

#### Solver Config Store
```typescript
{
  config: {
    marginWeight: number,
    popularityWeight: number,
    // otros parámetros
  },
  updateConfig: (config) => void
}
```

---

## Formato del CSV de Productos

### Columnas Requeridas
```csv
id,nombre,precio,margen_ganancia,popularidad,categoria,stock
1,Coca Cola 2L,150,0.35,95,Bebidas,100
2,Pan Lactal,85,0.25,88,Panadería,50
3,Leche Entera 1L,120,0.30,92,Lácteos,75
...
```

### Validaciones
- ID único por producto
- Precio > 0
- Margen entre 0 y 1 (o porcentaje)
- Popularidad entre 0 y 100
- Stock >= 0

---

## Consideraciones de Performance

- **500 productos:** Manejable en memoria
- **30 góndolas:** Sin problemas de renderizado
- **Solver:** Puede tomar segundos, mostrar loading state
- **Canvas:** Optimizar renderizado con Konva (virtualización si es necesario)
- **CSV parsing:** PapaParse es eficiente, usar worker si el archivo es muy grande

---

## Fecha de Creación
29 de Octubre, 2025

## Estado
Especificaciones del MVP - Listo para desarrollo

