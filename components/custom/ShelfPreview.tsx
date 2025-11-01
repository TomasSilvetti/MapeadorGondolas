'use client';

import { Shelf } from '@/types';

interface ShelfPreviewProps {
  shelves: Shelf[];
}

export const ShelfPreview = ({ shelves }: ShelfPreviewProps) => {
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
        {shelves.map((shelf, index) => (
          <div
            key={shelf.id}
            className="relative bg-slate-700/50 rounded border border-slate-600 p-2 transition-all hover:bg-slate-700"
          >
            {/* Barra visual del estante */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-600 rounded h-6 relative overflow-hidden">
                {/* Divisiones de espacios */}
                <div className="absolute inset-0 flex">
                  {Array.from({ length: shelf.cantidadEspacios }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 border-r border-slate-500/30 last:border-r-0"
                    />
                  ))}
                </div>
              </div>
              {/* Indicador de espacios */}
              <div className="text-xs text-slate-300 font-medium min-w-[40px] text-right">
                {shelf.cantidadEspacios}
              </div>
            </div>
            
            {/* Indicadores de restricciones */}
            {shelf.categoriasRestringidas.length > 0 && (
              <div className="mt-1 flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  shelf.restriccionModo === 'permitir' 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                }`} />
                <span className="text-[10px] text-slate-400">
                  {shelf.categoriasRestringidas.length} categoría{shelf.categoriasRestringidas.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

