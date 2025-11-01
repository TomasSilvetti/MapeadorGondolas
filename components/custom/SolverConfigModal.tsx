'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Milk, Snowflake, Apple, Beef, Wheat, Wine, Package } from 'lucide-react';
import { useGondolasStore } from '@/stores/gondolas';
import { useSolverConfigStore } from '@/stores/solver-config';
import { Category } from '@/types';

interface SolverConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const getCategoryIcon = (categoria: Category) => {
  const iconMap: Record<Category, React.ReactNode> = {
    'Lácteos': <Milk className="w-3 h-3" />,
    'Bebidas': <Wine className="w-3 h-3" />,
    'Carnes': <Beef className="w-3 h-3" />,
    'Frutas': <Apple className="w-3 h-3" />,
    'Verduras': <Apple className="w-3 h-3" />,
    'Panadería': <Wheat className="w-3 h-3" />,
    'Otros': <Package className="w-3 h-3" />,
  };
  return iconMap[categoria] || <Package className="w-3 h-3" />;
};

export const SolverConfigModal = ({ open, onOpenChange }: SolverConfigModalProps) => {
  const gondolas = useGondolasStore((state) => state.gondolas);
  const { config, updateConfig } = useSolverConfigStore();
  
  // Estado local para los pesos
  const [marginWeight, setMarginWeight] = useState(config.marginWeight * 100);
  const [popularityWeight, setPopularityWeight] = useState(config.popularityWeight * 100);
  
  // Estado para el selector de categorías por estante
  const [selectedCategory, setSelectedCategory] = useState<Record<string, string>>({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<Record<string, boolean>>({});

  // Sincronizar con el store cuando se abre el modal
  useEffect(() => {
    if (open) {
      setMarginWeight(config.marginWeight * 100);
      setPopularityWeight(config.popularityWeight * 100);
    }
  }, [open, config]);

  const handleSliderChange = (value: number[]) => {
    const newMarginWeight = value[0];
    const newPopularityWeight = 100 - newMarginWeight;
    setMarginWeight(newMarginWeight);
    setPopularityWeight(newPopularityWeight);
  };

  const handleAddRestriction = (gondolaId: string, shelfId: string) => {
    const categoryKey = `${gondolaId}-${shelfId}`;
    const categoria = selectedCategory[categoryKey] as Category;
    
    if (!categoria) return;

    const gondola = gondolas.find((g) => g.id === gondolaId);
    const shelf = gondola?.estantes?.find((s) => s.id === shelfId);
    
    if (shelf && !shelf.categoriasRestringidas.includes(categoria)) {
      // Actualizar la góndola con la nueva restricción
      useGondolasStore.getState().updateShelf(gondolaId, shelfId, {
        categoriasRestringidas: [...shelf.categoriasRestringidas, categoria],
      });
    }

    // Limpiar selección
    setSelectedCategory({ ...selectedCategory, [categoryKey]: '' });
    setShowCategoryDropdown({ ...showCategoryDropdown, [categoryKey]: false });
  };

  const handleRemoveRestriction = (gondolaId: string, shelfId: string, categoria: Category) => {
    const gondola = gondolas.find((g) => g.id === gondolaId);
    const shelf = gondola?.estantes?.find((s) => s.id === shelfId);
    
    if (shelf) {
      useGondolasStore.getState().updateShelf(gondolaId, shelfId, {
        categoriasRestringidas: shelf.categoriasRestringidas.filter((c) => c !== categoria),
      });
    }
  };

  const handleExecuteOptimization = () => {
    // Guardar configuración en el store
    updateConfig({
      marginWeight: marginWeight / 100,
      popularityWeight: popularityWeight / 100,
    });
    
    // Cerrar modal
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Restaurar valores originales
    setMarginWeight(config.marginWeight * 100);
    setPopularityWeight(config.popularityWeight * 100);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-100">
            Configurar y Ejecutar Optimizador de Layout
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Ajusta los parámetros y verifica las restricciones antes de correr la optimización.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sección de Parámetros del Algoritmo */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Parámetros del Algoritmo
            </h3>
            
            <div className="space-y-4">
              {/* Inputs de porcentajes */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Peso del Margen de Ganancia
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={Math.round(marginWeight)}
                      readOnly
                      className="bg-slate-800 border-slate-600 text-slate-100 text-center font-semibold"
                    />
                    <span className="text-slate-300 font-medium">%</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Peso de la Popularidad
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={Math.round(popularityWeight)}
                      readOnly
                      className="bg-slate-800 border-slate-600 text-slate-100 text-center font-semibold"
                    />
                    <span className="text-slate-300 font-medium">%</span>
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="pt-2">
                <Slider
                  value={[marginWeight]}
                  onValueChange={handleSliderChange}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Sección de Restricciones Actuales */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Verificar Restricciones Actuales
            </h3>

            {gondolas.length === 0 ? (
              <p className="text-sm text-slate-400 italic">
                No hay góndolas en el canvas. Agrega góndolas para configurar restricciones.
              </p>
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {gondolas.map((gondola) => (
                  <AccordionItem
                    key={gondola.id}
                    value={gondola.id}
                    className="border border-slate-700 rounded-lg bg-slate-800/30"
                  >
                    <AccordionTrigger className="text-sm font-medium text-slate-200 hover:text-slate-100 px-4 py-3 hover:no-underline">
                      Góndola {gondola.name}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      {gondola.estantes && gondola.estantes.length > 0 ? (
                        <Accordion type="single" collapsible className="space-y-2">
                          {gondola.estantes.map((shelf) => {
                            const categoryKey = `${gondola.id}-${shelf.id}`;
                            const availableCategories = CATEGORIAS_DISPONIBLES.filter(
                              (cat) => !shelf.categoriasRestringidas.includes(cat)
                            );

                            return (
                              <AccordionItem
                                key={shelf.id}
                                value={shelf.id}
                                className="border border-slate-700 rounded-lg bg-slate-800/50"
                              >
                                <AccordionTrigger className="text-xs font-medium text-slate-200 hover:text-slate-100 px-3 py-2 hover:no-underline">
                                  Estante {shelf.numero}
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pb-3 pt-2">
                                  <div className="space-y-3">
                                    {/* Añadir/Quitar restricción de categoría */}
                                    <div>
                                      <label className="text-xs font-medium text-slate-300 block mb-2">
                                        Añadir/Quitar restricción de categoría
                                      </label>
                                      <div className="flex gap-2">
                                        <div className="relative flex-1">
                                          <select
                                            value={selectedCategory[categoryKey] || ''}
                                            onChange={(e) => {
                                              setSelectedCategory({
                                                ...selectedCategory,
                                                [categoryKey]: e.target.value,
                                              });
                                            }}
                                            className="w-full bg-slate-800 border border-slate-600 text-slate-100 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          >
                                            <option value="">Seleccionar categoría...</option>
                                            {availableCategories.map((cat) => (
                                              <option key={cat} value={cat}>
                                                {cat}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                        <Button
                                          size="sm"
                                          onClick={() => handleAddRestriction(gondola.id, shelf.id)}
                                          disabled={!selectedCategory[categoryKey]}
                                          className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                                        >
                                          +
                                        </Button>
                                      </div>
                                    </div>

                                    {/* Restricciones activas */}
                                    <div>
                                      <label className="text-xs font-medium text-slate-300 block mb-2">
                                        Restricciones activas:
                                      </label>
                                      {shelf.categoriasRestringidas.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                          {shelf.categoriasRestringidas.map((categoria) => (
                                            <Badge
                                              key={categoria}
                                              className={`${
                                                shelf.restriccionModo === 'permitir'
                                                  ? 'bg-green-900/30 text-green-300 border-green-700'
                                                  : 'bg-red-900/30 text-red-300 border-red-700'
                                              } border flex items-center gap-1.5 pr-1 pl-2 py-1`}
                                            >
                                              {getCategoryIcon(categoria)}
                                              <span className="text-xs">
                                                {shelf.restriccionModo === 'permitir' ? 'Solo ' : ''}
                                                {categoria}
                                              </span>
                                              <button
                                                onClick={() =>
                                                  handleRemoveRestriction(gondola.id, shelf.id, categoria)
                                                }
                                                className="ml-1 hover:bg-slate-700 rounded-full p-0.5 transition-colors"
                                              >
                                                <X className="w-3 h-3" />
                                              </button>
                                            </Badge>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-slate-500 italic">
                                          No hay restricciones activas
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      ) : (
                        <p className="text-xs text-slate-500 italic">
                          Esta góndola no tiene estantes configurados
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleExecuteOptimization}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Ejecutar Optimización
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

