'use client';

import { useMemo } from 'react';
import { Gondola, Shelf } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useAssignmentsStore } from '@/stores/assignments';
import { useProductsStore } from '@/stores/products';
import { Package, TrendingUp, Eye } from 'lucide-react';
import { ShelfVisualization } from './ShelfVisualization';
import { calculateVisualizationFactor, getVisualizationLevel, getVisualizationColor } from '@/utils/shelf-utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ShelfDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gondola: Gondola | null;
  selectedShelfId: string | null;
  onShelfSelect: (shelfId: string | null) => void;
}

export const ShelfDetailsModal = ({
  open,
  onOpenChange,
  gondola,
  selectedShelfId,
  onShelfSelect,
}: ShelfDetailsModalProps) => {
  const assignments = useAssignmentsStore((state) => state.assignments);
  const products = useProductsStore((state) => state.products);

  // Encontrar el estante seleccionado
  const selectedShelf = useMemo(() => {
    if (!gondola || !selectedShelfId) return null;
    return gondola.estantes?.find(s => s.id === selectedShelfId) || null;
  }, [gondola, selectedShelfId]);

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

    // Calcular factor de visualización primero
    const factorVisualizacion = gondola?.estantes
      ? calculateVisualizationFactor(selectedShelf, gondola.estantes.length)
      : 0;

    // Ahora usar factorVisualizacion en el cálculo de ganancia
    const gananciaTotal = shelfAssignments.reduce((sum, item) => {
      if (!item.product) return sum;
      const gananciaBase =
        item.product.margen_ganancia *
        item.product.precio *
        item.product.ventas;

      const gananciaConVisibilidad = gananciaBase * factorVisualizacion;

      return sum + gananciaConVisibilidad * (item.assignment.cantidad || 1);
    }, 0);

    return {
      espaciosOcupados,
      espaciosTotales: selectedShelf.cantidadEspacios,
      gananciaTotal,
      factorVisualizacion,
    };
  }, [selectedShelf, shelfAssignments, gondola]);

  if (!gondola) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[85vh] bg-slate-900 border-slate-700 text-slate-100 overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-slate-100">
            Resultados - {gondola.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
          {/* Lado izquierdo - Visualización de estantes */}
          <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-3">
                Selecciona un Estante
              </label>
              <ShelfVisualization
                shelves={gondola.estantes || []}
                gondolaId={gondola.id}
                selectedShelfId={selectedShelfId}
                onSelectShelf={onShelfSelect}
              />
            </div>
          </div>

          {/* Lado derecho - Detalles del estante seleccionado */}
          <div className="lg:col-span-1 flex flex-col overflow-hidden">
            {selectedShelf ? (
              <div className="flex flex-col gap-4 overflow-y-auto pr-2">
                {/* Estadísticas del estante */}
                <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Estante seleccionado</span>
                    <span className="text-lg font-semibold text-slate-100">
                      Estante {selectedShelf.numero}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Espacios ocupados</span>
                    <span className="text-lg font-semibold text-slate-100">
                      {stats.espaciosOcupados} / {stats.espaciosTotales}
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${(stats.espaciosOcupados / stats.espaciosTotales) * 100}%`,
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-slate-400">Ganancia esperada</span>
                    <span className="text-lg font-semibold text-green-400">
                      ${stats.gananciaTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      Factor de visualización
                    </span>
                    <span className={`text-base font-semibold ${getVisualizationColor(stats.factorVisualizacion)}`}>
                      {getVisualizationLevel(stats.factorVisualizacion)} ({(stats.factorVisualizacion * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>

                {/* Lista de productos */}
                <div>
                  {shelfAssignments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-800/30 rounded-lg border border-slate-700">
                      <Package className="w-16 h-16 text-slate-600 mb-4" />
                      <p className="text-base text-slate-400">
                        No hay productos asignados a este estante
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">
                        Productos Asignados ({shelfAssignments.length})
                      </h3>
                      
                      {shelfAssignments.map(({ assignment, product }) => {
                        if (!product) return null;
                        
                        const gananciaEsperada =
                          product.margen_ganancia *
                          product.precio *
                          product.ventas *
                          stats.factorVisualizacion *
                          (assignment.cantidad || 1);
                        
                        return (
                          <div
                            key={assignment.id}
                            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-base font-semibold text-slate-100 line-clamp-2 mb-1">
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
                            
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
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
                                <span className="text-sm text-slate-400 flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4" />
                                  Ganancia esperada:
                                </span>
                                <span className="text-base font-semibold text-green-400">
                                  ${gananciaEsperada.toFixed(2)}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-400 flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  Factor visualización:
                                </span>
                                <span className={`text-sm font-semibold ${getVisualizationColor(stats.factorVisualizacion)}`}>
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
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Package className="w-16 h-16 text-slate-600 mb-4 mx-auto" />
                  <p className="text-base text-slate-400">
                    Selecciona un estante de la visualización para ver los productos asignados
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

