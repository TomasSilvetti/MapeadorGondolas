import { create } from 'zustand';
import { SolverConfig, SolverConfigStore } from '@/types';

const defaultConfig: SolverConfig = {
  marginWeight: 0.6,
  salesWeight: 0.4,
  maxExecutionTime: 30, // 30 segundos por defecto
  diversidadMinima: 0.7, // 70% de diversidad mínima (recomendado: 60-80%)
  maxFacingsPorProducto: 3, // máximo 3 facings por producto (recomendado: 2-3)
  minFacingsPorProducto: 1, // mínimo 1 facing si está asignado
};

export const useSolverConfigStore = create<SolverConfigStore>((set) => ({
  config: defaultConfig,
  
  updateConfig: (newConfig: Partial<SolverConfig>) =>
    set((state) => ({
      config: { ...state.config, ...newConfig },
    })),
}));
