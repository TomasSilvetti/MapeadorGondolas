import { create } from 'zustand';
import { ViewModeStore } from '@/types';

export const useViewModeStore = create<ViewModeStore>((set) => ({
  mode: 'design',
  hasResults: false,
  selectedShelfId: null,
  
  setMode: (mode: 'design' | 'results') =>
    set({ mode }),
  
  setHasResults: (has: boolean) =>
    set({ hasResults: has }),
  
  setSelectedShelfId: (id: string | null) =>
    set({ selectedShelfId: id }),
}));

