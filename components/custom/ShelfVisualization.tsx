'use client';

import { useMemo } from 'react';
import { Shelf, Assignment } from '@/types';
import { useAssignmentsStore } from '@/stores/assignments';
import { useProductsStore } from '@/stores/products';

interface ShelfVisualizationProps {
  shelves: Shelf[];
  gondolaId: string;
  selectedShelfId: string | null;
  onSelectShelf: (shelfId: string) => void;
}

// Colores por categoría
const categoryColors: Record<string, string> = {
  'Bebidas': 'bg-blue-500',
  'Panadería': 'bg-amber-500',
  'Lácteos': 'bg-cyan-400',
  'Carnes': 'bg-red-500',
  'Verduras': 'bg-green-500',
  'Frutas': 'bg-pink-500',
  'Otros': 'bg-slate-500',
};

export const ShelfVisualization = ({
  shelves,
  gondolaId,
  selectedShelfId,
  onSelectShelf,
}: ShelfVisualizationProps) => {
  const assignments = useAssignmentsStore((state) => state.assignments);
  const products = useProductsStore((state) => state.products);

  // Calcular asignaciones por estante
  const shelfData = useMemo(() => {
    return shelves.map((shelf) => {
      const shelfAssignments = assignments.filter(
        (a) => a.shelfId === shelf.id && a.gondolaId === gondolaId
      );

      // Crear un mapa de espacios ocupados
      const occupiedSpaces = new Map<number, { color: string; productName: string }>();
      
      shelfAssignments.forEach((assignment) => {
        const product = products.find((p) => p.id === assignment.productId);
        if (product) {
          // Extraer el número de posición del spaceId
          const spacePosition = parseInt(assignment.spaceId.split('-').pop() || '0');
          // Usar la primera categoría si es un array
          const categoryName = Array.isArray(product.categoria) 
            ? product.categoria[0] 
            : product.categoria;
          const color = categoryColors[categoryName] || categoryColors['Otros'];
          
          // Marcar los espacios ocupados por este producto (facings)
          for (let i = 0; i < assignment.cantidad; i++) {
            occupiedSpaces.set(spacePosition + i, {
              color,
              productName: product.nombre,
            });
          }
        }
      });

      return {
        shelf,
        occupiedSpaces,
        assignmentCount: shelfAssignments.length,
      };
    });
  }, [shelves, assignments, products, gondolaId]);

  if (!shelves || shelves.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-slate-800/50 rounded-lg border border-slate-700">
        <p className="text-xs text-slate-400">Sin estantes configurados</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
      <div className="flex flex-col gap-2">
        {shelfData.map(({ shelf, occupiedSpaces, assignmentCount }, index) => {
          const isSelected = shelf.id === selectedShelfId;
          
          return (
            <button
              key={shelf.id}
              onClick={() => onSelectShelf(shelf.id)}
              className={`relative rounded border p-2 transition-all text-left ${
                isSelected
                  ? 'bg-blue-900/30 border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500'
              }`}
            >
              {/* Etiqueta del estante */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-200">
                  Estante {shelf.numero}
                </span>
                {assignmentCount > 0 && (
                  <span className="text-[10px] bg-slate-900/50 text-slate-300 px-2 py-0.5 rounded-full">
                    {assignmentCount} productos
                  </span>
                )}
              </div>

              {/* Barra visual del estante con productos */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-800 rounded h-12 p-1">
                  {/* Divisiones de espacios con separación */}
                  <div className="flex gap-1.5 h-full">
                    {Array.from({ length: shelf.cantidadEspacios }).map((_, i) => {
                      const spaceData = occupiedSpaces.get(i);
                      
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded transition-colors ${
                            spaceData ? spaceData.color : 'bg-slate-600'
                          }`}
                          title={spaceData ? spaceData.productName : `Espacio ${i + 1} vacío`}
                        />
                      );
                    })}
                  </div>
                </div>
                
                {/* Indicador de espacios */}
                <div className="text-xs text-slate-300 font-medium min-w-[40px] text-right">
                  {occupiedSpaces.size}/{shelf.cantidadEspacios}
                </div>
              </div>

              {/* Indicadores de restricciones */}
              {shelf.categoriasRestringidas.length > 0 && (
                <div className="mt-1 flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      shelf.restriccionModo === 'permitir' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-[10px] text-slate-400">
                    {shelf.categoriasRestringidas.length} categoría
                    {shelf.categoriasRestringidas.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

