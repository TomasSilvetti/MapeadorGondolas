'use client';

import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gondola } from '@/types';
import { useAssignmentsStore } from '@/stores/assignments';
import { useProductsStore } from '@/stores/products';
import { Package, TrendingUp } from 'lucide-react';

interface ShelfSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gondola: Gondola | null;
  onSelectShelf: (shelfId: string) => void;
}

export const ShelfSelector = ({
  open,
  onOpenChange,
  gondola,
  onSelectShelf,
}: ShelfSelectorProps) => {
  const assignments = useAssignmentsStore((state) => state.assignments);
  const products = useProductsStore((state) => state.products);
  
  // Calcular estadísticas por estante
  const shelfStats = useMemo(() => {
    if (!gondola || !gondola.estantes) return [];
    
    return gondola.estantes.map(shelf => {
      const shelfAssignments = assignments.filter(a => a.shelfId === shelf.id);
      
      const productosAsignados = shelfAssignments.length;
      
      const gananciaTotal = shelfAssignments.reduce((sum, assignment) => {
        const product = products.find(p => p.id === assignment.productId);
        if (!product) return sum;
        
        return sum + (
          product.margen_ganancia * 
          product.precio * 
          product.ventas *
          (assignment.cantidad || 1)
        );
      }, 0);
      
      return {
        shelf,
        productosAsignados,
        gananciaTotal,
      };
    });
  }, [gondola, assignments, products]);
  
  const handleSelectShelf = (shelfId: string) => {
    onSelectShelf(shelfId);
    onOpenChange(false);
  };

  if (!gondola) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-100">
            Seleccionar Estante - Góndola {gondola.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-4 max-h-[60vh] overflow-y-auto">
          {shelfStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-sm text-slate-400">
                Esta góndola no tiene estantes configurados
              </p>
            </div>
          ) : (
            shelfStats.map(({ shelf, productosAsignados, gananciaTotal }) => (
              <Button
                key={shelf.id}
                onClick={() => handleSelectShelf(shelf.id)}
                variant="outline"
                className="w-full h-auto p-4 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-left justify-start"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-slate-100">
                        Estante {shelf.numero}
                      </span>
                      {productosAsignados > 0 && (
                        <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded-full">
                          {productosAsignados} productos
                        </span>
                      )}
                    </div>
                    
                    {productosAsignados > 0 ? (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>Ganancia esperada:</span>
                        <span className="font-semibold text-green-400">
                          ${gananciaTotal.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        Sin productos asignados
                      </p>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-300">
                        {shelf.numero}
                      </span>
                    </div>
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

