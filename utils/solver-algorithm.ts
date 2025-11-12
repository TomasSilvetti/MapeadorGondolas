import { Product, Gondola, Assignment, SolverConfig, SolverResult, Category } from '@/types';
import { calculateDesiredFacings } from './facings-calculator';

interface Position {
  id: string;
  gondolaId: string;
  shelfId: string;
  spaceId: string;
  shelfNumber: number;
  totalShelves: number;
  factorVisualizacion: number;
}

interface CategoryConstraint {
  modo: 'permitir' | 'excluir';
  categorias: Category[];
}


/**
 * Extrae todas las posiciones disponibles de las góndolas
 */
const extractAllPositions = (gondolas: Gondola[]): Position[] => {
  const positions: Position[] = [];
  
  for (const gondola of gondolas) {
    if (!gondola.estantes) continue;
    
    const totalShelves = gondola.estantes.length;
    
    for (const shelf of gondola.estantes) {
      // Generar espacios si no existen
      const espaciosCount = shelf.cantidadEspacios || 10;
      
      for (let i = 0; i < espaciosCount; i++) {
        positions.push({
          id: `${gondola.id}-${shelf.id}-${i}`,
          gondolaId: gondola.id,
          shelfId: shelf.id,
          spaceId: `space-${shelf.id}-${i}`,
          shelfNumber: shelf.numero,
          totalShelves,
          factorVisualizacion: shelf.factorVisualizacion || 1.0,
        });
      }
    }
  }
  
  return positions;
};

/**
 * Extrae las restricciones de categoría por estante
 */
const extractCategoryConstraints = (gondolas: Gondola[]): Record<string, CategoryConstraint> => {
  const constraints: Record<string, CategoryConstraint> = {};
  
  for (const gondola of gondolas) {
    if (!gondola.estantes) continue;
    
    for (const shelf of gondola.estantes) {
      constraints[shelf.id] = {
        modo: shelf.restriccionModo,
        categorias: shelf.categoriasRestringidas,
      };
    }
  }
  
  return constraints;
};

/**
 * Calcula factores de visibilidad para todas las posiciones
 * Usa el factor de visualización configurado en cada estante
 */
const calculateVisibilityFactors = (positions: Position[]): Record<string, number> => {
  const factors: Record<string, number> = {};
  
  for (const position of positions) {
    // Usar el factor configurado en el estante en lugar de calcularlo
    factors[position.id] = position.factorVisualizacion;
  }
  
  return factors;
};

/**
 * Solver principal usando ILP con Web Worker
 */
export const solvePlacementILP = async (
  products: Product[],
  gondolas: Gondola[],
  config: SolverConfig
): Promise<SolverResult> => {
  const startTime = Date.now();
  
  console.log('🚀 [Solver] Iniciando solver de optimización...');
  console.log('📊 [Solver] Configuración:', config);
  console.log('📦 [Solver] Productos:', products.length);
  console.log('🏪 [Solver] Góndolas:', gondolas.length);
  
  try {
    // Calcular facings deseados para productos que no los tienen
    console.log('🧮 [Solver] Calculando facings deseados...');
    const productsWithFacings = products.map(p => ({
      ...p,
      facingsDeseados: calculateDesiredFacings(p, config),
    }));
    
    const totalFacings = productsWithFacings.reduce((sum, p) => sum + (p.facingsDeseados || 1), 0);
    console.log('✅ [Solver] Facings totales deseados:', totalFacings);
    
    // Extraer posiciones disponibles
    console.log('📍 [Solver] Extrayendo posiciones disponibles...');
    const positions = extractAllPositions(gondolas);
    console.log('✅ [Solver] Posiciones disponibles:', positions.length);
    
    if (positions.length === 0) {
      console.error('❌ [Solver] No hay posiciones disponibles');
      return {
        assignments: [],
        totalGanancia: 0,
        productosNoAsignados: products.map(p => p.id),
        tiempoEjecucion: 0,
        status: 'error',
        message: 'No hay posiciones disponibles en las góndolas. Asegúrate de que las góndolas tengan estantes configurados.',
      };
    }
    
    if (totalFacings > positions.length) {
      console.warn('⚠️ [Solver] Los facings deseados exceden las posiciones disponibles');
      console.warn(`   Facings deseados: ${totalFacings}, Posiciones: ${positions.length}`);
    }
    
    // Extraer restricciones de categoría
    console.log('🔒 [Solver] Extrayendo restricciones de categoría...');
    const categoryConstraints = extractCategoryConstraints(gondolas);
    const constraintsCount = Object.keys(categoryConstraints).length;
    console.log('✅ [Solver] Restricciones de categoría:', constraintsCount);
    
    // 🔍 DEPURACIÓN: Mostrar muestra de restricciones
    console.log('🔍 [Solver] Muestra de restricciones de categoría:');
    let sampleCount = 0;
    for (const [shelfId, constraint] of Object.entries(categoryConstraints)) {
      if (sampleCount < 3) {
        console.log(`   Shelf ${shelfId}:`, constraint);
        sampleCount++;
      }
    }
    
    // 🔍 DEPURACIÓN: Mostrar categorías únicas de productos
    const uniqueCategories = new Set(products.map(p => p.categoria));
    console.log('🔍 [Solver] Categorías únicas en productos:', Array.from(uniqueCategories));
    
    // Calcular factores de visibilidad
    console.log('👁️ [Solver] Calculando factores de visibilidad...');
    const visibilityFactors = calculateVisibilityFactors(positions);
    console.log('✅ [Solver] Factores de visibilidad calculados');
    
    // Crear Web Worker
    console.log('⚙️ [Solver] Creando Web Worker...');
    const worker = new Worker(
      new URL('./solver.worker.ts', import.meta.url),
      { type: 'module' }
    );
    console.log('✅ [Solver] Web Worker creado');
    
    // Enviar datos al worker y esperar respuesta
    console.log('📤 [Solver] Enviando datos al worker...');
    const result = await new Promise<SolverResult>((resolve, reject) => {
      const timeoutMs = (config.maxExecutionTime || 30) * 1000 + 5000; // +5s de margen
      console.log(`⏰ [Solver] Timeout configurado: ${timeoutMs / 1000}s`);
      
      const timeout = setTimeout(() => {
        console.error('❌ [Solver] Timeout alcanzado');
        worker.terminate();
        reject(new Error(`Timeout: El solver tardó más de ${timeoutMs / 1000} segundos`));
      }, timeoutMs);
      
      worker.onmessage = (e: MessageEvent) => {
        clearTimeout(timeout);
        worker.terminate();
        
        const data = e.data;
        console.log('📥 [Solver] Respuesta recibida del worker:', {
          success: data.success,
          status: data.status,
          assignments: data.assignments?.length || 0,
        });
        
        if (data.success) {
          console.log('✅ [Solver] Optimización exitosa');
          resolve({
            assignments: data.assignments || [],
            totalGanancia: data.totalGanancia || 0,
            productosNoAsignados: data.productosNoAsignados || [],
            tiempoEjecucion: data.tiempoEjecucion || 0,
            status: data.status || 'feasible',
            message: data.message,
          });
        } else {
          console.error('❌ [Solver] Optimización falló:', data.message || data.error);
          resolve({
            assignments: [],
            totalGanancia: 0,
            productosNoAsignados: products.map(p => p.id),
            tiempoEjecucion: data.tiempoEjecucion || 0,
            status: data.status || 'error',
            message: data.message || data.error || 'Error desconocido en el solver',
          });
        }
      };
      
      worker.onerror = (error) => {
        console.error('❌ [Solver] Error en el worker:', error);
        clearTimeout(timeout);
        worker.terminate();
        reject(error);
      };
      
      // Enviar datos al worker
      console.log('📨 [Solver] Datos enviados al worker');
      worker.postMessage({
        products: productsWithFacings,
        positions,
        visibilityFactors,
        categoryConstraints,
        config,
      });
    });
    
    const tiempoTotal = (Date.now() - startTime) / 1000;
    console.log(`✅ [Solver] Proceso completado en ${tiempoTotal.toFixed(2)}s`);
    
    return result;
  } catch (error: any) {
    const tiempoEjecucion = (Date.now() - startTime) / 1000;
    
    console.error('❌ [Solver] Error crítico en el solver:', error);
    console.error('📍 [Solver] Stack trace:', error.stack);
    
    return {
      assignments: [],
      totalGanancia: 0,
      productosNoAsignados: products.map(p => p.id),
      tiempoEjecucion,
      status: 'error',
      message: `Error al ejecutar el solver: ${error.message || 'Error desconocido'}. Revisa la consola del navegador para más detalles.`,
    };
  }
};

/**
 * Calcula el score de un producto (usado para ordenamiento)
 * Combina margen de ganancia y ventas del último mes
 */
export const calculateProductScore = (
  product: Product,
  config: SolverConfig
): number => {
  const marginScore = product.margen_ganancia * config.marginWeight;
  // Normalizar ventas (asumiendo rango típico de 0-500 unidades)
  const ventasNormalizadas = Math.min(product.ventas / 500, 1);
  const salesScore = ventasNormalizadas * config.salesWeight;
  return marginScore + salesScore;
};

/**
 * Calcula el score de una posición basado en su factor de visualización
 */
export const calculatePositionScore = (
  factorVisualizacion: number
): number => {
  return factorVisualizacion;
};

/**
 * Valida una asignación individual
 */
export const validateAssignment = (
  assignment: Assignment,
  product: Product,
  gondola: Gondola,
  allAssignments: Assignment[]
): boolean => {
  // Verificar que el producto tenga stock
  if (product.stock <= 0) return false;
  
  // Encontrar el espacio siendo asignado
  let shelf = null;
  for (const s of gondola.estantes || []) {
    if (s.id === assignment.shelfId) {
      shelf = s;
      break;
    }
  }
  
  if (!shelf) return false;
  
  // Verificar restricciones de categoría del estante
  if (shelf.restriccionModo === 'permitir') {
    // Solo permitir categorías en la lista
    if (shelf.categoriasRestringidas.length > 0) {
      // Verificar si alguna categoría del producto está en las permitidas
      const tieneCategoriasPermitidas = product.categoria.some(cat => 
        shelf.categoriasRestringidas.includes(cat)
      );
      if (!tieneCategoriasPermitidas) {
        return false;
      }
    }
  } else {
    // Excluir categorías en la lista
    // Verificar si alguna categoría del producto está en las excluidas
    const tieneCategoriaExcluida = product.categoria.some(cat =>
      shelf.categoriasRestringidas.includes(cat)
    );
    if (tieneCategoriaExcluida) {
      return false;
    }
  }
  
  // Verificar si el espacio ya está ocupado
  const isOccupied = allAssignments.some(
    (a) =>
      a.gondolaId === assignment.gondolaId &&
      a.shelfId === assignment.shelfId &&
      a.spaceId === assignment.spaceId
  );
  
  return !isOccupied;
};
