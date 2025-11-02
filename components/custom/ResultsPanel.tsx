'use client';

import { useMemo, useState, useEffect } from 'react';
import { Gondola, Shelf } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useAssignmentsStore } from '@/stores/assignments';
import { useProductsStore } from '@/stores/products';
import { Package, TrendingUp, Eye } from 'lucide-react';
import { ShelfVisualization } from './ShelfVisualization';
import { calculateVisualizationFactor, getVisualizationLevel, getVisualizationColor } from '@/utils/shelf-utils';

interface ResultsPanelProps {
  gondola: Gondola | null;
  selectedShelfId: string | null;
  onShelfSelect: (shelfId: string | null) => void;
  width: number;
  onWidthChange: (width: number) => void;
}

export const ResultsPanel = ({ gondola, selectedShelfId, onShelfSelect, width, onWidthChange }: ResultsPanelProps) => {
  const assignments = useAssignmentsStore((state) => state.assignments);
  const products = useProductsStore((state) => state.products);
  
  // Estado local para el estante seleccionado
  const [localSelectedShelfId, setLocalSelectedShelfId] = useState<string | null>(selectedShelfId);
  
  // Estado para el resize
  const [isResizing, setIsResizing] = useState(false);

  // Sincronizar con prop externa
  useEffect(() => {
    setLocalSelectedShelfId(selectedShelfId);
  }, [selectedShelfId]);

  // Manejar el resize
  useEffect(() => {
    if (!isResizing) return;

    // Agregar cursor global durante resize
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 320;
      const maxWidth = window.innerWidth * 0.5; // 50% del viewport
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        onWidthChange(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, onWidthChange]);

  // Encontrar el estante seleccionado
  const selectedShelf = useMemo(() => {
    if (!gondola || !localSelectedShelfId) return null;
    return gondola.estantes?.find(s => s.id === localSelectedShelfId) || null;
  }, [gondola, localSelectedShelfId]);
  
  // Obtener asignaciones del estante seleccionado
  const shelfAssignments = useMemo(() => {
    if (!selectedShelf || !gondola) return [];
    
    return assignments
      .filter(a => a.shelfId === selectedShelf.id && a.gondolaId === gondola.id)
      .map(assignment => {
        const product = products.find(p => p.id === assignment.productId);
        return {
          assignment,
          product,
        };
      })
      .filter(item => item.product !== undefined);
  }, [assignments, selectedShelf, products, gondola]);
  
  // Calcular estadísticas del estante
  const stats = useMemo(() => {
    if (!selectedShelf || shelfAssignments.length === 0) {
      return {
        espaciosOcupados: 0,
        espaciosTotales: selectedShelf?.cantidadEspacios || 0,
        gananciaTotal: 0,
        factorVisualizacion: selectedShelf && gondola?.estantes 
          ? calculateVisualizationFactor(selectedShelf, gondola.estantes.length)
          : 0,
      };
    }
    
    const espaciosOcupados = shelfAssignments.reduce(
      (sum, item) => sum + (item.assignment.cantidad || 1),
      0
    );
    
    const gananciaTotal = shelfAssignments.reduce((sum, item) => {
      if (!item.product) return sum;
      return sum + (
        item.product.margen_ganancia * 
        item.product.precio * 
        item.product.ventas *
        (item.assignment.cantidad || 1)
      );
    }, 0);

    const factorVisualizacion = gondola?.estantes 
      ? calculateVisualizationFactor(selectedShelf, gondola.estantes.length)
      : 0;
    
    return {
      espaciosOcupados,
      espaciosTotales: selectedShelf.cantidadEspacios,
      gananciaTotal,
      factorVisualizacion,
    };
  }, [selectedShelf, shelfAssignments, gondola]);

  const handleSelectShelf = (shelfId: string) => {
    setLocalSelectedShelfId(shelfId);
    onShelfSelect(shelfId);
  };

  if (!gondola) {
    return (
      <div 
        className="bg-slate-900 border-l border-slate-700 flex flex-col h-full relative"
        style={{ width: `${width}px` }}
      >
        {/* Resize Handle - Visible indicator */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 bg-slate-700/50 hover:bg-blue-500/70 pointer-events-none transition-all"
          style={{ zIndex: 9999 }}
        />
        
        {/* Resize Handle - Interactive area (wider for easier grabbing) */}
        <div
          className="absolute left-0 top-0 bottom-0 cursor-col-resize"
          style={{ 
            width: '12px',
            marginLeft: '-6px',
            zIndex: 9999
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsResizing(true);
          }}
          title="Arrastra para redimensionar el panel"
        />
        
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-slate-100">Resultados</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-slate-400 text-center">
            Selecciona una góndola para ver los resultados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-slate-900 border-l border-slate-700 flex flex-col h-full relative"
      style={{ width: `${width}px` }}
    >
      {/* Resize Handle - Visible indicator */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-slate-700/50 hover:bg-blue-500/70 pointer-events-none transition-all"
        style={{ zIndex: 9999 }}
      />
      
      {/* Resize Handle - Interactive area (wider for easier grabbing) */}
      <div
        className="absolute left-0 top-0 bottom-0 cursor-col-resize"
        style={{ 
          width: '12px',
          marginLeft: '-6px',
          zIndex: 9999
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsResizing(true);
        }}
        title="Arrastra para redimensionar el panel"
      />
      
      {/* Header - Fijo */}
      <div className="p-4 border-b border-slate-700 shrink-0">
        <h2 className="text-sm font-semibold text-slate-100">Resultados</h2>
        <p className="text-xs text-slate-400 mt-1">
          Góndola {gondola.name}
        </p>
      </div>

      {/* Contenido Scrolleable */}
      <div className="flex-1 overflow-y-auto">
        {/* Previsualización de Estantes */}
        <div className="p-4 border-b border-slate-700">
          <label className="text-xs font-medium text-slate-300 block mb-2">
            Selecciona un Estante
          </label>
          <ShelfVisualization
            shelves={gondola.estantes || []}
            gondolaId={gondola.id}
            selectedShelfId={localSelectedShelfId}
            onSelectShelf={handleSelectShelf}
          />
        </div>

        {/* Estadísticas y Productos del Estante Seleccionado */}
        {selectedShelf ? (
          <>
            {/* Estadísticas del estante */}
            <div className="p-4 bg-slate-800/50 border-b border-slate-700 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Estante seleccionado</span>
              <span className="text-sm font-semibold text-slate-100">
                Estante {selectedShelf.numero}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Espacios ocupados</span>
              <span className="text-sm font-semibold text-slate-100">
                {stats.espaciosOcupados} / {stats.espaciosTotales}
              </span>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{
                  width: `${(stats.espaciosOcupados / stats.espaciosTotales) * 100}%`,
                }}
              />
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">Ganancia esperada</span>
              <span className="text-sm font-semibold text-green-400">
                ${stats.gananciaTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Factor de visualización
              </span>
              <span className={`text-sm font-semibold ${getVisualizationColor(stats.factorVisualizacion)}`}>
                {getVisualizationLevel(stats.factorVisualizacion)} ({(stats.factorVisualizacion * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="p-4">
            {shelfAssignments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-sm text-slate-400">
                  No hay productos asignados a este estante
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-3">
                  Productos Asignados ({shelfAssignments.length})
                </h3>
                
                {shelfAssignments.map(({ assignment, product }) => {
                  if (!product) return null;
                  
                  const gananciaEsperada = 
                    product.margen_ganancia * 
                    product.precio * 
                    product.ventas *
                    (assignment.cantidad || 1);
                  
                  return (
                    <div
                      key={assignment.id}
                      className="bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-slate-100 line-clamp-2 mb-1">
                            {product.nombre}
                          </h4>
                        </div>
                        <Badge
                          variant="secondary"
                          className="ml-2 bg-blue-900/30 text-blue-300 border-blue-700 text-xs shrink-0"
                        >
                          {product.categoria}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Precio:</span>
                          <span className="font-semibold text-slate-100">
                            ${product.precio.toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-slate-400">Margen:</span>
                          <span className="font-semibold text-slate-100">
                            {(product.margen_ganancia * 100).toFixed(0)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-slate-400">Ventas:</span>
                          <span className="font-semibold text-slate-100">
                            {product.ventas} u/mes
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-slate-400">Facings:</span>
                          <span className="font-semibold text-slate-100">
                            {assignment.cantidad || 1}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Ganancia esperada:
                          </span>
                          <span className="text-sm font-semibold text-green-400">
                            ${gananciaEsperada.toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Factor visualización:
                          </span>
                          <span className={`text-xs font-semibold ${getVisualizationColor(stats.factorVisualizacion)}`}>
                            {getVisualizationLevel(stats.factorVisualizacion)} ({(stats.factorVisualizacion * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
        ) : (
          <div className="flex items-center justify-center p-4 py-12">
            <p className="text-sm text-slate-400 text-center">
              Selecciona un estante de la previsualización para ver los productos asignados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
