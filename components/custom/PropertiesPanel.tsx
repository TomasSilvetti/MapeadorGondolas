'use client';

import { useState, useEffect } from 'react';
import { Gondola, Shelf } from '@/types';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ShelfPreview } from './ShelfPreview';
import { ShelfConfig } from './ShelfConfig';
import { useGondolasStore } from '@/stores/gondolas';

interface PropertiesPanelProps {
  gondola: Gondola | null;
  onUpdate: (id: string, data: Partial<Gondola>) => void;
}

export const PropertiesPanel = ({ gondola, onUpdate }: PropertiesPanelProps) => {
  const { updateShelf, updateShelfCount } = useGondolasStore();
  const [widthInput, setWidthInput] = useState('');
  const [depthInput, setDepthInput] = useState('');
  const [rotationInput, setRotationInput] = useState('');
  const [shelfCountInput, setShelfCountInput] = useState('');

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
                      Ancho (ft)
                    </label>
                    <Input
                      type="number"
                      value={widthInput}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-slate-100 text-sm"
                      min="1"
                      step="0.5"
                    />
                  </div>

                  {/* Profundidad */}
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-2">
                      Profundidad (ft)
                    </label>
                    <Input
                      type="number"
                      value={depthInput}
                      onChange={(e) => handleDepthChange(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-slate-100 text-sm"
                      min="1"
                      step="0.5"
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
