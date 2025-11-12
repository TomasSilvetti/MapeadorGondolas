'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProductsStore } from '@/stores/products';
import { useAssignmentsStore } from '@/stores/assignments';
import { useCategoriesStore } from '@/stores/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProductModal } from '@/components/custom/ProductModal';
import {
  Home,
  Download,
  Upload,
  Plus,
  Edit2,
  Trash2,
  Search,
  AlertCircle,
  X,
  Package,
} from 'lucide-react';
import {
  exportProductsToCSV,
  downloadProductsCSV,
  importProductsFromCSV,
} from '@/utils/products-csv';
import { Product } from '@/types';

export default function ProductsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stores
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductsStore();
  const assignments = useAssignmentsStore((state) => state.assignments);
  const { categories: categoryDefinitions, loadCategories } = useCategoriesStore();

  // Estados locales
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cargar categorías disponibles
  const availableCategories = categoryDefinitions.map((cat) => cat.nombre);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nombre
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      (product.categoria && product.categoria.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  // Verificar si un producto está en uso
  const isProductInUse = (productId: string): boolean => {
    return assignments.some((a) => a.productId === productId);
  };

  // Obtener nombres existentes para validación
  const existingProductNames = products.map((p) => p.nombre);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (product: Product) => {
    try {
      if (editingProduct) {
        updateProduct(product.id, product);
        setSuccess('Producto actualizado exitosamente');
      } else {
        addProduct(product);
        setSuccess('Producto agregado exitosamente');
      }
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar producto');
    }
  };

  const handleDeleteProduct = (product: Product) => {
    if (isProductInUse(product.id)) {
      setError(
        `No se puede eliminar el producto "${product.nombre}" porque está asignado en góndolas`
      );
      return;
    }

    if (
      !confirm(
        `¿Está seguro de eliminar el producto "${product.nombre}"?`
      )
    ) {
      return;
    }

    try {
      deleteProduct(product.id);
      setSuccess(`Producto "${product.nombre}" eliminado exitosamente`);
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar producto');
    }
  };

  const handleExport = () => {
    try {
      downloadProductsCSV(products, 'productos.csv');
      setSuccess('Productos exportados exitosamente');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error al exportar productos');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    try {
      const result = await importProductsFromCSV(file);

      if (result.errors.length > 0) {
        setError(
          `Importación completada con ${result.errors.length} errores. Verifique los datos.`
        );
      }

      // Agregar productos válidos
      let addedCount = 0;
      result.products.forEach((product) => {
        try {
          // Verificar que la categoría existe
          const validCategories = product.categoria.filter((cat) =>
            availableCategories.includes(cat)
          );

          if (validCategories.length === 0) {
            throw new Error(
              `Ninguna de las categorías existe: ${product.categoria.join(', ')}`
            );
          }

          // Usar solo categorías válidas
          const updatedProduct = {
            ...product,
            categoria: validCategories,
          };

          addProduct(updatedProduct);
          addedCount++;
        } catch (err) {
          console.error('Error al agregar producto:', err);
        }
      });

      if (addedCount > 0) {
        setSuccess(`${addedCount} productos importados exitosamente`);
        setTimeout(() => setSuccess(null), 3000);
      } else if (result.errors.length === 0) {
        setError('No se importaron productos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al importar productos');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/')}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <Home className="w-4 h-4 mr-2" />
                Inicio
              </Button>
              <div className="w-px h-6 bg-slate-700" />
              <h1 className="text-2xl font-bold text-slate-100">Gestión de Productos</h1>
            </div>
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar CSV
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                disabled={products.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <Button
                onClick={handleAddProduct}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mensajes */}
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        {error && (
          <div className="mb-4 bg-red-900/20 border border-red-700/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-900/20 border border-green-700/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-300 text-sm flex-1">{success}</p>
            <button
              onClick={() => setSuccess(null)}
              className="text-green-400 hover:text-green-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content - 2 Panel Layout */}
      <div className="max-w-[1800px] mx-auto px-6 pb-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Panel Izquierdo - Filtros */}
          <div className="col-span-3">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Filtros</h2>

              {/* Búsqueda */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-100 mb-2">
                  Buscar por nombre
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <Input
                    placeholder="Ej: Refresco"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-700 border-slate-600"
                  />
                </div>
              </div>

              {/* Filtro por categoría */}
              <div>
                <label className="block text-sm font-medium text-slate-100 mb-2">
                  Filtrar por categoría
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
                >
                  <option value="">Todas las categorías</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estadísticas */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-slate-100 mb-3">
                  Estadísticas
                </h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>• Total de productos: {products.length}</p>
                  <p>• Productos filtrados: {filteredProducts.length}</p>
                  <p>• Productos en uso: {products.filter((p) => isProductInUse(p.id)).length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Tabla de Productos */}
          <div className="col-span-9">
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              {/* Header de tabla */}
              <div className="bg-slate-700/50 border-b border-slate-700 px-6 py-3">
                <h2 className="text-lg font-semibold text-slate-100">Productos</h2>
              </div>

              {/* Tabla */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-700/30 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-slate-300 font-medium">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-slate-300 font-medium">
                        Categorías
                      </th>
                      <th className="px-6 py-3 text-right text-slate-300 font-medium">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-right text-slate-300 font-medium">
                        Margen
                      </th>
                      <th className="px-6 py-3 text-right text-slate-300 font-medium">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-center text-slate-300 font-medium">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Package className="w-10 h-10 text-slate-600 mb-2" />
                            <p className="text-slate-400">No hay productos</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-6 py-3 text-slate-100 font-medium">
                            {product.nombre}
                            {isProductInUse(product.id) && (
                              <Badge className="ml-2 bg-orange-600/30 text-orange-300 border-orange-600">
                                En uso
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex gap-1 flex-wrap">
                              {product.categoria.map((cat) => (
                                <Badge
                                  key={cat}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-3 text-right text-slate-100">
                            ${product.precio.toFixed(2)}
                          </td>
                          <td className="px-6 py-3 text-right text-slate-100">
                            {product.margen_ganancia}%
                          </td>
                          <td className="px-6 py-3 text-right text-slate-100">
                            {product.stock}
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteProduct(product)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                disabled={isProductInUse(product.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveProduct}
        product={editingProduct || undefined}
        categories={availableCategories}
        existingProductNames={existingProductNames}
      />
    </div>
  );
}

