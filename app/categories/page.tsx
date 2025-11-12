'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCategoriesStore } from '@/stores/categories';
import { useProductsStore } from '@/stores/products';
import { useGondolasStore } from '@/stores/gondolas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Download,
  Upload,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
  FolderTree,
  AlertCircle,
  Save,
  X,
} from 'lucide-react';
import {
  exportCategoriesToCSV,
  importCategoriesFromCSV,
  validateCategoriesCSV,
} from '@/utils/categories-csv';

export default function CategoriesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stores
  const {
    categories,
    subcategories,
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getSubcategoriesByCategory,
    isCategoryInUse,
    isSubcategoryInUse,
  } = useCategoriesStore();

  const products = useProductsStore((state) => state.products);
  const gondolas = useGondolasStore((state) => state.gondolas);

  // Estados locales
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  
  // Formularios
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState('');
  
  // Estados de UI
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Auto-expandir todas las categorías al cargar
  useEffect(() => {
    if (categories.length > 0 && expandedCategories.size === 0) {
      setExpandedCategories(new Set(categories.map((cat) => cat.id)));
    }
  }, [categories]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      setError('El nombre de la categoría no puede estar vacío');
      return;
    }

    try {
      const newCat = addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setSuccess(`Categoría "${newCat.nombre}" agregada exitosamente`);
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar categoría');
    }
  };

  const handleAddSubcategory = () => {
    if (!newSubcategoryName.trim()) {
      setError('El nombre de la subcategoría no puede estar vacío');
      return;
    }

    if (!selectedCategoryForSubcategory) {
      setError('Debe seleccionar una categoría');
      return;
    }

    try {
      const newSub = addSubcategory(newSubcategoryName.trim(), selectedCategoryForSubcategory);
      setNewSubcategoryName('');
      setSuccess(`Subcategoría "${newSub.nombre}" agregada exitosamente`);
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
      
      // Expandir la categoría padre
      setExpandedCategories(new Set([...expandedCategories, selectedCategoryForSubcategory]));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar subcategoría');
    }
  };

  const startEditCategory = (categoryId: string, currentName: string) => {
    setEditingCategoryId(categoryId);
    setEditValue(currentName);
    setEditingSubcategoryId(null);
  };

  const startEditSubcategory = (subcategoryId: string, currentName: string) => {
    setEditingSubcategoryId(subcategoryId);
    setEditValue(currentName);
    setEditingCategoryId(null);
  };

  const saveEditCategory = () => {
    if (!editingCategoryId || !editValue.trim()) return;

    try {
      updateCategory(editingCategoryId, editValue.trim());
      setEditingCategoryId(null);
      setEditValue('');
      setSuccess('Categoría actualizada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar categoría');
    }
  };

  const saveEditSubcategory = () => {
    if (!editingSubcategoryId || !editValue.trim()) return;

    try {
      updateSubcategory(editingSubcategoryId, editValue.trim());
      setEditingSubcategoryId(null);
      setEditValue('');
      setSuccess('Subcategoría actualizada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar subcategoría');
    }
  };

  const cancelEdit = () => {
    setEditingCategoryId(null);
    setEditingSubcategoryId(null);
    setEditValue('');
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    const inUse = isCategoryInUse(categoryName, products, gondolas);
    
    if (inUse) {
      setError(
        `No se puede eliminar la categoría "${categoryName}" porque está en uso por productos o restricciones de góndolas`
      );
      return;
    }

    if (!confirm(`¿Está seguro de eliminar la categoría "${categoryName}" y todas sus subcategorías?`)) {
      return;
    }

    try {
      deleteCategory(categoryId);
      setSuccess(`Categoría "${categoryName}" eliminada exitosamente`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar categoría');
    }
  };

  const handleDeleteSubcategory = (subcategoryId: string, subcategoryName: string) => {
    const inUse = isSubcategoryInUse(subcategoryName, products);
    
    if (inUse) {
      setError(
        `No se puede eliminar la subcategoría "${subcategoryName}" porque está en uso por productos`
      );
      return;
    }

    if (!confirm(`¿Está seguro de eliminar la subcategoría "${subcategoryName}"?`)) {
      return;
    }

    try {
      deleteSubcategory(subcategoryId);
      setSuccess(`Subcategoría "${subcategoryName}" eliminada exitosamente`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar subcategoría');
    }
  };

  const handleExport = () => {
    try {
      exportCategoriesToCSV(categories, subcategories);
      setSuccess('Categorías exportadas exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error al exportar categorías');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportErrors([]);
    setError(null);

    // Validar archivo
    const validation = await validateCategoriesCSV(file);
    if (!validation.valid) {
      setError(validation.error || 'Archivo inválido');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Importar
    const result = await importCategoriesFromCSV(file);
    
    if (!result.success) {
      setImportErrors(result.errors);
      setError('Error al importar categorías. Revise los errores abajo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Agregar las categorías y subcategorías importadas
    try {
      result.categories.forEach((cat) => {
        try {
          const existingCat = categories.find(
            (c) => c.nombre.toLowerCase() === cat.nombre.toLowerCase()
          );
          
          if (!existingCat) {
            addCategory(cat.nombre);
          }
        } catch (err) {
          // Ignorar si ya existe
        }
      });

      // Agregar subcategorías
      result.subcategories.forEach((sub) => {
        const category = categories.find(
          (c) => c.nombre.toLowerCase() === result.categories.find((rc) => rc.id === sub.categoriaId)?.nombre.toLowerCase()
        );
        
        if (category) {
          try {
            addSubcategory(sub.nombre, category.id);
          } catch (err) {
            // Ignorar si ya existe
          }
        }
      });

      setSuccess(
        `Importación completada: ${result.categories.length} categorías, ${result.subcategories.length} subcategorías`
      );
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error al procesar las categorías importadas');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getProductCountByCategory = (categoryName: string) => {
    return products.filter((p) => p.categoria === categoryName).length;
  };

  const getProductCountBySubcategory = (subcategoryName: string) => {
    return products.filter((p) => p.subcategoria === subcategoryName).length;
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
              <h1 className="text-2xl font-bold text-slate-100">Gestión de Categorías</h1>
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
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
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
            <div className="flex-1">
              <p className="text-red-300 text-sm">{error}</p>
              {importErrors.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {importErrors.map((err, idx) => (
                    <li key={idx} className="text-red-400 text-xs">
                      • {err}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-900/20 border border-green-700/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-300 text-sm flex-1">{success}</p>
            <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content - 3 Panel Layout */}
      <div className="max-w-[1800px] mx-auto px-6 pb-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Panel Izquierdo - Vista de Árbol */}
          <div className="col-span-3">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FolderTree className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-slate-100">Vista de Árbol</h2>
              </div>

              <div className="space-y-1">
                {categories.length === 0 ? (
                  <p className="text-slate-400 text-sm py-4 text-center">
                    No hay categorías aún
                  </p>
                ) : (
                  categories.map((category) => {
                    const subs = getSubcategoriesByCategory(category.id);
                    const isExpanded = expandedCategories.has(category.id);
                    const productCount = getProductCountByCategory(category.nombre);

                    return (
                      <div key={category.id}>
                        {/* Categoría */}
                        <div
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                            selectedCategoryId === category.id
                              ? 'bg-blue-600/20 text-blue-300'
                              : 'hover:bg-slate-700 text-slate-300'
                          }`}
                          onClick={() => {
                            setSelectedCategoryId(category.id);
                            setSelectedSubcategoryId(null);
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategory(category.id);
                            }}
                            className="hover:bg-slate-600 rounded p-0.5"
                          >
                            {subs.length > 0 ? (
                              isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )
                            ) : (
                              <div className="w-4 h-4" />
                            )}
                          </button>
                          <span className="flex-1 text-sm font-medium">{category.nombre}</span>
                          {productCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {productCount}
                            </Badge>
                          )}
                        </div>

                        {/* Subcategorías */}
                        {isExpanded && subs.length > 0 && (
                          <div className="ml-6 mt-1 space-y-1">
                            {subs.map((sub) => {
                              const subProductCount = getProductCountBySubcategory(sub.nombre);
                              
                              return (
                                <div
                                  key={sub.id}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                    selectedSubcategoryId === sub.id
                                      ? 'bg-blue-600/20 text-blue-300'
                                      : 'hover:bg-slate-700 text-slate-400'
                                  }`}
                                  onClick={() => {
                                    setSelectedSubcategoryId(sub.id);
                                    setSelectedCategoryId(null);
                                  }}
                                >
                                  <span className="flex-1 text-sm">{sub.nombre}</span>
                                  {subProductCount > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      {subProductCount}
                                    </Badge>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Panel Central - Lista de Gestión */}
          <div className="col-span-5">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">
                Categorías y Subcategorías
              </h2>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {categories.map((category) => {
                  const subs = getSubcategoriesByCategory(category.id);
                  const isEditing = editingCategoryId === category.id;

                  return (
                    <div key={category.id} className="border border-slate-600 rounded-lg p-4">
                      {/* Categoría */}
                      <div className="flex items-center gap-3 mb-2">
                        {isEditing ? (
                          <>
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 bg-slate-700 border-slate-600"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditCategory();
                                if (e.key === 'Escape') cancelEdit();
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={saveEditCategory}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              className="border-slate-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-slate-100 font-medium">
                              {category.nombre}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditCategory(category.id, category.nombre)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteCategory(category.id, category.nombre)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Subcategorías */}
                      {subs.length > 0 && (
                        <div className="ml-4 mt-2 space-y-2 border-l-2 border-slate-600 pl-4">
                          {subs.map((sub) => {
                            const isEditingSub = editingSubcategoryId === sub.id;

                            return (
                              <div key={sub.id} className="flex items-center gap-3">
                                {isEditingSub ? (
                                  <>
                                    <Input
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="flex-1 bg-slate-700 border-slate-600 text-sm"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveEditSubcategory();
                                        if (e.key === 'Escape') cancelEdit();
                                      }}
                                    />
                                    <Button
                                      size="sm"
                                      onClick={saveEditSubcategory}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Save className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={cancelEdit}
                                      className="border-slate-600"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <span className="flex-1 text-slate-300 text-sm">
                                      {sub.nombre}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => startEditSubcategory(sub.id, sub.nombre)}
                                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 h-7 w-7 p-0"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteSubcategory(sub.id, sub.nombre)}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-7 w-7 p-0"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Panel Derecho - Formularios */}
          <div className="col-span-4">
            <div className="space-y-6">
              {/* Agregar Categoría */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  Agregar Categoría
                </h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Nombre de la categoría"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCategory();
                    }}
                    className="bg-slate-700 border-slate-600"
                  />
                  <Button
                    onClick={handleAddCategory}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Categoría
                  </Button>
                </div>
              </div>

              {/* Agregar Subcategoría */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  Agregar Subcategoría
                </h3>
                <div className="space-y-3">
                  <select
                    value={selectedCategoryForSubcategory}
                    onChange={(e) => setSelectedCategoryForSubcategory(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder="Nombre de la subcategoría"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSubcategory();
                    }}
                    className="bg-slate-700 border-slate-600"
                    disabled={!selectedCategoryForSubcategory}
                  />
                  <Button
                    onClick={handleAddSubcategory}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedCategoryForSubcategory}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Subcategoría
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-sm font-semibold text-slate-100 mb-3">
                  Información
                </h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>• Total de categorías: {categories.length}</p>
                  <p>• Total de subcategorías: {subcategories.length}</p>
                  <p>• Total de productos: {products.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

