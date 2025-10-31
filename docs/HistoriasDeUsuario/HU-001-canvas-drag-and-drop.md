# HU-001: Canvas Principal con Drag and Drop para Diseño de Layout

## Información General

- **ID:** HU-001
- **Título:** Canvas Principal con Drag and Drop para Diseño de Layout
- **Prioridad:** Alta
- **Épica:** Diseño de Layout del Supermercado
- **Fecha de Creación:** 31 de Octubre, 2025
- **Estado:** Pendiente

---

## Descripción

Como **usuario del sistema de mapeado de góndolas**, quiero **una interfaz visual con canvas interactivo donde pueda diseñar el layout del supermercado mediante drag and drop**, para **posicionar y organizar las góndolas de manera intuitiva y visual antes de asignar productos**.

---

## Contexto

El canvas principal es la interfaz central del Mapeador de Góndolas donde el usuario diseña la distribución física del supermercado. Esta vista superior (plano 2D) permite crear un "sandbox" interactivo donde se pueden agregar, posicionar, rotar y configurar diferentes tipos de góndolas (estándar, heladeras, estructuras) antes de ejecutar el algoritmo de optimización.

---

## Actores

- **Usuario principal:** Encargado de planificación de layout del supermercado
- **Sistema:** Aplicación web Mapeador de Góndolas

---

## Precondiciones

- El usuario ha accedido a la aplicación web
- El navegador soporta las tecnologías requeridas (Canvas HTML5, JavaScript moderno)
- La página `/map` está disponible y cargada

---

## Flujo Principal

1. El usuario accede a la página principal del mapeador (`/map`)
2. El sistema muestra la interfaz con tres secciones principales:
   - Panel izquierdo: "Components" con biblioteca de componentes
   - Área central: Canvas con grilla para diseño
   - Panel derecho: "Properties" con propiedades del elemento seleccionado
3. El usuario visualiza la barra superior con:
   - Logo y título "Supermarket Layout Planner"
   - Menú de navegación (File, Edit, View, Help)
   - Botón destacado "Run Solver Algorithm"
4. El usuario explora el panel de componentes que incluye:
   - Barra de búsqueda "Find components..."
   - Categorías: Shelving, Refrigeration, Checkouts, Structural
   - Biblioteca de componentes predefinidos (Standard, End Cap, etc.)
5. El usuario arrastra un componente desde el panel izquierdo hacia el canvas
6. El sistema muestra una previsualización del componente durante el arrastre
7. El usuario suelta el componente en la posición deseada del canvas
8. El sistema coloca el componente en el canvas y lo selecciona automáticamente
9. El panel de propiedades se actualiza mostrando:
   - Name (nombre del componente)
   - Width (ft) - ancho en pies
   - Depth (ft) - profundidad en pies
   - Rotation (°) - rotación en grados
10. El usuario puede modificar las propiedades del componente seleccionado
11. El usuario puede mover componentes ya colocados arrastrándolos en el canvas
12. El usuario puede seleccionar componentes haciendo click sobre ellos
13. El usuario puede eliminar componentes usando teclas o menú contextual
14. El sistema muestra información contextual en la parte inferior:
    - Nivel de zoom actual
    - Tamaño de grilla
    - Posición del cursor (coordenadas X, Y)
    - Espacio total del piso (Floor Space en sq ft)
15. El usuario puede hacer zoom in/out en el canvas
16. El usuario puede deshacer/rehacer acciones usando los botones de la barra inferior

---

## Flujos Alternativos

### FA-001: Rotación de Componente
1. El usuario selecciona un componente en el canvas
2. El usuario modifica el valor de "Rotation (°)" en el panel de propiedades
3. El sistema rota visualmente el componente en el canvas
4. El componente mantiene su posición pero cambia su orientación

### FA-002: Redimensionamiento de Componente
1. El usuario selecciona un componente en el canvas
2. El usuario modifica los valores de "Width (ft)" o "Depth (ft)"
3. El sistema valida que las dimensiones sean válidas
4. El sistema actualiza las dimensiones visuales del componente

### FA-003: Búsqueda de Componentes
1. El usuario escribe en la barra de búsqueda "Find components..."
2. El sistema filtra los componentes disponibles en tiempo real
3. El sistema muestra solo los componentes que coinciden con la búsqueda
4. El usuario puede arrastrar componentes desde los resultados filtrados

### FA-004: Navegación por Categorías
1. El usuario hace click en una categoría (Shelving, Refrigeration, etc.)
2. El sistema expande/colapsa la categoría seleccionada
3. El sistema muestra los componentes específicos de esa categoría

### FA-005: Colisión de Componentes
1. El usuario intenta colocar un componente en una posición ocupada
2. El sistema detecta la colisión
3. El sistema muestra feedback visual (borde rojo, sombra, etc.)
4. El sistema puede:
   - Prevenir la colocación
   - O permitir overlap con advertencia visual

### FA-006: Canvas Vacío
1. El usuario accede al canvas sin componentes colocados
2. El sistema muestra un estado vacío con mensaje guía
3. El mensaje indica "Drag components to canvas" o similar
4. El usuario puede comenzar a agregar componentes

---

## Criterios de Aceptación

### CA-001: Estructura de la Interfaz
- **DADO** que el usuario accede a la página `/map`
- **CUANDO** la página carga completamente
- **ENTONCES** debe mostrar:
  - Panel izquierdo "Components" con ancho fijo (~260px)
  - Canvas central ocupando el espacio restante
  - Panel derecho "Properties" con ancho fijo (~300px)
  - Barra superior con navegación y botón "Run Solver Algorithm"
  - Barra inferior con controles de zoom y estado

### CA-002: Panel de Componentes
- **DADO** que el usuario visualiza el panel de componentes
- **CUANDO** observa la interfaz
- **ENTONCES** debe ver:
  - Título "Components" con subtítulo "Drag to canvas"
  - Barra de búsqueda funcional
  - 4 categorías: Shelving, Refrigeration, Checkouts, Structural
  - Al menos 2 tipos de componentes predefinidos:
    - Standard (4' x 12')
    - End Cap (4' x 3')
  - Cada componente debe mostrar su nombre y dimensiones

### CA-003: Canvas Interactivo
- **DADO** que el usuario visualiza el canvas
- **CUANDO** observa la interfaz
- **ENTONCES** debe ver:
  - Fondo oscuro (#1a2332 o similar)
  - Grilla visible con espaciado de 1ft
  - Área de trabajo amplia (mínimo 100ft x 100ft)
  - Cursor apropiado según la acción (default, grab, grabbing)

### CA-004: Drag and Drop Básico
- **DADO** que el usuario quiere agregar un componente
- **CUANDO** arrastra un componente desde el panel hacia el canvas
- **ENTONCES** el sistema debe:
  - Mostrar previsualización del componente durante el arrastre
  - Cambiar el cursor a "grabbing"
  - Colocar el componente al soltar el mouse
  - Seleccionar automáticamente el componente colocado
  - Actualizar el panel de propiedades

### CA-005: Selección de Componentes
- **DADO** que hay componentes en el canvas
- **CUANDO** el usuario hace click en un componente
- **ENTONCES** el sistema debe:
  - Resaltar visualmente el componente seleccionado (borde azul brillante)
  - Mostrar las propiedades del componente en el panel derecho
  - Deseleccionar cualquier componente previamente seleccionado

### CA-006: Panel de Propiedades
- **DADO** que un componente está seleccionado
- **CUANDO** el usuario observa el panel de propiedades
- **ENTONCES** debe mostrar:
  - Título "Properties"
  - Campo "Name" con el nombre del componente (editable)
  - Campo "Width (ft)" con valor numérico (editable)
  - Campo "Depth (ft)" con valor numérico (editable)
  - Campo "Rotation (°)" con valor numérico 0-360 (editable)
  - Todos los campos deben tener fondo oscuro y texto claro

### CA-007: Movimiento de Componentes
- **DADO** que hay un componente en el canvas
- **CUANDO** el usuario arrastra el componente a una nueva posición
- **ENTONCES** el sistema debe:
  - Permitir el movimiento fluido
  - Mostrar la posición en tiempo real
  - Ajustar a la grilla (snap to grid) si está habilitado
  - Actualizar las coordenadas en la barra inferior

### CA-008: Modificación de Propiedades
- **DADO** que un componente está seleccionado
- **CUANDO** el usuario modifica un valor en el panel de propiedades
- **ENTONCES** el sistema debe:
  - Validar que el valor sea numérico y válido
  - Actualizar visualmente el componente en tiempo real
  - Mantener la selección del componente
  - Reflejar los cambios inmediatamente en el canvas

### CA-009: Rotación de Componentes
- **DADO** que un componente está seleccionado
- **CUANDO** el usuario modifica el campo "Rotation (°)"
- **ENTONCES** el sistema debe:
  - Aceptar valores entre 0 y 360
  - Rotar visualmente el componente alrededor de su centro
  - Mantener la posición del centro del componente
  - Actualizar la visualización en tiempo real

### CA-010: Información Contextual
- **DADO** que el usuario trabaja en el canvas
- **CUANDO** observa la barra inferior
- **ENTONCES** debe ver:
  - "Zoom: X%" con el nivel de zoom actual
  - "Grid: X ft" con el tamaño de la grilla
  - "X: X, Y: Y" con las coordenadas del cursor o componente seleccionado
  - "Floor Space: X sq ft" con el área total calculada

### CA-011: Controles de Zoom
- **DADO** que el usuario quiere ajustar el zoom
- **CUANDO** utiliza los controles de zoom
- **ENTONCES** el sistema debe:
  - Permitir zoom mediante scroll del mouse
  - Mantener el centro del zoom en la posición del cursor
  - Mostrar el porcentaje de zoom actualizado
  - Permitir zoom entre 25% y 400%

### CA-012: Deshacer/Rehacer
- **DADO** que el usuario ha realizado acciones en el canvas
- **CUANDO** hace click en los botones de deshacer/rehacer
- **ENTONCES** el sistema debe:
  - Revertir la última acción (deshacer)
  - Restaurar la acción revertida (rehacer)
  - Mantener un historial de al menos 20 acciones
  - Deshabilitar los botones cuando no hay acciones disponibles

### CA-013: Categorías de Componentes
- **DADO** que el usuario visualiza el panel de componentes
- **CUANDO** hace click en una categoría
- **ENTONCES** el sistema debe:
  - Expandir/colapsar la categoría seleccionada
  - Mostrar un indicador visual del estado (flecha, ícono)
  - Mantener el estado de otras categorías
  - Mostrar los componentes de la categoría expandida

### CA-014: Búsqueda de Componentes
- **DADO** que el usuario quiere buscar un componente específico
- **CUANDO** escribe en la barra de búsqueda
- **ENTONCES** el sistema debe:
  - Filtrar componentes en tiempo real (debounce de 300ms)
  - Buscar por nombre del componente
  - Mostrar resultados mientras se escribe
  - Mostrar mensaje "No results" si no hay coincidencias
  - Limpiar el filtro al borrar el texto

### CA-015: Feedback Visual
- **DADO** que el usuario interactúa con el canvas
- **CUANDO** realiza acciones de drag and drop
- **ENTONCES** el sistema debe proporcionar:
  - Cambio de cursor apropiado (pointer, grab, grabbing)
  - Sombra o efecto visual durante el arrastre
  - Highlight del componente seleccionado
  - Feedback de hover sobre componentes

### CA-016: Grilla Visual
- **DADO** que el usuario visualiza el canvas
- **CUANDO** observa el área de trabajo
- **ENTONCES** debe ver:
  - Líneas de grilla sutiles pero visibles
  - Espaciado consistente de 1ft
  - Grilla que se extiende por todo el canvas
  - Grilla que respeta el nivel de zoom

### CA-017: Estado Inicial
- **DADO** que el usuario accede por primera vez
- **CUANDO** la página carga
- **ENTONCES** el canvas debe:
  - Estar vacío sin componentes
  - Mostrar la grilla completa
  - Tener zoom al 100%
  - Mostrar "Floor Space: 0 sq ft"
  - Tener todos los controles habilitados

### CA-018: Responsividad Básica
- **DADO** que el usuario tiene una ventana de navegador
- **CUANDO** la ventana tiene un ancho mínimo de 1280px
- **ENTONCES** la interfaz debe:
  - Mostrar todos los paneles correctamente
  - Mantener proporciones adecuadas
  - No mostrar scroll horizontal innecesario
  - Permitir interacción fluida

---

## Criterios de Rechazo

### CR-001: Funcionalidades Fuera de Alcance
- **NO** debe incluir persistencia en base de datos
- **NO** debe incluir autenticación de usuarios
- **NO** debe incluir múltiples escenarios simultáneos
- **NO** debe incluir exportación de imágenes/PDF
- **NO** debe incluir colaboración en tiempo real
- **NO** debe incluir dimensiones físicas reales de productos

### CR-002: Limitaciones Técnicas
- **NO** debe soportar navegadores sin soporte de Canvas HTML5
- **NO** debe funcionar en resoluciones menores a 1280px de ancho
- **NO** debe manejar más de 100 componentes simultáneos
- **NO** debe incluir animaciones complejas que afecten performance

---

## Dependencias

### Técnicas
- **Next.js 16.0.1:** Framework de React
- **React 19.2.0:** Biblioteca de UI
- **Konva.js 10.0.8:** Motor de canvas 2D
- **react-konva 19.2.0:** Binding de React para Konva
- **Zustand 5.0.8:** Gestión de estado global
- **Shadcn UI:** Componentes de interfaz (Button, Input, Dialog, etc.)
- **Tailwind CSS 4:** Framework de estilos
- **Lucide React 0.552.0:** Iconos

### Funcionales
- Ninguna historia de usuario previa (esta es la primera funcionalidad)

---

## Notas Técnicas

### Implementación del Canvas
- Utilizar `react-konva` para el canvas interactivo
- Implementar `Stage` como contenedor principal
- Usar `Layer` para organizar elementos
- Cada componente será un `Group` de Konva con formas (`Rect`, `Text`)
- Implementar transformaciones (drag, rotate) con Konva Transformer

### Gestión de Estado
- Store de Zustand para góndolas: `gondolas.ts`
  - Lista de góndolas colocadas
  - Funciones: addGondola, updateGondola, deleteGondola, selectGondola
- Estado local para UI: componente seleccionado, zoom, pan

### Estructura de Datos
```typescript
interface Gondola {
  id: string;
  type: 'standard' | 'endcap' | 'refrigeration' | 'checkout' | 'wall';
  name: string;
  x: number; // posición en canvas
  y: number;
  width: number; // en pies
  depth: number; // en pies
  rotation: number; // 0-360 grados
  shelves?: number; // configurado en vista detallada
}
```

### Consideraciones de Performance
- Virtualización si hay más de 50 componentes
- Debounce en actualizaciones de propiedades (300ms)
- Throttle en eventos de mouse move (16ms)
- Lazy rendering de componentes fuera del viewport

### Accesibilidad
- Navegación por teclado para selección de componentes
- Atajos de teclado: Delete (eliminar), Ctrl+Z (deshacer), Ctrl+Y (rehacer)
- Feedback visual claro para estados (hover, selected, disabled)

---

## Diseño Visual

### Paleta de Colores
- **Fondo principal:** #0f172a (slate-900)
- **Fondo canvas:** #1e293b (slate-800)
- **Grilla:** #334155 (slate-700) con opacidad 0.3
- **Componente normal:** #64748b (slate-500)
- **Componente seleccionado:** Borde #3b82f6 (blue-500)
- **Texto:** #f1f5f9 (slate-100)
- **Botón primario:** #3b82f6 (blue-500)

### Tipografía
- **Fuente principal:** Inter o system-ui
- **Tamaños:**
  - Título: 20px (font-semibold)
  - Subtítulos: 14px (font-medium)
  - Texto normal: 14px (font-normal)
  - Texto pequeño: 12px (font-normal)

### Espaciado
- **Padding paneles:** 16px
- **Gap entre elementos:** 12px
- **Margin entre secciones:** 24px

---

## Casos de Prueba

### CP-001: Agregar Componente Standard
1. Acceder a `/map`
2. Arrastrar "Standard" desde el panel de componentes
3. Soltar en el centro del canvas
4. Verificar que aparece el componente
5. Verificar que está seleccionado (borde azul)
6. Verificar que el panel de propiedades muestra: Name="Standard Shelf A", Width=12, Depth=4, Rotation=0

### CP-002: Mover Componente
1. Tener un componente en el canvas
2. Hacer click y arrastrar el componente
3. Soltar en nueva posición
4. Verificar que el componente se movió
5. Verificar que las coordenadas en la barra inferior se actualizaron

### CP-003: Rotar Componente
1. Seleccionar un componente
2. Cambiar "Rotation (°)" a 90
3. Verificar que el componente rota 90 grados
4. Cambiar a 180
5. Verificar rotación correcta

### CP-004: Modificar Dimensiones
1. Seleccionar un componente
2. Cambiar "Width (ft)" de 12 a 8
3. Verificar que el ancho visual cambia
4. Cambiar "Depth (ft)" de 4 a 6
5. Verificar que la profundidad visual cambia

### CP-005: Búsqueda de Componentes
1. Escribir "end" en la barra de búsqueda
2. Verificar que solo aparece "End Cap"
3. Borrar el texto
4. Verificar que todos los componentes vuelven a aparecer

### CP-006: Zoom In/Out
1. Usar scroll del mouse hacia arriba
2. Verificar que el zoom aumenta
3. Verificar que la barra inferior muestra el nuevo porcentaje
4. Usar scroll hacia abajo
5. Verificar que el zoom disminuye

### CP-007: Deshacer/Rehacer
1. Agregar un componente
2. Click en botón "Deshacer"
3. Verificar que el componente desaparece
4. Click en botón "Rehacer"
5. Verificar que el componente reaparece

### CP-008: Múltiples Componentes
1. Agregar 3 componentes diferentes
2. Verificar que todos se muestran correctamente
3. Seleccionar cada uno individualmente
4. Verificar que el panel de propiedades cambia para cada uno

### CP-009: Categorías
1. Click en "Shelving"
2. Verificar que se expande/colapsa
3. Click en "Refrigeration"
4. Verificar que se expande/colapsa
5. Verificar que ambas pueden estar expandidas simultáneamente

### CP-010: Editar Nombre
1. Seleccionar un componente
2. Cambiar el campo "Name" a "Mi Góndola"
3. Verificar que el nombre se actualiza
4. Verificar que el nombre se muestra en el canvas (si aplica)

---

## Estimación

- **Complejidad:** Alta
- **Puntos de Historia:** 13
- **Tiempo Estimado:** 3-5 días de desarrollo
- **Esfuerzo:** 
  - Setup de Konva y canvas: 4 horas
  - Implementación de drag and drop: 8 horas
  - Panel de componentes: 4 horas
  - Panel de propiedades: 4 horas
  - Controles de zoom y navegación: 4 horas
  - Gestión de estado con Zustand: 4 horas
  - Estilos y UI: 6 horas
  - Testing y ajustes: 6 horas

---

## Definición de Hecho (Definition of Done)

- [ ] Todos los criterios de aceptación están implementados
- [ ] La interfaz coincide con el diseño de referencia
- [ ] El drag and drop funciona fluidamente
- [ ] Los tres paneles (Components, Canvas, Properties) están implementados
- [ ] El estado se gestiona correctamente con Zustand
- [ ] Los componentes se pueden agregar, mover, rotar y eliminar
- [ ] El panel de propiedades se actualiza correctamente
- [ ] Los controles de zoom funcionan correctamente
- [ ] Deshacer/Rehacer funcionan para todas las acciones
- [ ] La búsqueda de componentes filtra correctamente
- [ ] No hay errores en consola
- [ ] No hay warnings de linter
- [ ] El código sigue las convenciones del proyecto
- [ ] La funcionalidad está probada manualmente
- [ ] La aplicación funciona en Chrome, Firefox y Edge
- [ ] El rendimiento es aceptable (60fps durante interacciones)
- [ ] La documentación técnica está actualizada

---

## Riesgos y Mitigaciones

### Riesgo 1: Performance con Muchos Componentes
- **Probabilidad:** Media
- **Impacto:** Alto
- **Mitigación:** 
  - Implementar virtualización si se supera el límite
  - Limitar a 100 componentes máximo en MVP
  - Optimizar re-renders con React.memo

### Riesgo 2: Complejidad de Konva.js
- **Probabilidad:** Media
- **Impacto:** Medio
- **Mitigación:**
  - Revisar documentación y ejemplos de react-konva
  - Implementar funcionalidad básica primero
  - Iterar sobre funcionalidades avanzadas

### Riesgo 3: Gestión de Estado Compleja
- **Probabilidad:** Baja
- **Impacto:** Medio
- **Mitigación:**
  - Usar Zustand que es más simple que Redux
  - Mantener stores separados por dominio
  - Documentar estructura de estado

### Riesgo 4: Compatibilidad de Navegadores
- **Probabilidad:** Baja
- **Impacto:** Bajo
- **Mitigación:**
  - Probar en navegadores principales
  - Usar polyfills si es necesario
  - Definir navegadores soportados claramente

---

## Referencias

- **Diseño UI:** `docs/ImagenesFront/CanvaPrincipal.png`
- **Especificaciones del Proyecto:** `docs/proyecto-mapeador-gondolas.md`
- **Documentación Konva.js:** https://konvajs.org/
- **Documentación react-konva:** https://konvajs.org/docs/react/
- **Documentación Zustand:** https://zustand-demo.pmnd.rs/

---

## Historial de Cambios

| Fecha | Versión | Autor | Cambios |
|-------|---------|-------|---------|
| 31/10/2025 | 1.0 | Sistema | Creación inicial de la historia de usuario |

---

## Aprobaciones

- [ ] Product Owner
- [ ] Tech Lead
- [ ] UX/UI Designer
- [ ] Equipo de Desarrollo

