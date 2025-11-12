import { create } from 'zustand';
import { CategoryDefinition, SubcategoryDefinition, CategoriesStore, Product, Gondola } from '@/types';

const STORAGE_KEY = 'mapeador-gondolas-categories';

// Categorías por defecto del sistema
const DEFAULT_CATEGORIES = [
  'Bebidas',
  'Panadería',
  'Lácteos',
  'Carnes',
  'Verduras',
  'Frutas',
  'Otros',
];

// Cargar categorías desde localStorage
const loadFromStorage = (): { categories: CategoryDefinition[]; subcategories: SubcategoryDefinition[] } => {
  if (typeof window === 'undefined') {
    return { categories: [], subcategories: [] };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading categories from storage:', error);
  }
  
  // Si no hay datos guardados, inicializar con categorías por defecto
  const defaultCategories: CategoryDefinition[] = DEFAULT_CATEGORIES.map((nombre) => ({
    id: crypto.randomUUID(),
    nombre,
    subcategorias: [],
  }));
  
  return { categories: defaultCategories, subcategories: [] };
};

// Guardar categorías en localStorage
const saveToStorage = (categories: CategoryDefinition[], subcategories: SubcategoryDefinition[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ categories, subcategories }));
  } catch (error) {
    console.error('Error saving categories to storage:', error);
  }
};

export const useCategoriesStore = create<CategoriesStore>((set, get) => ({
  categories: [],
  subcategories: [],

  loadCategories: () => {
    const { categories, subcategories } = loadFromStorage();
    set({ categories, subcategories });
  },

  addCategory: (nombre: string) => {
    const state = get();
    
    // Verificar si ya existe
    const exists = state.categories.some(
      (cat) => cat.nombre.toLowerCase() === nombre.toLowerCase()
    );
    
    if (exists) {
      throw new Error(`La categoría "${nombre}" ya existe`);
    }
    
    const newCategory: CategoryDefinition = {
      id: crypto.randomUUID(),
      nombre,
      subcategorias: [],
    };
    
    const newCategories = [...state.categories, newCategory];
    saveToStorage(newCategories, state.subcategories);
    set({ categories: newCategories });
    
    return newCategory;
  },

  updateCategory: (id: string, nombre: string) => {
    const state = get();
    
    // Verificar si el nuevo nombre ya existe en otra categoría
    const exists = state.categories.some(
      (cat) => cat.id !== id && cat.nombre.toLowerCase() === nombre.toLowerCase()
    );
    
    if (exists) {
      throw new Error(`La categoría "${nombre}" ya existe`);
    }
    
    const newCategories = state.categories.map((cat) =>
      cat.id === id ? { ...cat, nombre } : cat
    );
    
    saveToStorage(newCategories, state.subcategories);
    set({ categories: newCategories });
  },

  deleteCategory: (id: string) => {
    const state = get();
    const category = state.categories.find((cat) => cat.id === id);
    
    if (!category) {
      throw new Error('Categoría no encontrada');
    }
    
    // Eliminar subcategorías asociadas
    const newSubcategories = state.subcategories.filter(
      (sub) => sub.categoriaId !== id
    );
    
    const newCategories = state.categories.filter((cat) => cat.id !== id);
    
    saveToStorage(newCategories, newSubcategories);
    set({ categories: newCategories, subcategories: newSubcategories });
  },

  addSubcategory: (nombre: string, categoriaId: string) => {
    const state = get();
    const category = state.categories.find((cat) => cat.id === categoriaId);
    
    if (!category) {
      throw new Error('Categoría no encontrada');
    }
    
    // Verificar si ya existe en esta categoría
    const exists = state.subcategories.some(
      (sub) =>
        sub.categoriaId === categoriaId &&
        sub.nombre.toLowerCase() === nombre.toLowerCase()
    );
    
    if (exists) {
      throw new Error(`La subcategoría "${nombre}" ya existe en esta categoría`);
    }
    
    const newSubcategory: SubcategoryDefinition = {
      id: crypto.randomUUID(),
      nombre,
      categoriaId,
    };
    
    const newSubcategories = [...state.subcategories, newSubcategory];
    
    // Actualizar la categoría para incluir el ID de la subcategoría
    const newCategories = state.categories.map((cat) =>
      cat.id === categoriaId
        ? { ...cat, subcategorias: [...cat.subcategorias, newSubcategory.id] }
        : cat
    );
    
    saveToStorage(newCategories, newSubcategories);
    set({ categories: newCategories, subcategories: newSubcategories });
    
    return newSubcategory;
  },

  updateSubcategory: (id: string, nombre: string) => {
    const state = get();
    const subcategory = state.subcategories.find((sub) => sub.id === id);
    
    if (!subcategory) {
      throw new Error('Subcategoría no encontrada');
    }
    
    // Verificar si el nuevo nombre ya existe en la misma categoría
    const exists = state.subcategories.some(
      (sub) =>
        sub.id !== id &&
        sub.categoriaId === subcategory.categoriaId &&
        sub.nombre.toLowerCase() === nombre.toLowerCase()
    );
    
    if (exists) {
      throw new Error(`La subcategoría "${nombre}" ya existe en esta categoría`);
    }
    
    const newSubcategories = state.subcategories.map((sub) =>
      sub.id === id ? { ...sub, nombre } : sub
    );
    
    saveToStorage(state.categories, newSubcategories);
    set({ subcategories: newSubcategories });
  },

  deleteSubcategory: (id: string) => {
    const state = get();
    const subcategory = state.subcategories.find((sub) => sub.id === id);
    
    if (!subcategory) {
      throw new Error('Subcategoría no encontrada');
    }
    
    const newSubcategories = state.subcategories.filter((sub) => sub.id !== id);
    
    // Actualizar la categoría para remover el ID de la subcategoría
    const newCategories = state.categories.map((cat) =>
      cat.id === subcategory.categoriaId
        ? { ...cat, subcategorias: cat.subcategorias.filter((subId) => subId !== id) }
        : cat
    );
    
    saveToStorage(newCategories, newSubcategories);
    set({ categories: newCategories, subcategories: newSubcategories });
  },

  getCategoryById: (id: string) => {
    return get().categories.find((cat) => cat.id === id);
  },

  getSubcategoryById: (id: string) => {
    return get().subcategories.find((sub) => sub.id === id);
  },

  getSubcategoriesByCategory: (categoriaId: string) => {
    return get().subcategories.filter((sub) => sub.categoriaId === categoriaId);
  },

  getAllCategoryNames: () => {
    return get().categories.map((cat) => cat.nombre);
  },

  isCategoryInUse: (categoryName: string, products: Product[], gondolas: Gondola[]) => {
    // Verificar si algún producto usa esta categoría
    const usedInProducts = products.some(
      (product) => product.categoria === categoryName
    );
    
    if (usedInProducts) return true;
    
    // Verificar si alguna góndola tiene restricciones con esta categoría
    const usedInGondolas = gondolas.some((gondola) =>
      gondola.estantes?.some((estante) =>
        estante.categoriasRestringidas.includes(categoryName)
      )
    );
    
    return usedInGondolas;
  },

  isSubcategoryInUse: (subcategoryName: string, products: Product[]) => {
    return products.some((product) => product.subcategoria === subcategoryName);
  },
}));

