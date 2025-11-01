# Mapeador de Góndolas

Sistema web de mapeo visual para optimizar la disposición de productos en supermercados mediante un algoritmo solver que determina la ubicación óptima basada en margen de ganancia y popularidad.

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI
- **Canvas**: Konva.js (react-konva)
- **State Management**: Zustand
- **CSV Parsing**: PapaParse
- **Charts**: Recharts

## Requisitos Previos

- Node.js 18+ (recomendado 22+)
- npm 10+

## Instalación y Setup

1. **Instalar dependencias**:
```bash
npm install
```

2. **Ejecutar en desarrollo**:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
mapeador-gondolas-app/
├── app/
│   ├── layout.tsx              # Layout global
│   ├── page.tsx                # Página de inicio
│   ├── map/
│   │   └── page.tsx            # Vista de mapa (diseño de layout)
│   ├── gondola/
│   │   └── [id]/
│   │       └── page.tsx        # Vista de góndola individual
│   ├── config/
│   │   └── page.tsx            # Configuración del solver
│   ├── reports/
│   │   └── page.tsx            # Reportes y estadísticas
│   └── globals.css             # Estilos globales
├── components/
│   ├── ui/                     # Componentes Shadcn UI
│   └── custom/                 # Componentes personalizados
├── stores/                     # Zustand stores
│   ├── products.ts
│   ├── gondolas.ts
│   ├── assignments.ts
│   └── solver-config.ts
├── utils/                      # Utilidades
│   ├── csv-parser.ts
│   └── solver-algorithm.ts
├── types/                      # TypeScript types
│   └── index.ts
└── lib/
    └── utils.ts                # Utilidades de Shadcn
```

## Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm start` - Inicia servidor de producción
- `npm run lint` - Ejecuta ESLint
- `npm run format` - Formatea código con Prettier
- `npm run format:check` - Verifica formateo sin aplicar cambios

## Rutas Disponibles

- `/` - Página de inicio
- `/map` - Vista de mapa y diseño de layout
- `/config` - Configuración del algoritmo solver
- `/reports` - Reportes y estadísticas

## Tipos de Datos

### Producto
```typescript
{
  id: string;
  nombre: string;
  precio: number;
  margen_ganancia: number; // 0-1
  popularidad: number; // 0-100
  categoria: string;
  stock: number;
}
```

### Góndola
```typescript
{
  id: string;
  tipo: 'normal' | 'heladera';
  x: number;
  y: number;
  largo: number;
  rotacion: number; // grados
  estantes: Shelf[];
}
```

## Formato CSV

Los productos se cargan mediante archivo CSV con las siguientes columnas:

```csv
id,nombre,precio,margen_ganancia,popularidad,categoria,stock
1,Coca Cola 2L,150,0.35,95,Bebidas,100
2,Pan Lactal,85,0.25,88,Panadería,50
```

## Desarrollo

### Agregar Componentes Shadcn

```bash
npx shadcn@latest add nombre-componente
```

### Crear nuevas páginas

1. Crear carpeta en `app/` con el nombre de la ruta
2. Crear archivo `page.tsx` dentro
3. Exportar componente por defecto

### Trabajar con Zustand

Los stores están en la carpeta `stores/`. Cada store exporta un hook personalizado:

```typescript
import { useProductsStore } from '@/stores/products';

// En componentes
const products = useProductsStore((state) => state.products);
const loadProducts = useProductsStore((state) => state.loadProducts);
```

## Features Implementadas (HU-001)

- ✅ Proyecto Next.js 14 inicializado con TypeScript
- ✅ Shadcn UI configurado con componentes base
- ✅ Tailwind CSS configurado
- ✅ Zustand instalado y stores creados
- ✅ Konva.js instalado
- ✅ PapaParse instalado
- ✅ Recharts instalado
- ✅ Estructura de carpetas creada
- ✅ ESLint y Prettier configurados
- ⏳ Despliegue en Vercel (al final del MVP)

## Próximos Pasos

1. **HU-002**: Definir tipos TypeScript completos
2. **HU-003**: Crear componentes de UI base
3. **HU-004**: Implementar carga de CSV
4. **HU-005**: Canvas interactivo con Konva
5. **HU-006**: Algoritmo solver
6. **HU-007**: Sistema de reportes

## Performance

- Optimizado para ~500 productos en memoria
- Hasta 30 góndolas sin problemas de renderizado
- Solver puede tomar varios segundos (mostrar loading state)

## Notas

- El MVP no incluye base de datos; todo funciona en memoria del navegador
- Los datos se pierden al recargar la página
- La persistencia será agregada en versiones futuras

## Licencia

Proyecto interno - El Puesto

## Contacto

Para preguntas o sugerencias sobre el desarrollo, contacta al equipo de desarrollo.
