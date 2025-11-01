import { create } from 'zustand';
import { Product, ProductsStore } from '@/types';

export const useProductsStore = create<ProductsStore>((set) => ({
  products: [],
  
  loadProducts: (products: Product[]) =>
    set({ products }),
  
  updateProduct: (id: string, data: Partial<Product>) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    })),
  
  clearProducts: () =>
    set({ products: [] }),
}));
