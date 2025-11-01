'use client';

import { useState, useCallback } from 'react';
import { useGondolasStore } from '@/stores/gondolas';
import { TopBar } from '@/components/custom/TopBar';
import { ComponentsPanel } from '@/components/custom/ComponentsPanel';
import { CanvasStage } from '@/components/custom/CanvasStage';
import { PropertiesPanel } from '@/components/custom/PropertiesPanel';
import { BottomBar } from '@/components/custom/BottomBar';
import { useCanvasControls } from '@/hooks/useCanvasControls';
import { Gondola } from '@/types';

export default function MapPage() {
  const gondolas = useGondolasStore((state) => state.gondolas);
  const selectedGondolaId = useGondolasStore((state) => state.selectedGondolaId);
  const addGondola = useGondolasStore((state) => state.addGondola);
  const updateGondola = useGondolasStore((state) => state.updateGondola);
  const selectGondola = useGondolasStore((state) => state.selectGondola);

  const canvasControls = useCanvasControls();
  const [cursorPos] = useState({ x: 0, y: 0 });

  // Historial simplificado
  const [history, setHistory] = useState<Gondola[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addToHistory = useCallback(
    (newGondolas: Gondola[]) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(newGondolas)));
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const handleGondolaMove = useCallback(
    (id: string, x: number, y: number) => {
      updateGondola(id, { x, y });
      addToHistory(gondolas.map((g) => (g.id === id ? { ...g, x, y } : g)));
    },
    [gondolas, updateGondola, addToHistory]
  );

  const handleDropComponent = useCallback(
    (x: number, y: number, componentData: Record<string, unknown>) => {
      const typeMap: Record<string, Gondola['type']> = {
        shelving: 'standard',
        refrigeration: 'refrigeration',
        checkouts: 'checkout',
        structural: 'wall',
      };
      
      const newGondola: Gondola = {
        id: crypto.randomUUID(),
        type: typeMap[(componentData.type as string)?.toLowerCase()] || 'standard',
        name: componentData.name as string,
        x: Math.round(x),
        y: Math.round(y),
        width: componentData.width as number,
        depth: componentData.depth as number,
        rotation: 0,
      };

      addGondola(newGondola);
      selectGondola(newGondola.id);
      addToHistory([...gondolas, newGondola]);
    },
    [gondolas, addGondola, selectGondola, addToHistory]
  );

  const handleSelectGondola = useCallback(
    (id: string | null) => {
      selectGondola(id);
    },
    [selectGondola]
  );

  const handleUpdateGondola = useCallback(
    (id: string, data: Partial<Gondola>) => {
      updateGondola(id, data);
      const updatedGondolas = gondolas.map((g) => (g.id === id ? { ...g, ...data } : g));
      addToHistory(updatedGondolas);
    },
    [gondolas, updateGondola, addToHistory]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      // Aquí restaurarías el estado desde history[newIndex]
      // Por ahora, este es un placeholder - la función real se implementaría
      // restaurando el estado completo de góndolas
    }
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      // Aquí restaurarías el estado desde history[newIndex]
    }
  }, [history.length, historyIndex]);

  // Calcular espacio total del piso
  const floorSpace = gondolas.reduce((sum, gondola) => sum + gondola.width * gondola.depth, 0);

  // Obtener góndola seleccionada
  const selectedGondola = gondolas.find((g) => g.id === selectedGondolaId) || null;

  return (
    <div className="w-screen h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Components */}
        <ComponentsPanel />

        {/* Center - Canvas */}
        <CanvasStage
          gondolas={gondolas}
          selectedGondolaId={selectedGondolaId}
          onSelectGondola={handleSelectGondola}
          onGondolaMove={handleGondolaMove}
          onDrop={handleDropComponent}
          zoom={canvasControls.zoom}
          onZoomChange={canvasControls.setZoom}
          stagePos={canvasControls.stagePos}
          onStagePosChange={canvasControls.setStagePos}
        />

        {/* Right Panel - Properties */}
        <PropertiesPanel gondola={selectedGondola} onUpdate={handleUpdateGondola} />
      </div>

      {/* Bottom Bar */}
      <BottomBar
        zoom={canvasControls.zoom}
        cursorX={cursorPos.x}
        cursorY={cursorPos.y}
        floorSpace={floorSpace}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />
    </div>
  );
}
