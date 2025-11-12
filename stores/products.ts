import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, ProductsStore, Assignment } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      products: [],
      
      loadProducts: (products: Product[]) =>
        set({ products }),
      
      addProduct: (product: Product) =>
        set((state) => {
          // Verificar que el producto no exista
          if (state.products.some(p => p.id === product.id)) {
            console.warn('Producto con ID duplicado:', product.id);
            return state;
          }
          return {
            products: [...state.products, product],
          };
        }),
      
      updateProduct: (id: string, data: Partial<Product>) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
      
      deleteProduct: (id: string) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      
      getProductById: (id: string) => {
        const state = get();
        return state.products.find((p) => p.id === id);
      },
      
      isProductInUse: (productId: string, assignments: Assignment[]) => {
        return assignments.some((a) => a.productId === productId);
      },
      
      clearProducts: () =>
        set({ products: [] }),
    }),
    {
      name: 'products-store',
    }
  )
);
