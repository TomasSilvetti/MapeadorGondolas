import { create } from 'zustand';
import { Gondola, GondolasStore, Shelf } from '@/types';

// Helper para crear estantes por defecto
const createDefaultShelves = (count: number): Shelf[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `shelf-${Date.now()}-${i}`,
    numero: i + 1,
    espacios: [],
    cantidadEspacios: 1,
    restriccionModo: 'permitir' as const,
    categoriasRestringidas: [],
    factorVisualizacion: 1.0,
  }));
};

// Helper para calcular factores de visualización basados en distancia lineal
const calculateVisualizationFactors = (totalShelves: number, principalIndex: number): number[] => {
  if (totalShelves === 0) return [];
  
  // Calcular la distancia máxima posible
  const maxDistance = Math.max(principalIndex, totalShelves - 1 - principalIndex);
  
  // Si solo hay un estante o maxDistance es 0, todos tienen 100%
  if (maxDistance === 0) return Array(totalShelves).fill(1.0);
  
  // Calcular el decremento por nivel (para que el más lejano tenga al menos 25%)
  const decrementoPorNivel = 0.75 / maxDistance;
  
  return Array.from({ length: totalShelves }, (_, i) => {
    const distancia = Math.abs(i - principalIndex);
    const factor = 1.0 - (distancia * decrementoPorNivel);
    return Math.max(0.25, Math.min(1.0, factor));
  });
};

export const useGondolasStore = create<GondolasStore>((set) => ({
  gondolas: [],
  selectedGondolaId: null,
  
  addGondola: (gondola: Gondola) =>
    set((state) => {
      // Inicializar con 5 estantes si no tiene
      const estantes = gondola.estantes || createDefaultShelves(5);
      const principalIndex = Math.floor(estantes.length / 2); // Estante del medio por defecto
      
      const gondolaConEstantes = {
        ...gondola,
        estantes,
        estantePrincipalIndex: principalIndex,
      };
      return {
        gondolas: [...state.gondolas, gondolaConEstantes],
        selectedGondolaId: gondola.id,
      };
    }),
  
  updateGondola: (id: string, data: Partial<Gondola>) =>
    set((state) => ({
      gondolas: state.gondolas.map((g) =>
        g.id === id ? { ...g, ...data } : g
      ),
    })),
  
  updateShelf: (gondolaId: string, shelfId: string, data: Partial<Shelf>) =>
    set((state) => ({
      gondolas: state.gondolas.map((g) => {
        if (g.id !== gondolaId) return g;
        return {
          ...g,
          estantes: g.estantes?.map((s) =>
            s.id === shelfId ? { ...s, ...data } : s
          ),
        };
      }),
    })),
  
  updateShelfCount: (gondolaId: string, count: number) =>
    set((state) => ({
      gondolas: state.gondolas.map((g) => {
        if (g.id !== gondolaId) return g;
        const currentCount = g.estantes?.length || 0;
        let newEstantes = g.estantes || [];
        
        if (count > currentCount) {
          // Agregar estantes
          const newShelves = createDefaultShelves(count - currentCount).map((s, i) => ({
            ...s,
            numero: currentCount + i + 1,
          }));
          newEstantes = [...newEstantes, ...newShelves];
        } else if (count < currentCount) {
          // Remover estantes
          newEstantes = newEstantes.slice(0, count);
        }
        
        // Recalcular el índice principal (estante del medio)
        const newPrincipalIndex = Math.floor(count / 2);
        
        // Recalcular factores de visualización
        const newFactors = calculateVisualizationFactors(count, newPrincipalIndex);
        newEstantes = newEstantes.map((s, i) => ({
          ...s,
          factorVisualizacion: newFactors[i],
        }));
        
        return { 
          ...g, 
          estantes: newEstantes,
          estantePrincipalIndex: newPrincipalIndex,
        };
      }),
    })),
  
  applyGlobalShelfConfig: (gondolaId: string, config: Partial<Shelf>) =>
    set((state) => ({
      gondolas: state.gondolas.map((g) => {
        if (g.id !== gondolaId) return g;
        return {
          ...g,
          estantes: g.estantes?.map((s) => ({
            ...s,
            ...config,
          })),
        };
      }),
    })),
  
  updatePrincipalShelf: (gondolaId: string, shelfIndex: number) =>
    set((state) => ({
      gondolas: state.gondolas.map((g) => {
        if (g.id !== gondolaId) return g;
        
        const totalShelves = g.estantes?.length || 0;
        if (shelfIndex < 0 || shelfIndex >= totalShelves) return g;
        
        // Calcular nuevos factores de visualización
        const newFactors = calculateVisualizationFactors(totalShelves, shelfIndex);
        
        return {
          ...g,
          estantePrincipalIndex: shelfIndex,
          estantes: g.estantes?.map((s, i) => ({
            ...s,
            factorVisualizacion: newFactors[i],
          })),
        };
      }),
    })),
  
  deleteGondola: (id: string) =>
    set((state) => ({
      gondolas: state.gondolas.filter((g) => g.id !== id),
      selectedGondolaId: state.selectedGondolaId === id ? null : state.selectedGondolaId,
    })),
  
  selectGondola: (id: string | null) =>
    set({ selectedGondolaId: id }),
  
  clearGondolas: () =>
    set({ gondolas: [], selectedGondolaId: null }),
}));
