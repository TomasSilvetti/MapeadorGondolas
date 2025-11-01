'use client';

import { useState } from 'react';
import { Gondola } from '@/types';
import { Input } from '@/components/ui/input';

interface PropertiesPanelProps {
  gondola: Gondola | null;
  onUpdate: (id: string, data: Partial<Gondola>) => void;
}

export const PropertiesPanel = ({ gondola, onUpdate }: PropertiesPanelProps) => {
  const [nameInput, setNameInput] = useState('');
  const [widthInput, setWidthInput] = useState('');
  const [depthInput, setDepthInput] = useState('');
  const [rotationInput, setRotationInput] = useState('');

  // Inicializar estados cuando gondola cambia
  if (gondola && nameInput !== gondola.name) {
    setNameInput(gondola.name);
    setWidthInput(gondola.width.toString());
    setDepthInput(gondola.depth.toString());
    setRotationInput(gondola.rotation.toString());
  } else if (!gondola && (nameInput || widthInput || depthInput || rotationInput)) {
    setNameInput('');
    setWidthInput('');
    setDepthInput('');
    setRotationInput('');
  }

  const handleNameChange = (value: string) => {
    setNameInput(value);
    if (gondola) {
      onUpdate(gondola.id, { name: value });
    }
  };

  const handleWidthChange = (value: string) => {
    setWidthInput(value);
    const num = parseFloat(value);
    if (!isNaN(num) && gondola) {
      onUpdate(gondola.id, { width: num });
    }
  };

  const handleDepthChange = (value: string) => {
    setDepthInput(value);
    const num = parseFloat(value);
    if (!isNaN(num) && gondola) {
      onUpdate(gondola.id, { depth: num });
    }
  };

  const handleRotationChange = (value: string) => {
    setRotationInput(value);
    let num = parseFloat(value);
    if (!isNaN(num) && gondola) {
      // Normalize to 0-360
      num = ((num % 360) + 360) % 360;
      setRotationInput(num.toString());
      onUpdate(gondola.id, { rotation: num });
    }
  };

  return (
    <div className="w-[300px] bg-slate-900 border-l border-slate-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-100">Properties</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {gondola ? (
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-2">Name</label>
              <Input
                value={nameInput}
                onChange={(e) => handleNameChange(e.target.value)}
                className="bg-slate-800 border-slate-600 text-slate-100 text-sm"
              />
            </div>

            {/* Width */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-2">Width (ft)</label>
              <Input
                type="number"
                value={widthInput}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="bg-slate-800 border-slate-600 text-slate-100 text-sm"
                min="1"
                step="0.5"
              />
            </div>

            {/* Depth */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-2">Depth (ft)</label>
              <Input
                type="number"
                value={depthInput}
                onChange={(e) => handleDepthChange(e.target.value)}
                className="bg-slate-800 border-slate-600 text-slate-100 text-sm"
                min="1"
                step="0.5"
              />
            </div>

            {/* Rotation */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-2">Rotation (°)</label>
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
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-slate-400">Select a component</p>
          </div>
        )}
      </div>
    </div>
  );
};
