'use client';

import { useMemo } from 'react';
import { Gondola, Shelf } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useAssignmentsStore } from '@/stores/assignments';
import { useProductsStore } from '@/stores/products';
import { Package, TrendingUp } from 'lucide-react';

interface ResultsPanelProps {
  gondola: Gondola | null;
  selectedShelfId: string | null;
}

export const ResultsPanel = ({ gondola, selectedShelfId }: ResultsPanelProps) => {
  const assignments = useAssignmentsStore((state) => state.assignments);
  const products = useProductsStore((state) => state.products);
  
  // Encontrar el estante seleccionado
  const selectedShelf = useMemo(() => {
    if (!gondola || !selectedShelfId) return null;
    return gondola.estantes?.find(s => s.id === selectedShelfId) || null;
  }, [gondola, selectedShelfId]);
  
  // Obtener asignaciones del estante seleccionado
  const shelfAssignments = useMemo(() => {
    if (!selectedShelf) return [];
    
    return assignments
      .filter(a => a.shelfId === selectedShelf.id)
      .map(assignment => {
        const product = products.find(p => p.id === assignment.productId);
        return {
          assignment,
          product,
        };
      })
      .filter(item => item.product !== undefined);
  }, [assignments, selectedShelf, products]);
  
  // Calcular estadísticas del estante
  const stats = useMemo(() => {
    if (!selectedShelf || shelfAssignments.length === 0) {
      return {
        espaciosOcupados: 0,
        espaciosTotales: selectedShelf?.cantidadEspacios || 0,
        gananciaTotal: 0,
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
    
    return {
      espaciosOcupados,
      espaciosTotales: selectedShelf.cantidadEspacios,
      gananciaTotal,
    };
  }, [selectedShelf, shelfAssignments]);

  if (!gondola || !selectedShelf) {
    return (
      <div className="w-[320px] bg-slate-900 border-l border-slate-700 flex flex-col h-full">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-slate-100">Resultados</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-slate-400 text-center">
            Selecciona un estante para ver los productos asignados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[320px] bg-slate-900 border-l border-slate-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-100">Resultados</h2>
        <p className="text-xs text-slate-400 mt-1">
          Góndola {gondola.name} - Estante {selectedShelf.numero}
        </p>
      </div>

      {/* Estadísticas del estante */}
      <div className="p-4 bg-slate-800/50 border-b border-slate-700 space-y-3">
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
      </div>

      {/* Lista de productos */}
      <div className="flex-1 overflow-y-auto p-4">
        {shelfAssignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Package className="w-12 h-12 text-slate-600 mb-3" />
            <p className="text-sm text-slate-400">
              No hay productos asignados a este estante
            </p>
          </div>
        ) : (
          <div className="space-y-3">
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
                      <h4 className="text-sm font-semibold text-slate-100 line-clamp-2">
                        {product.nombre}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Espacio {assignment.spaceId.split('-').pop()}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-blue-900/30 text-blue-300 border-blue-700 text-xs"
                    >
                      {product.categoria}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Facings:</span>
                      <span className="font-semibold text-slate-100">
                        {assignment.cantidad || 1}
                      </span>
                    </div>
                    
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
                      <span className="text-slate-400">Ventas mensuales:</span>
                      <span className="font-semibold text-slate-100">
                        {product.ventas} unidades
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-700">
                      <span className="text-slate-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Ganancia esperada:
                      </span>
                      <span className="font-semibold text-green-400">
                        ${gananciaEsperada.toFixed(2)}
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
  );
};

