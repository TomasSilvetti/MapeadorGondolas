'use client';

import { useState, useEffect } from 'react';
import { Category, Shelf } from '@/types';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCategoriesStore } from '@/stores/categories';
import { X, Search } from 'lucide-react';

interface ShelfConfigProps {
  shelf: Shelf;
  onUpdate: (data: Partial<Shelf>) => void;
}

export const ShelfConfig = ({ shelf, onUpdate }: ShelfConfigProps) => {
  const { loadCategories, getAllCategoryNames } = useCategoriesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Cargar categorías dinámicas
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Obtener categorías disponibles dinámicamente
  const CATEGORIAS_DISPONIBLES = getAllCategoryNames();

  const categoriasFiltradas = CATEGORIAS_DISPONIBLES.filter(
    (cat) =>
      !shelf.categoriasRestringidas.includes(cat) &&
      cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategoria = (categoria: Category) => {
    onUpdate({
      categoriasRestringidas: [...shelf.categoriasRestringidas, categoria],
    });
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleRemoveCategoria = (categoria: Category) => {
    onUpdate({
      categoriasRestringidas: shelf.categoriasRestringidas.filter(
        (c) => c !== categoria
      ),
    });
  };

  const handleSliderChange = (value: number[]) => {
    onUpdate({ cantidadEspacios: value[0] });
  };

  const handleVisualizationChange = (value: number[]) => {
    // Convertir de porcentaje (0-100) a factor (0-1)
    onUpdate({ factorVisualizacion: value[0] / 100 });
  };

  const toggleModoRestriccion = () => {
    onUpdate({
      restriccionModo: shelf.restriccionModo === 'permitir' ? 'excluir' : 'permitir',
    });
  };

  const visualizationPercent = Math.round((shelf.factorVisualizacion || 1.0) * 100);

  return (
    <div className="space-y-4 p-4">
      {/* Slider de espacios */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-slate-300">
            Espacios para productos
          </label>
          <span className="text-sm font-semibold text-slate-100 bg-slate-700 px-2 py-1 rounded">
            {shelf.cantidadEspacios}
          </span>
        </div>
        <Slider
          value={[shelf.cantidadEspacios]}
          onValueChange={handleSliderChange}
          min={1}
          max={50}
          step={1}
          className="w-full"
        />
      </div>

      {/* Slider de factor de visualización */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-slate-300">
            Factor de visualización
          </label>
          <span className="text-sm font-semibold text-slate-100 bg-blue-600 px-2 py-1 rounded">
            {visualizationPercent}%
          </span>
        </div>
        <Slider
          value={[visualizationPercent]}
          onValueChange={handleVisualizationChange}
          min={25}
          max={100}
          step={1}
          className="w-full"
        />
        <p className="text-[10px] text-slate-400 mt-1">
          Ajusta manualmente el factor de visualización de este estante
        </p>
      </div>

      {/* Restricciones de categoría */}
      <div>
        <label className="text-xs font-medium text-slate-300 block mb-2">
          Restricciones de Categoría
        </label>

        {/* Buscador de categorías */}
        <div className="relative mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Añadir categorías..."
              className="bg-slate-800 border-slate-600 text-slate-100 text-sm pl-9"
            />
          </div>

          {/* Sugerencias */}
          {showSuggestions && categoriasFiltradas.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {categoriasFiltradas.map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => handleAddCategoria(categoria)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  {categoria}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modo de restricción */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-slate-400">Modo de restricción</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={shelf.restriccionModo === 'permitir' ? 'default' : 'outline'}
              onClick={toggleModoRestriccion}
              className={`text-xs h-7 ${
                shelf.restriccionModo === 'permitir'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-800 border-slate-600 text-slate-300'
              }`}
            >
              Permitir solo
            </Button>
            <Button
              size="sm"
              variant={shelf.restriccionModo === 'excluir' ? 'default' : 'outline'}
              onClick={toggleModoRestriccion}
              className={`text-xs h-7 ${
                shelf.restriccionModo === 'excluir'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-800 border-slate-600 text-slate-300'
              }`}
            >
              Excluir
            </Button>
          </div>
        </div>

        {/* Badges de categorías seleccionadas */}
        {shelf.categoriasRestringidas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {shelf.categoriasRestringidas.map((categoria) => (
              <Badge
                key={categoria}
                variant="secondary"
                className={`${
                  shelf.restriccionModo === 'permitir'
                    ? 'bg-green-900/30 text-green-300 border-green-700'
                    : 'bg-red-900/30 text-red-300 border-red-700'
                } border flex items-center gap-1 pr-1`}
              >
                {categoria}
                <button
                  onClick={() => handleRemoveCategoria(categoria)}
                  className="ml-1 hover:bg-slate-700 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            No hay restricciones de categoría
          </p>
        )}
      </div>
    </div>
  );
};

