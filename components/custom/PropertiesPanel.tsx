'use client';

import { useState, useEffect } from 'react';
import { Gondola, Shelf, Category } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ShelfPreview } from './ShelfPreview';
import { ShelfConfig } from './ShelfConfig';
import { useGondolasStore } from '@/stores/gondolas';
import { X, Search } from 'lucide-react';

interface PropertiesPanelProps {
  gondola: Gondola | null;
  onUpdate: (id: string, data: Partial<Gondola>) => void;
}

const CATEGORIAS_DISPONIBLES: Category[] = [
  'Bebidas',
  'Panadería',
  'Lácteos',
  'Carnes',
  'Verduras',
  'Frutas',
  'Otros',
];

export const PropertiesPanel = ({ gondola, onUpdate }: PropertiesPanelProps) => {
  const { updateShelf, updateShelfCount, applyGlobalShelfConfig } = useGondolasStore();
  const [widthInput, setWidthInput] = useState('');
  const [depthInput, setDepthInput] = useState('');
  const [rotationInput, setRotationInput] = useState('');
  const [shelfCountInput, setShelfCountInput] = useState('');
  
  // Estados para configuración global de estantes
  const [globalSpaces, setGlobalSpaces] = useState(1);
  const [globalRestrictionMode, setGlobalRestrictionMode] = useState<'permitir' | 'excluir'>('permitir');
  const [globalCategories, setGlobalCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sincronizar estados cuando cambia la góndola
  useEffect(() => {
    if (gondola) {
      setWidthInput(gondola.width.toString());
      setDepthInput(gondola.depth.toString());
      setRotationInput(gondola.rotation.toString());
      setShelfCountInput((gondola.estantes?.length || 0).toString());
    } else {
      setWidthInput('');
      setDepthInput('');
      setRotationInput('');
      setShelfCountInput('');
    }
  }, [gondola]);

  const handleWidthChange = (value: string) => {
    setWidthInput(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0 && gondola) {
      onUpdate(gondola.id, { width: num });
    }
  };

  const handleDepthChange = (value: string) => {
    setDepthInput(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0 && gondola) {
      onUpdate(gondola.id, { depth: num });
    }
  };

  const handleRotationChange = (value: string) => {
    setRotationInput(value);
    let num = parseFloat(value);
    if (!isNaN(num) && gondola) {
      // Normalizar a 0-360
      num = ((num % 360) + 360) % 360;
      setRotationInput(num.toString());
      onUpdate(gondola.id, { rotation: num });
    }
  };

  const handleShelfCountChange = (value: string) => {
    setShelfCountInput(value);
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 20 && gondola) {
      updateShelfCount(gondola.id, num);
    }
  };

  const handleShelfUpdate = (shelfId: string, data: Partial<Shelf>) => {
    if (gondola) {
      updateShelf(gondola.id, shelfId, data);
    }
  };

  // Funciones para configuración global
  const categoriasFiltradas = CATEGORIAS_DISPONIBLES.filter(
    (cat) =>
      !globalCategories.includes(cat) &&
      cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddGlobalCategoria = (categoria: Category) => {
    setGlobalCategories([...globalCategories, categoria]);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleRemoveGlobalCategoria = (categoria: Category) => {
    setGlobalCategories(globalCategories.filter((c) => c !== categoria));
  };

  const handleApplyGlobalConfig = () => {
    if (gondola) {
      applyGlobalShelfConfig(gondola.id, {
        cantidadEspacios: globalSpaces,
        restriccionModo: globalRestrictionMode,
        categoriasRestringidas: globalCategories,
      });
    }
  };

  return (
    <div className="w-[320px] bg-slate-900 border-l border-slate-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-100">Propiedades</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {gondola ? (
          <div className="p-4 space-y-4">
            {/* Título dinámico */}
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Góndola {gondola.name}
              </h3>
            </div>

            {/* Previsualización de estantes */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-2">
                Previsualización de Estantes
              </label>
              <ShelfPreview shelves={gondola.estantes || []} />
            </div>

            {/* Accordion de Dimensiones */}
            <Accordion type="single" collapsible defaultValue="dimensiones">
              <AccordionItem value="dimensiones" className="border-slate-700">
                <AccordionTrigger className="text-sm font-medium text-slate-200 hover:text-slate-100 py-3">
                  Dimensiones
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  {/* Ancho */}
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-2">
                      Ancho (m)
                    </label>
                    <Input
                      type="number"
                      value={widthInput}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-slate-100 text-sm"
                      min="0.1"
                      step="0.1"
                    />
                  </div>

                  {/* Profundidad */}
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-2">
                      Profundidad (m)
                    </label>
                    <Input
                      type="number"
                      value={depthInput}
                      onChange={(e) => handleDepthChange(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-slate-100 text-sm"
                      min="0.1"
                      step="0.1"
                    />
                  </div>

                  {/* Rotación */}
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-2">
                      Rotación (°)
                    </label>
                    <Input
                      type="number"
                      value={rotationInput}
                      onChange={(e) => handleRotationChange(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-slate-100 text-sm"
                      min="0"
                      max="360"
                      step="1"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Accordion de Configuración Global de Estantes */}
            <Accordion type="single" collapsible>
              <AccordionItem value="global-config" className="border-slate-700">
                <AccordionTrigger className="text-sm font-medium text-slate-200 hover:text-slate-100 py-3">
                  Configuración Global de Estantes
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  {/* Slider de espacios */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-medium text-slate-300">
                        Espacios para productos
                      </label>
                      <span className="text-sm font-semibold text-slate-100 bg-slate-700 px-2 py-1 rounded">
                        {globalSpaces}
                      </span>
                    </div>
                    <Slider
                      value={[globalSpaces]}
                      onValueChange={(value) => setGlobalSpaces(value[0])}
                      min={1}
                      max={50}
                      step={1}
                      className="w-full"
                    />
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
                              onClick={() => handleAddGlobalCategoria(categoria)}
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
                          variant={globalRestrictionMode === 'permitir' ? 'default' : 'outline'}
                          onClick={() => setGlobalRestrictionMode('permitir')}
                          className={`text-xs h-7 ${
                            globalRestrictionMode === 'permitir'
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-slate-800 border-slate-600 text-slate-300'
                          }`}
                        >
                          Permitir solo
                        </Button>
                        <Button
                          size="sm"
                          variant={globalRestrictionMode === 'excluir' ? 'default' : 'outline'}
                          onClick={() => setGlobalRestrictionMode('excluir')}
                          className={`text-xs h-7 ${
                            globalRestrictionMode === 'excluir'
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-slate-800 border-slate-600 text-slate-300'
                          }`}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>

                    {/* Badges de categorías seleccionadas */}
                    {globalCategories.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {globalCategories.map((categoria) => (
                          <Badge
                            key={categoria}
                            variant="secondary"
                            className={`${
                              globalRestrictionMode === 'permitir'
                                ? 'bg-green-900/30 text-green-300 border-green-700'
                                : 'bg-red-900/30 text-red-300 border-red-700'
                            } border flex items-center gap-1 pr-1`}
                          >
                            {categoria}
                            <button
                              onClick={() => handleRemoveGlobalCategoria(categoria)}
                              className="ml-1 hover:bg-slate-700 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic mb-3">
                        No hay restricciones de categoría
                      </p>
                    )}

                    {/* Botón aplicar a todos */}
                    <Button
                      onClick={handleApplyGlobalConfig}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      Aplicar a Todos los Estantes
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Accordion de Configuración de Estantes */}
            <Accordion type="single" collapsible defaultValue="estantes">
              <AccordionItem value="estantes" className="border-slate-700">
                <AccordionTrigger className="text-sm font-medium text-slate-200 hover:text-slate-100 py-3">
                  Configuración de Estantes
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  {/* Cantidad de estantes */}
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-2">
                      Cantidad de Estantes
                    </label>
                    <Input
                      type="number"
                      value={shelfCountInput}
                      onChange={(e) => handleShelfCountChange(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-slate-100 text-sm"
                      min="1"
                      max="20"
                    />
                  </div>

                  {/* Sub-accordions para cada estante */}
                  {gondola.estantes && gondola.estantes.length > 0 && (
                    <Accordion type="single" collapsible className="space-y-2">
                      {gondola.estantes.map((shelf) => (
                        <AccordionItem
                          key={shelf.id}
                          value={shelf.id}
                          className="border border-slate-700 rounded-lg bg-slate-800/30"
                        >
                          <AccordionTrigger className="text-xs font-medium text-slate-200 hover:text-slate-100 px-3 py-2 hover:no-underline">
                            Estante {shelf.numero}
                          </AccordionTrigger>
                          <AccordionContent className="px-0 pb-0">
                            <ShelfConfig
                              shelf={shelf}
                              onUpdate={(data) => handleShelfUpdate(shelf.id, data)}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-4">
            <p className="text-sm text-slate-400 text-center">
              Selecciona un componente para ver sus propiedades
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
