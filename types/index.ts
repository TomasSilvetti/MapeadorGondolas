// Product types
export type Category = 'Bebidas' | 'Panadería' | 'Lácteos' | 'Carnes' | 'Verduras' | 'Frutas' | 'Otros';

export interface Product {
  id: string;
  nombre: string;
  precio: number;
  margen_ganancia: number;
  popularidad: number; // 0-100
  categoria: Category;
  stock: number;
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
}

export interface Gondola {
  id: string;
  type: GondolaType;
  name: string;
  x: number;
  y: number;
  width: number; // en pies
  depth: number; // en pies
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
  popularityWeight: number; // peso de la popularidad (0-1)
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
  deleteGondola: (id: string) => void;
  selectGondola: (id: string | null) => void;
  clearGondolas: () => void;
}

export interface AssignmentsStore {
  assignments: Assignment[];
  assignProduct: (assignment: Assignment) => void;
  removeAssignment: (assignmentId: string) => void;
  clearAssignments: () => void;
}

export interface SolverConfigStore {
  config: SolverConfig;
  updateConfig: (config: Partial<SolverConfig>) => void;
}
