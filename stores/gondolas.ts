import { create } from 'zustand';
import { Gondola, GondolasStore } from '@/types';

export const useGondolasStore = create<GondolasStore>((set) => ({
  gondolas: [],
  selectedGondolaId: null,
  
  addGondola: (gondola: Gondola) =>
    set((state) => ({
      gondolas: [...state.gondolas, gondola],
      selectedGondolaId: gondola.id,
    })),
  
  updateGondola: (id: string, data: Partial<Gondola>) =>
    set((state) => ({
      gondolas: state.gondolas.map((g) =>
        g.id === id ? { ...g, ...data } : g
      ),
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
