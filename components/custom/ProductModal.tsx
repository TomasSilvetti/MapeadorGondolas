'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Product) => void;
  product?: Product;
  categories: string[];
  existingProductNames: string[];
}

export function ProductModal({
  open,
  onOpenChange,
  onSave,
  product,
  categories,
  existingProductNames,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    id: '',
    nombre: '',
    precio: 0,
    margen_ganancia: 0,
    ventas: 0,
    categoria: [],
    subcategoria: [],
    stock: 0,
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
      setSelectedCategories(product.categoria || []);
      setSelectedSubcategories(product.subcategoria || []);
    } else {
      setFormData({
        id: uuidv4(),
        nombre: '',
        precio: 0,
        margen_ganancia: 0,
        ventas: 0,
        categoria: [],
        subcategoria: [],
        stock: 0,
      });
      setSelectedCategories([]);
      setSelectedSubcategories([]);
    }
    setErrors({});
  }, [product, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (
      existingProductNames.includes(formData.nombre) &&
      (!product || product.nombre !== formData.nombre)
    ) {
      newErrors.nombre = 'Ya existe un producto con este nombre';
    }

    if (formData.precio < 0) {
      newErrors.precio = 'El precio no puede ser negativo';
    }

    if (formData.margen_ganancia < 0) {
      newErrors.margen = 'El margen no puede ser negativo';
    }

    if (formData.ventas < 0) {
      newErrors.ventas = 'Las ventas no pueden ser negativas';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    if (selectedCategories.length === 0) {
      newErrors.categoria = 'Debe seleccionar al menos una categoría';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedProduct: Product = {
      ...formData,
      categoria: selectedCategories,
      subcategoria: selectedSubcategories.length > 0 ? selectedSubcategories : undefined,
    };

    onSave(updatedProduct);
    onOpenChange(false);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-slate-100 mb-2">
              Nombre del Producto *
            </label>
            <Input
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Refresco Cola 2L"
              className="bg-slate-700 border-slate-600"
            />
            {errors.nombre && (
              <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          {/* Precio y Margen */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-100 mb-2">
                Precio *
              </label>
              <Input
                type="number"
                value={formData.precio}
                onChange={(e) =>
                  setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
                className="bg-slate-700 border-slate-600"
              />
              {errors.precio && (
                <p className="text-red-400 text-sm mt-1">{errors.precio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-100 mb-2">
                Margen de Ganancia (%) *
              </label>
              <Input
                type="number"
                value={formData.margen_ganancia}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    margen_ganancia: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
                className="bg-slate-700 border-slate-600"
              />
              {errors.margen && (
                <p className="text-red-400 text-sm mt-1">{errors.margen}</p>
              )}
            </div>
          </div>

          {/* Ventas y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-100 mb-2">
                Ventas (últimas) *
              </label>
              <Input
                type="number"
                value={formData.ventas}
                onChange={(e) =>
                  setFormData({ ...formData, ventas: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
                className="bg-slate-700 border-slate-600"
              />
              {errors.ventas && (
                <p className="text-red-400 text-sm mt-1">{errors.ventas}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-100 mb-2">
                Stock *
              </label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
                className="bg-slate-700 border-slate-600"
              />
              {errors.stock && (
                <p className="text-red-400 text-sm mt-1">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Categorías */}
          <div>
            <label className="block text-sm font-medium text-slate-100 mb-2">
              Categorías * (Seleccione al menos una)
            </label>
            <div className="bg-slate-700 rounded-lg p-3 space-y-2 max-h-32 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-slate-400 text-sm">No hay categorías disponibles</p>
              ) : (
                categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 rounded border-slate-500 bg-slate-600 text-blue-600 cursor-pointer"
                    />
                    <span className="text-slate-100 text-sm">{category}</span>
                  </label>
                ))
              )}
            </div>
            {errors.categoria && (
              <p className="text-red-400 text-sm mt-1">{errors.categoria}</p>
            )}
          </div>

          {/* Subcategorías (si hay categorías seleccionadas) */}
          {selectedCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-100 mb-2">
                Subcategorías (Opcional)
              </label>
              <div className="bg-slate-700 rounded-lg p-3 space-y-2 max-h-32 overflow-y-auto">
                <p className="text-slate-400 text-xs mb-2">
                  Categorías seleccionadas: {selectedCategories.join(', ')}
                </p>
                <p className="text-slate-400 text-xs">
                  Las subcategorías se pueden asignar después
                </p>
              </div>
            </div>
          )}

          {/* ID (solo lectura para edición) */}
          {product && (
            <div>
              <label className="block text-sm font-medium text-slate-100 mb-2">
                ID (no editable)
              </label>
              <Input
                value={formData.id}
                disabled
                className="bg-slate-700 border-slate-600 text-slate-400"
              />
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Producto
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="flex-1 border-slate-600"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

