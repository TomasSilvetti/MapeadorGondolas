import { create } from 'zustand';
import { SolverConfig, SolverConfigStore } from '@/types';

const defaultConfig: SolverConfig = {
  marginWeight: 0.6,
  popularityWeight: 0.4,
};

export const useSolverConfigStore = create<SolverConfigStore>((set) => ({
  config: defaultConfig,
  
  updateConfig: (newConfig: Partial<SolverConfig>) =>
    set((state) => ({
      config: { ...state.config, ...newConfig },
    })),
}));
