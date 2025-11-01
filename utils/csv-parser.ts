'use client';

import Papa from 'papaparse';
import { Product, Category } from '@/types';

export interface CSVRow {
  id?: string;
  nombre?: string;
  precio?: string;
  margen_ganancia?: string;
  popularidad?: string;
  categoria?: string;
  stock?: string;
}

export const parseCSV = (file: File | Blob): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (Papa as any).parse(csv, {
          header: true,
          dynamicTyping: false,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<CSVRow>) => {
            try {
              const products: Product[] = results.data
                .filter((row) => row && row.id && row.nombre) // Skip empty rows
                .map((row) => {
                  const precio = parseFloat(row.precio || '0');
                  const margen = parseFloat(row.margen_ganancia || '0');
                  const popularidad = parseFloat(row.popularidad || '0');
                  const stock = parseInt(row.stock || '0', 10);

                  return {
                    id: row.id || '',
                    nombre: row.nombre || '',
                    precio,
                    margen_ganancia: margen,
                    popularidad,
                    categoria: (row.categoria as Category) || 'Otros',
                    stock,
                  };
                });

              resolve(products);
            } catch (error) {
              reject(error);
            }
          },
          error: (error: Papa.ParseError) => {
            reject(new Error(`CSV parsing error: ${error.message}`));
          },
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

export const validateProduct = (product: Product): boolean => {
  return (
    product.id !== '' &&
    product.nombre !== '' &&
    product.precio > 0 &&
    product.margen_ganancia >= 0 &&
    product.margen_ganancia <= 1 &&
    product.popularidad >= 0 &&
    product.popularidad <= 100 &&
    product.stock >= 0
  );
};
