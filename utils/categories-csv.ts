import Papa from 'papaparse';
import { CategoryDefinition, SubcategoryDefinition } from '@/types';

export interface CategoryCSVRow {
  categoria?: string;
  subcategoria?: string;
}

export interface ImportResult {
  success: boolean;
  categories: CategoryDefinition[];
  subcategories: SubcategoryDefinition[];
  errors: string[];
}

/**
 * Exporta categorías y subcategorías a un archivo CSV
 */
export const exportCategoriesToCSV = (
  categories: CategoryDefinition[],
  subcategories: SubcategoryDefinition[]
): void => {
  const rows: CategoryCSVRow[] = [];

  // Agregar categorías con sus subcategorías
  categories.forEach((category) => {
    const categorySubs = subcategories.filter(
      (sub) => sub.categoriaId === category.id
    );

    if (categorySubs.length > 0) {
      // Si tiene subcategorías, agregar una fila por cada una
      categorySubs.forEach((sub) => {
        rows.push({
          categoria: category.nombre,
          subcategoria: sub.nombre,
        });
      });
    } else {
      // Si no tiene subcategorías, agregar solo la categoría
      rows.push({
        categoria: category.nombre,
        subcategoria: '',
      });
    }
  });

  // Convertir a CSV
  const csv = Papa.unparse(rows, {
    header: true,
    columns: ['categoria', 'subcategoria'],
  });

  // Crear y descargar el archivo
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `categorias-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Importa categorías y subcategorías desde un archivo CSV
 */
export const importCategoriesFromCSV = (file: File): Promise<ImportResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (Papa as any).parse(csv, {
          header: true,
          dynamicTyping: false,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<CategoryCSVRow>) => {
            const errors: string[] = [];
            const categoryMap = new Map<string, CategoryDefinition>();
            const subcategoryList: SubcategoryDefinition[] = [];

            // Procesar cada fila
            results.data.forEach((row, index) => {
              const lineNum = index + 2; // +2 porque index empieza en 0 y hay header

              // Validar que tenga al menos categoría
              if (!row.categoria || row.categoria.trim() === '') {
                errors.push(`Línea ${lineNum}: La categoría es obligatoria`);
                return;
              }

              const categoryName = row.categoria.trim();
              const subcategoryName = row.subcategoria?.trim() || '';

              // Crear o actualizar categoría
              if (!categoryMap.has(categoryName)) {
                categoryMap.set(categoryName, {
                  id: crypto.randomUUID(),
                  nombre: categoryName,
                  subcategorias: [],
                });
              }

              // Si hay subcategoría, agregarla
              if (subcategoryName) {
                const category = categoryMap.get(categoryName)!;
                
                // Verificar que no exista ya esta subcategoría en esta categoría
                const existingSubcategory = subcategoryList.find(
                  (sub) =>
                    sub.categoriaId === category.id &&
                    sub.nombre.toLowerCase() === subcategoryName.toLowerCase()
                );

                if (!existingSubcategory) {
                  const newSubcategory: SubcategoryDefinition = {
                    id: crypto.randomUUID(),
                    nombre: subcategoryName,
                    categoriaId: category.id,
                  };
                  
                  subcategoryList.push(newSubcategory);
                  category.subcategorias.push(newSubcategory.id);
                }
              }
            });

            const categories = Array.from(categoryMap.values());

            resolve({
              success: errors.length === 0,
              categories,
              subcategories: subcategoryList,
              errors,
            });
          },
          error: (error: Papa.ParseError) => {
            resolve({
              success: false,
              categories: [],
              subcategories: [],
              errors: [`Error al parsear CSV: ${error.message}`],
            });
          },
        });
      } catch (error) {
        resolve({
          success: false,
          categories: [],
          subcategories: [],
          errors: [`Error al leer el archivo: ${error}`],
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        categories: [],
        subcategories: [],
        errors: ['Error al leer el archivo'],
      });
    };

    reader.readAsText(file);
  });
};

/**
 * Valida el formato de un archivo CSV de categorías
 */
export const validateCategoriesCSV = (file: File): Promise<{ valid: boolean; error?: string }> => {
  return new Promise((resolve) => {
    // Verificar extensión
    if (!file.name.endsWith('.csv')) {
      resolve({ valid: false, error: 'El archivo debe tener extensión .csv' });
      return;
    }

    // Verificar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      resolve({ valid: false, error: 'El archivo es demasiado grande (máximo 5MB)' });
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (Papa as any).parse(csv, {
          header: true,
          preview: 1, // Solo leer la primera fila para validar headers
          complete: (results: Papa.ParseResult<CategoryCSVRow>) => {
            const headers = results.meta.fields || [];
            
            // Verificar que tenga al menos la columna 'categoria'
            if (!headers.includes('categoria')) {
              resolve({
                valid: false,
                error: 'El archivo debe tener una columna "categoria"',
              });
              return;
            }

            resolve({ valid: true });
          },
          error: (error: Papa.ParseError) => {
            resolve({
              valid: false,
              error: `Error al validar CSV: ${error.message}`,
            });
          },
        });
      } catch (error) {
        resolve({
          valid: false,
          error: `Error al leer el archivo: ${error}`,
        });
      }
    };

    reader.onerror = () => {
      resolve({
        valid: false,
        error: 'Error al leer el archivo',
      });
    };

    reader.readAsText(file);
  });
};

