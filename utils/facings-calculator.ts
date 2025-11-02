import { Product, SolverConfig } from '@/types';

/**
 * Calcula la cantidad de facings (espacios) que debería ocupar un producto
 * basándose en sus ventas del último mes y margen de ganancia
 */
export const calculateDesiredFacings = (
  product: Product,
  config?: SolverConfig
): number => {
  // Si el producto ya tiene facings definidos, usarlos
  if (product.facingsDeseados && product.facingsDeseados > 0) {
    return Math.min(product.facingsDeseados, config?.maxFacingsPorProducto ?? 3);
  }

  // Calcular score combinado (similar al solver)
  const marginWeight = config?.marginWeight ?? 0.6;
  const salesWeight = config?.salesWeight ?? 0.4;
  const maxFacings = config?.maxFacingsPorProducto ?? 3;
  
  // Normalizar ventas para el cálculo (asumiendo rango típico de 0-500 unidades)
  const ventasNormalizadas = Math.min(product.ventas / 500, 1);
  
  const score = 
    (marginWeight * product.margen_ganancia) +
    (salesWeight * ventasNormalizadas);

  // Determinar facings basado en el score combinado
  // Score está entre 0 y 1 (aproximadamente)
  let facings: number;
  
  if (score >= 0.7) {
    // Productos de alta rotación y margen: 3-maxFacings facings
    facings = product.ventas >= 300 ? maxFacings : Math.max(3, maxFacings - 1);
  } else if (score >= 0.5) {
    // Productos de rotación media-alta: 2-3 facings
    facings = product.ventas >= 150 ? 3 : 2;
  } else if (score >= 0.3) {
    // Productos de rotación media: 1-2 facings
    facings = product.ventas >= 75 ? 2 : 1;
  } else {
    // Productos de baja rotación: 1 facing
    facings = 1;
  }
  
  // Respetar el límite máximo configurado
  return Math.min(facings, maxFacings);
};

/**
 * Calcula facings para todos los productos en un lote
 */
export const calculateBulkFacings = (
  products: Product[],
  config?: SolverConfig
): Product[] => {
  return products.map(product => ({
    ...product,
    facingsDeseados: calculateDesiredFacings(product, config)
  }));
};

/**
 * Valida que los facings deseados no excedan el stock disponible
 */
export const validateFacings = (product: Product): number => {
  const desired = product.facingsDeseados ?? 1;
  return Math.min(desired, product.stock);
};

