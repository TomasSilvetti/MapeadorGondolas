import { Product, Gondola, Assignment, SolverConfig } from '@/types';

/**
 * Solver algorithm for optimal product placement
 * This is a placeholder that will be expanded with actual optimization logic
 * 
 * Algorithm overview:
 * 1. Scores each product based on margin and popularity
 * 2. Scores each shelf position (optimal positions are 4-5 from bottom)
 * 3. Assigns highest-scoring products to best positions
 * 4. Respects category restrictions
 * 5. Verifies stock availability
 */

export const calculateProductScore = (
  product: Product,
  config: SolverConfig
): number => {
  const marginScore = product.margen_ganancia * config.marginWeight;
  const popularityScore = (product.popularidad / 100) * config.popularityWeight;
  return marginScore + popularityScore;
};

export const calculatePositionScore = (
  shelfNumber: number,
  totalShelves: number
): number => {
  // Optimal shelves are 4 and 5 (from bottom)
  // Score decreases as we move away from those positions
  const distanceFromOptimal = Math.min(
    Math.abs(shelfNumber - 4),
    Math.abs(shelfNumber - 5),
    totalShelves - shelfNumber + 1 // distance from top
  );
  return Math.max(0, 1 - distanceFromOptimal * 0.2);
};

export const solvePlacement = (
  products: Product[],
  gondolas: Gondola[],
  config: SolverConfig
): Assignment[] => {
  const assignments: Assignment[] = [];
  
  // TODO: Implement greedy algorithm or optimization solver
  // For MVP, this will be a simplified version
  
  return assignments;
};

export const validateAssignment = (
  assignment: Assignment,
  product: Product,
  gondola: Gondola,
  allAssignments: Assignment[]
): boolean => {
  // Verify product has stock
  if (product.stock <= 0) return false;
  
  // Find the space being assigned to
  let space = null;
  for (const shelf of gondola.estantes) {
    space = shelf.espacios.find((s) => s.id === assignment.spaceId);
    if (space) break;
  }
  
  if (!space) return false;
  
  // Check category restrictions
  if (
    space.categoriasProhibidas?.includes(product.categoria)
  ) {
    return false;
  }
  
  if (
    space.categoriasPermitidas &&
    !space.categoriasPermitidas.includes(product.categoria)
  ) {
    return false;
  }
  
  // Check if space is already occupied
  const isOccupied = allAssignments.some(
    (a) =>
      a.gondolaId === assignment.gondolaId &&
      a.shelfId === assignment.shelfId &&
      a.spaceId === assignment.spaceId
  );
  
  return !isOccupied;
};
