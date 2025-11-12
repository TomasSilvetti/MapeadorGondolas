import { Product } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Exporta productos a formato CSV
 */
export function exportProductsToCSV(products: Product[]): string {
  if (products.length === 0) {
    return 'id,nombre,precio,margen,ventas,categoria,subcategoria,stock\n';
  }

  const headers = ['id', 'nombre', 'precio', 'margen', 'ventas', 'categoria', 'subcategoria', 'stock'];
  const rows = products.map(product => [
    product.id,
    escapeCsvValue(product.nombre),
    product.precio.toString(),
    product.margen_ganancia.toString(),
    product.ventas.toString(),
    product.categoria.join(';'),
    (product.subcategoria || []).join(';'),
    product.stock.toString(),
  ]);

  const headerLine = headers.join(',');
  const dataLines = rows.map(row => row.join(','));

  return [headerLine, ...dataLines].join('\n');
}

/**
 * Descarga productos como archivo CSV
 */
export function downloadProductsCSV(products: Product[], filename: string = 'productos.csv'): void {
  const csv = exportProductsToCSV(products);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Importa productos desde un archivo CSV
 */
export async function importProductsFromCSV(file: File): Promise<{ products: Product[]; errors: string[] }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target?.result as string;
      const { products, errors } = parseProductsCSV(contents);
      resolve({ products, errors });
    };

    reader.onerror = () => {
      resolve({ products: [], errors: ['Error al leer el archivo'] });
    };

    reader.readAsText(file);
  });
}

/**
 * Parsea un string CSV y retorna productos
 */
export function parseProductsCSV(csvContent: string): { products: Product[]; errors: string[] } {
  const lines = csvContent.trim().split('\n');
  const products: Product[] = [];
  const errors: string[] = [];

  if (lines.length < 2) {
    errors.push('El archivo CSV está vacío');
    return { products, errors };
  }

  const headerLine = lines[0];
  const headers = headerLine.split(',').map(h => h.trim());

  // Validar que tenga las columnas mínimas
  const requiredHeaders = ['nombre', 'precio', 'ventas', 'categoria', 'stock'];
  const margenHeaders = ['margen', 'margen_ganancia'];
  const hasMarchenColumn = margenHeaders.some(h => headers.includes(h));
  
  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
  
  if (!hasMarchenColumn) {
    missingHeaders.push('margen (margen_ganancia)');
  }

  if (missingHeaders.length > 0) {
    errors.push(`Faltan columnas requeridas: ${missingHeaders.join(', ')}`);
    return { products, errors };
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Saltar líneas vacías

    try {
      const values = parseCSVLine(line);
      const product = parseProductRow(values, headers, i + 1);

      if (!product) continue;

      products.push(product);
    } catch (error) {
      errors.push(`Fila ${i + 1}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  return { products, errors };
}

/**
 * Parsea una línea CSV considerando campos entrecomillados
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
      current += char;
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Parsea una fila de CSV a un objeto Product
 */
function parseProductRow(values: string[], headers: string[], rowNumber: number): Product | null {
  const getColumnValue = (headerName: string): string => {
    const index = headers.indexOf(headerName);
    return index >= 0 ? values[index] || '' : '';
  };

  const nombre = unescapeCsvValue(getColumnValue('nombre')).trim();
  const precioStr = getColumnValue('precio').trim();
  // Intentar con 'margen' primero, luego con 'margen_ganancia'
  const margenStr = (getColumnValue('margen') || getColumnValue('margen_ganancia')).trim();
  const ventasStr = getColumnValue('ventas').trim();
  const categoriaStr = getColumnValue('categoria').trim();
  const subcategoriaStr = getColumnValue('subcategoria').trim();
  const stockStr = getColumnValue('stock').trim();
  const idValue = getColumnValue('id').trim();

  // Validaciones
  if (!nombre) {
    throw new Error('El nombre del producto es requerido');
  }

  const precio = parseFloat(precioStr);
  if (isNaN(precio) || precio < 0) {
    throw new Error(`Precio inválido: "${precioStr}"`);
  }

  const margen = parseFloat(margenStr);
  if (isNaN(margen) || margen < 0) {
    throw new Error(`Margen inválido: "${margenStr}"`);
  }

  const ventas = parseFloat(ventasStr);
  if (isNaN(ventas) || ventas < 0) {
    throw new Error(`Ventas inválidas: "${ventasStr}"`);
  }

  const stock = parseFloat(stockStr);
  if (isNaN(stock) || stock < 0) {
    throw new Error(`Stock inválido: "${stockStr}"`);
  }

  if (!categoriaStr) {
    throw new Error('La categoría es requerida');
  }

  const categorias = categoriaStr.split(';').map(c => c.trim()).filter(c => c);
  const subcategorias = subcategoriaStr
    ? subcategoriaStr.split(';').map(s => s.trim()).filter(s => s)
    : [];

  const product: Product = {
    id: idValue || uuidv4(),
    nombre,
    precio,
    margen_ganancia: margen,
    ventas,
    categoria: categorias,
    subcategoria: subcategorias.length > 0 ? subcategorias : undefined,
    stock,
  };

  return product;
}

/**
 * Escapa valores CSV entrecomillados si contienen comas
 */
function escapeCsvValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Des-escapa valores CSV entrecomillados
 */
function unescapeCsvValue(value: string): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/""/g, '"');
  }
  return value;
}

/**
 * Valida el formato de un CSV de productos
 */
export function validateProductsCSV(csvContent: string): { isValid: boolean; errors: string[] } {
  const { errors } = parseProductsCSV(csvContent);
  return {
    isValid: errors.length === 0,
    errors,
  };
}

