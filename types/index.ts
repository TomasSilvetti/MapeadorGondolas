// Product types
export type Category = 'Bebidas' | 'Panadería' | 'Lácteos' | 'Carnes' | 'Verduras' | 'Frutas' | 'Otros';

export interface Product {
  id: string;
  nombre: string;
  precio: number;
  margen_ganancia: number;
  ventas: number; // número de unidades vendidas (ventas del último mes)
  categoria: Category;
  stock: number;
  facingsDeseados?: number; // cantidad de espacios que puede ocupar
}

// Gondola types
export type GondolaType = 'standard' | 'endcap' | 'refrigeration' | 'checkout' | 'wall';

export interface Space {
  id: string;
  position: number; // posición en el estante
  categoriasPermitidas?: Category[];
  categoriasProhibidas?: Category[];
  productId?: string; // producto asignado
}

export interface Shelf {
  id: string;
  numero: number;
  espacios: Space[];
  cantidadEspacios: number; // cantidad configurable de espacios
  restriccionModo: 'permitir' | 'excluir'; // modo de restricción
  categoriasRestringidas: Category[]; // categorías afectadas
  factorVisualizacion?: number; // factor de visualización basado en altura (0-1)
}

export interface Gondola {
  id: string;
  type: GondolaType;
  name: string;
  x: number;
  y: number;
  width: number; // en metros
  depth: number; // en metros
  rotation: number; // 0-360 grados
  estantes?: Shelf[];
}

// Assignment types
export interface Assignment {
  id: string;
  productId: string;
  gondolaId: string;
  shelfId: string;
  spaceId: string;
  cantidad: number;
}

// Solver config types
export interface SolverConfig {
  marginWeight: number; // peso del margen de ganancia (0-1)
  salesWeight: number; // peso de las ventas (0-1)
  maxExecutionTime?: number; // tiempo máximo en segundos
  diversidadMinima: number; // diversidad mínima por estante (0-1, default: 0.7)
  maxFacingsPorProducto: number; // máximo de facings por producto (default: 3)
  minFacingsPorProducto: number; // mínimo de facings por producto si está asignado (default: 1)
}

// Solver result types
export interface SolverResult {
  assignments: Assignment[];
  totalGanancia: number;
  productosNoAsignados: string[];
  tiempoEjecucion: number;
  status: 'optimal' | 'feasible' | 'infeasible' | 'error';
  message?: string;
}

// Store types
export interface ProductsStore {
  products: Product[];
  loadProducts: (products: Product[]) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  clearProducts: () => void;
}

export interface GondolasStore {
  gondolas: Gondola[];
  selectedGondolaId: string | null;
  addGondola: (gondola: Gondola) => void;
  updateGondola: (id: string, data: Partial<Gondola>) => void;
  updateShelf: (gondolaId: string, shelfId: string, data: Partial<Shelf>) => void;
  updateShelfCount: (gondolaId: string, count: number) => void;
  applyGlobalShelfConfig: (gondolaId: string, config: Partial<Shelf>) => void;
  deleteGondola: (id: string) => void;
  selectGondola: (id: string | null) => void;
  clearGondolas: () => void;
}

export interface AssignmentsStore {
  assignments: Assignment[];
  assignProduct: (assignment: Assignment) => void;
  removeAssignment: (assignmentId: string) => void;
  clearAssignments: () => void;
  applyBulkAssignments: (assignments: Assignment[]) => void;
  getUnassignedProducts: (products: Product[]) => Product[];
}

export interface SolverConfigStore {
  config: SolverConfig;
  updateConfig: (config: Partial<SolverConfig>) => void;
}

export interface ViewModeStore {
  mode: 'design' | 'results';
  setMode: (mode: 'design' | 'results') => void;
  hasResults: boolean;
  setHasResults: (has: boolean) => void;
  selectedShelfId: string | null;
  setSelectedShelfId: (id: string | null) => void;
}

// Project types
export interface Project {
  id: string;
  nombre: string;
  fechaCreacion: string;
  fechaModificacion: string;
  cantidadGondolas: number;
  cantidadProductos: number;
  gondolas: Gondola[];
  products: Product[];
  assignments: Assignment[];
  solverConfig: SolverConfig;
}

export interface ProjectsStore {
  projects: Project[];
  activeProjectId: string | null;
  loadProjects: () => void;
  createProject: (nombre: string) => Project;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;
  getActiveProject: () => Project | null;
  syncActiveProject: () => void;
  exportProject: (id: string) => void;
  importProject: (project: Project, replaceIfExists: boolean) => void;
  checkProjectExists: (id: string) => boolean;
}