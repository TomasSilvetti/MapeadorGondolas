import { create } from 'zustand';
import { Gondola, GondolasStore, Shelf } from '@/types';

// Helper para crear estantes por defecto
const createDefaultShelves = (count: number): Shelf[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `shelf-${Date.now()}-${i}`,
    numero: i + 1,
    espacios: [],
    cantidadEspacios: 10,
    restriccionModo: 'permitir' as const,
    categoriasRestringidas: [],
  }));
};

export const useGondolasStore = create<GondolasStore>((set) => ({
  gondolas: [],
  selectedGondolaId: null,
  
  addGondola: (gondola: Gondola) =>
    set((state) => {
      // Inicializar con 5 estantes si no tiene
      const gondolaConEstantes = {
        ...gondola,
        estantes: gondola.estantes || createDefaultShelves(5),
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
        
        return { ...g, estantes: newEstantes };
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
