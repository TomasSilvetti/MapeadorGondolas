'use client';

import Papa from 'papaparse';
import { Product, Category } from '@/types';

export interface CSVRow {
  id?: string;
  nombre?: string;
  precio?: string;
  margen_ganancia?: string;
  ventas?: string; // número de unidades vendidas del último mes
  popularidad?: string; // DEPRECATED: usar 'ventas' (mantenido para compatibilidad)
  rotacion_promedio?: string; // DEPRECATED: alternativa antigua
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
                  
                  // Prioridad: ventas > popularidad > rotacion_promedio (compatibilidad con CSVs antiguos)
                  let ventas = parseFloat(row.ventas || '0');
                  if (ventas === 0 && (row.popularidad || row.rotacion_promedio)) {
                    // Convertir popularidad (0-100) a ventas estimadas
                    const popularidad = parseFloat(row.rotacion_promedio || row.popularidad || '0');
                    ventas = popularidad; // Usar popularidad como ventas si no hay columna 'ventas'
                  }
                  
                  const stock = parseInt(row.stock || '0', 10);

                  return {
                    id: row.id || '',
                    nombre: row.nombre || '',
                    precio,
                    margen_ganancia: margen,
                    ventas,
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
    product.ventas >= 0 &&
    product.stock >= 0
  );
};
