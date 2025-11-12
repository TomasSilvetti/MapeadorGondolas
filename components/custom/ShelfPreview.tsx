'use client';

import { Shelf } from '@/types';

interface ShelfPreviewProps {
  shelves: Shelf[];
  estantePrincipalIndex?: number;
  onPrincipalShelfChange?: (index: number) => void;
}

export const ShelfPreview = ({ 
  shelves, 
  estantePrincipalIndex = 0,
  onPrincipalShelfChange 
}: ShelfPreviewProps) => {
  if (!shelves || shelves.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-slate-800/50 rounded-lg border border-slate-700">
        <p className="text-xs text-slate-400">Sin estantes configurados</p>
      </div>
    );
  }

  const handleSliderChange = (index: number) => {
    if (onPrincipalShelfChange) {
      onPrincipalShelfChange(index);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
      <div className="flex gap-3">
        {/* Slider vertical */}
        <div className="flex flex-col items-center justify-between py-1" style={{ minHeight: `${shelves.length * 44}px` }}>
          <div className="relative flex flex-col items-center h-full">
            {/* Línea vertical del slider */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-slate-600" style={{ left: '50%', transform: 'translateX(-50%)' }} />
            
            {/* Puntos del slider */}
            <div className="relative flex flex-col justify-between h-full">
              {shelves.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSliderChange(index)}
                  className={`relative z-10 rounded-full transition-all ${
                    index === estantePrincipalIndex
                      ? 'w-4 h-4 bg-blue-500 ring-2 ring-blue-300'
                      : 'w-3 h-3 bg-slate-500 hover:bg-slate-400'
                  }`}
                  style={{ marginTop: index === 0 ? '0' : '32px' }}
                  title={`Estante ${index + 1}${index === estantePrincipalIndex ? ' (Principal)' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Lista de estantes */}
        <div className="flex-1 flex flex-col gap-2">
          {shelves.map((shelf, index) => {
            const visualizationPercent = Math.round((shelf.factorVisualizacion || 1.0) * 100);
            const isPrincipal = index === estantePrincipalIndex;
            
            return (
              <div
                key={shelf.id}
                className={`relative bg-slate-700/50 rounded border p-2 transition-all hover:bg-slate-700 ${
                  isPrincipal ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-slate-600'
                }`}
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
                
                {/* Indicadores de restricciones y visualización */}
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {shelf.categoriasRestringidas.length > 0 && (
                      <>
                        <div className={`w-2 h-2 rounded-full ${
                          shelf.restriccionModo === 'permitir' 
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                        }`} />
                        <span className="text-[10px] text-slate-400">
                          {shelf.categoriasRestringidas.length} categoría{shelf.categoriasRestringidas.length !== 1 ? 's' : ''}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Factor de visualización */}
                  <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isPrincipal 
                      ? 'bg-blue-500/20 text-blue-300' 
                      : 'bg-slate-600/50 text-slate-300'
                  }`}>
                    {visualizationPercent}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

