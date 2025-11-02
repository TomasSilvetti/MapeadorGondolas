'use client';

import { useState, useCallback, useEffect } from 'react';
import { useGondolasStore } from '@/stores/gondolas';
import { useViewModeStore } from '@/stores/view-mode';
import { TopBar } from '@/components/custom/TopBar';
import { ComponentsPanel } from '@/components/custom/ComponentsPanel';
import { CanvasStage } from '@/components/custom/CanvasStage';
import { PropertiesPanel } from '@/components/custom/PropertiesPanel';
import { ResultsPanel } from '@/components/custom/ResultsPanel';
import { ShelfSelector } from '@/components/custom/ShelfSelector';
import { BottomBar } from '@/components/custom/BottomBar';
import { SidebarToggleButton } from '@/components/custom/SidebarToggleButton';
import { SolverConfigModal } from '@/components/custom/SolverConfigModal';
import { useCanvasControls } from '@/hooks/useCanvasControls';
import { Gondola } from '@/types';

export default function MapPage() {
  const gondolas = useGondolasStore((state) => state.gondolas);
  const selectedGondolaId = useGondolasStore((state) => state.selectedGondolaId);
  const addGondola = useGondolasStore((state) => state.addGondola);
  const updateGondola = useGondolasStore((state) => state.updateGondola);
  const selectGondola = useGondolasStore((state) => state.selectGondola);

  const { mode, setMode, selectedShelfId, setSelectedShelfId, hasResults } = useViewModeStore();

  const canvasControls = useCanvasControls();
  const [cursorPos] = useState({ x: 0, y: 0 });
  
  // Estados de visibilidad de sidebars
  const [isComponentsPanelVisible, setIsComponentsPanelVisible] = useState(true);
  const [isPropertiesPanelVisible, setIsPropertiesPanelVisible] = useState(false);
  
  // Estado del modal de configuración del solver
  const [isSolverModalOpen, setIsSolverModalOpen] = useState(false);
  
  // Estado del selector de estantes
  const [isShelfSelectorOpen, setIsShelfSelectorOpen] = useState(false);
  const [shelfSelectorGondola, setShelfSelectorGondola] = useState<Gondola | null>(null);
  
  // Efecto para colapsar ComponentsPanel cuando se entra en modo results
  useEffect(() => {
    if (mode === 'results') {
      setIsComponentsPanelVisible(false);
      setIsPropertiesPanelVisible(false);
    }
  }, [mode]);

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
      
      if (mode === 'results') {
        // En modo results, abrir selector de estantes
        if (id !== null) {
          const gondola = gondolas.find(g => g.id === id);
          if (gondola) {
            setShelfSelectorGondola(gondola);
            setIsShelfSelectorOpen(true);
          }
        }
      } else {
        // En modo design, comportamiento normal
        if (id !== null) {
          setIsPropertiesPanelVisible(true);
        } else {
          setIsPropertiesPanelVisible(false);
        }
      }
    },
    [selectGondola, mode, gondolas]
  );
  
  const handleSelectShelf = useCallback(
    (shelfId: string) => {
      setSelectedShelfId(shelfId);
      setIsPropertiesPanelVisible(true);
    },
    [setSelectedShelfId]
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
      <TopBar 
        onRunSolver={() => setIsSolverModalOpen(true)}
        viewMode={mode}
        hasResults={hasResults}
        onToggleMode={(newMode) => {
          setMode(newMode);
          if (newMode === 'design') {
            setSelectedShelfId(null);
            setIsPropertiesPanelVisible(false);
          }
        }}
        onBackToDesign={() => {
          setMode('design');
          setSelectedShelfId(null);
          setIsPropertiesPanelVisible(false);
        }}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel - Components (solo en modo design) */}
        {mode === 'design' && isComponentsPanelVisible && <ComponentsPanel />}

        {/* Left Toggle Button */}
        {mode === 'design' && !isComponentsPanelVisible && (
          <SidebarToggleButton
            isVisible={isComponentsPanelVisible}
            onToggle={() => setIsComponentsPanelVisible(true)}
            side="left"
          />
        )}

        {/* Center - Canvas */}
        <div className="flex-1 relative">
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
            isComponentsPanelVisible={isComponentsPanelVisible}
            isPropertiesPanelVisible={isPropertiesPanelVisible}
            viewMode={mode}
          />
          
          {/* Toggle buttons dentro del canvas */}
          {mode === 'design' && isComponentsPanelVisible && (
            <SidebarToggleButton
              isVisible={isComponentsPanelVisible}
              onToggle={() => setIsComponentsPanelVisible(false)}
              side="left"
            />
          )}
          
          {isPropertiesPanelVisible && (
            <SidebarToggleButton
              isVisible={isPropertiesPanelVisible}
              onToggle={() => {
                setIsPropertiesPanelVisible(false);
                if (mode === 'results') {
                  setSelectedShelfId(null);
                }
              }}
              side="right"
            />
          )}
        </div>

        {/* Right Panel - Properties o Results según el modo */}
        {isPropertiesPanelVisible && mode === 'design' && (
          <PropertiesPanel gondola={selectedGondola} onUpdate={handleUpdateGondola} />
        )}
        
        {isPropertiesPanelVisible && mode === 'results' && (
          <ResultsPanel gondola={selectedGondola} selectedShelfId={selectedShelfId} />
        )}

        {/* Right Toggle Button */}
        {!isPropertiesPanelVisible && (
          <SidebarToggleButton
            isVisible={isPropertiesPanelVisible}
            onToggle={() => setIsPropertiesPanelVisible(true)}
            side="right"
          />
        )}
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

      {/* Solver Config Modal */}
      <SolverConfigModal
        open={isSolverModalOpen}
        onOpenChange={setIsSolverModalOpen}
      />
      
      {/* Shelf Selector Modal */}
      <ShelfSelector
        open={isShelfSelectorOpen}
        onOpenChange={setIsShelfSelectorOpen}
        gondola={shelfSelectorGondola}
        onSelectShelf={handleSelectShelf}
      />
    </div>
  );
}
