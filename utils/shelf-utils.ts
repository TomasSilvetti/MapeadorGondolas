import { Shelf } from '@/types';

/**
 * Calcula el factor de visualización de un estante basado en su altura.
 * Los estantes a la altura de los ojos tienen el factor más alto (1.0).
 * Los estantes superiores e inferiores tienen factores más bajos.
 * 
 * @param shelf - El estante para el cual calcular el factor
 * @param totalShelves - Número total de estantes en la góndola
 * @returns Factor de visualización entre 0.5 y 1.0
 */
export function calculateVisualizationFactor(shelf: Shelf, totalShelves: number): number {
  // Si ya tiene un factor definido, usarlo
  if (shelf.factorVisualizacion !== undefined) {
    return shelf.factorVisualizacion;
  }

  // Los estantes se numeran de abajo hacia arriba (1 es el más bajo)
  // El estante a la altura de los ojos típicamente es el 3ro o 4to desde abajo
  const eyeLevelShelf = Math.ceil(totalShelves / 2);
  
  // Calcular distancia desde el nivel de los ojos
  const distanceFromEyeLevel = Math.abs(shelf.numero - eyeLevelShelf);
  
  // Factor base: 1.0 para nivel de ojos, decrece con la distancia
  // Mínimo factor: 0.5
  const maxDistance = Math.max(eyeLevelShelf - 1, totalShelves - eyeLevelShelf);
  const factor = 1.0 - (distanceFromEyeLevel / maxDistance) * 0.5;
  
  return Math.max(0.5, Math.min(1.0, factor));
}

/**
 * Obtiene una descripción textual del nivel de visualización
 */
export function getVisualizationLevel(factor: number): string {
  if (factor >= 0.9) return 'Excelente';
  if (factor >= 0.8) return 'Muy Buena';
  if (factor >= 0.7) return 'Buena';
  if (factor >= 0.6) return 'Regular';
  return 'Baja';
}

/**
 * Obtiene el color asociado al nivel de visualización
 */
export function getVisualizationColor(factor: number): string {
  if (factor >= 0.9) return 'text-green-400';
  if (factor >= 0.8) return 'text-lime-400';
  if (factor >= 0.7) return 'text-yellow-400';
  if (factor >= 0.6) return 'text-orange-400';
  return 'text-red-400';
}

