'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGondolasStore } from '@/stores/gondolas';
import { useProductsStore } from '@/stores/products';
import { useAssignmentsStore } from '@/stores/assignments';
import { useSolverConfigStore } from '@/stores/solver-config';
import { useProjectsStore } from '@/stores/projects';
import { useViewModeStore } from '@/stores/view-mode';
import { TopBar } from '@/components/custom/TopBar';
import { ComponentsPanel } from '@/components/custom/ComponentsPanel';
import { CanvasStage } from '@/components/custom/CanvasStage';
import { PropertiesPanel } from '@/components/custom/PropertiesPanel';
import { ShelfDetailsModal } from '@/components/custom/ShelfDetailsModal';
import { BottomBar } from '@/components/custom/BottomBar';
import { SidebarToggleButton } from '@/components/custom/SidebarToggleButton';
import { SolverConfigModal } from '@/components/custom/SolverConfigModal';
import { useCanvasControls } from '@/hooks/useCanvasControls';
import { Gondola } from '@/types';

export default function MapPage() {
  const router = useRouter();
  
  // Stores
  const gondolas = useGondolasStore((state) => state.gondolas);
  const selectedGondolaId = useGondolasStore((state) => state.selectedGondolaId);
  const addGondola = useGondolasStore((state) => state.addGondola);
  const updateGondola = useGondolasStore((state) => state.updateGondola);
  const deleteGondola = useGondolasStore((state) => state.deleteGondola);
  const selectGondola = useGondolasStore((state) => state.selectGondola);
  const clearGondolas = useGondolasStore((state) => state.clearGondolas);

  const products = useProductsStore((state) => state.products);
  const loadProducts = useProductsStore((state) => state.loadProducts);
  const clearProducts = useProductsStore((state) => state.clearProducts);
  
  const assignments = useAssignmentsStore((state) => state.assignments);
  const applyBulkAssignments = useAssignmentsStore((state) => state.applyBulkAssignments);
  const clearAssignments = useAssignmentsStore((state) => state.clearAssignments);
  
  const solverConfig = useSolverConfigStore((state) => state.config);
  const updateSolverConfig = useSolverConfigStore((state) => state.updateConfig);
  
  const activeProjectId = useProjectsStore((state) => state.activeProjectId);
  const getActiveProject = useProjectsStore((state) => state.getActiveProject);
  const updateProject = useProjectsStore((state) => state.updateProject);
  const loadProjects = useProjectsStore((state) => state.loadProjects);

  const { mode, setMode, selectedShelfId, setSelectedShelfId, hasResults } = useViewModeStore();

  // Estado para controlar si ya se cargó el proyecto
  const [projectLoaded, setProjectLoaded] = useState(false);

  // Cargar proyecto activo al montar
  useEffect(() => {
    if (projectLoaded) return;

    // Limpiar stores antes de cargar
    clearGondolas();
    clearProducts();
    clearAssignments();

    loadProjects();
    const activeProject = getActiveProject();
    
    if (!activeProject) {
      // Si no hay proyecto activo, redirigir a la página principal
      router.push('/');
      return;
    }

    // Cargar datos del proyecto en los stores solo si hay datos
    if (activeProject.gondolas.length > 0) {
      // Cargar góndolas
      activeProject.gondolas.forEach((gondola) => {
        addGondola(gondola);
      });
    }
    
    if (activeProject.products.length > 0) {
      loadProducts(activeProject.products);
    }
    
    if (activeProject.assignments.length > 0) {
      applyBulkAssignments(activeProject.assignments);
    }
    
    if (activeProject.solverConfig) {
      updateSolverConfig(activeProject.solverConfig);
    }

    setProjectLoaded(true);
  }, [projectLoaded, clearGondolas, clearProducts, clearAssignments, loadProjects, getActiveProject, router, addGondola, loadProducts, applyBulkAssignments, updateSolverConfig]);

  // Sincronizar cambios con el proyecto activo
  useEffect(() => {
    if (!activeProjectId) return;

    const syncTimeout = setTimeout(() => {
      updateProject(activeProjectId, {
        gondolas,
        products,
        assignments,
        solverConfig,
        cantidadGondolas: gondolas.length,
        cantidadProductos: products.length,
      });
    }, 1000); // Debounce de 1 segundo

    return () => clearTimeout(syncTimeout);
  }, [gondolas, products, assignments, solverConfig, activeProjectId, updateProject]);

  const canvasControls = useCanvasControls();
  const [cursorPos] = useState({ x: 0, y: 0 });
  
  // Estados de visibilidad de sidebars
  const [isComponentsPanelVisible, setIsComponentsPanelVisible] = useState(true);
  const [isPropertiesPanelVisible, setIsPropertiesPanelVisible] = useState(false);
  
  // Estado del modal de configuración del solver
  const [isSolverModalOpen, setIsSolverModalOpen] = useState(false);
  
  // Estado del modal de detalles de estante
  const [isShelfModalOpen, setIsShelfModalOpen] = useState(false);
  
  // Efecto para manejar la transición a modo results
  useEffect(() => {
    if (mode === 'results') {
      setIsComponentsPanelVisible(false);
      setIsPropertiesPanelVisible(false);
    } else {
      // Al volver a modo design, resetear el estado
      setIsPropertiesPanelVisible(false);
      setIsShelfModalOpen(false);
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
        // En modo results, abrir el modal si hay una góndola seleccionada
        if (id !== null) {
          setIsShelfModalOpen(true);
          // Limpiar selección de estante para que el usuario seleccione uno nuevo
          setSelectedShelfId(null);
        } else {
          setIsShelfModalOpen(false);
          setSelectedShelfId(null);
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
    [selectGondola, mode, setSelectedShelfId]
  );
  
  const handleSelectShelf = useCallback(
    (shelfId: string | null) => {
      setSelectedShelfId(shelfId);
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

  const handleDeleteGondola = useCallback(
    (id: string) => {
      deleteGondola(id);
      const filteredGondolas = gondolas.filter((g) => g.id !== id);
      addToHistory(filteredGondolas);
      setIsPropertiesPanelVisible(false);
    },
    [gondolas, deleteGondola, addToHistory]
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
            onGondolaDelete={handleDeleteGondola}
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
          
          {/* Toggle button para cerrar el panel derecho - solo en modo design */}
          {mode === 'design' && isPropertiesPanelVisible && (
            <SidebarToggleButton
              isVisible={isPropertiesPanelVisible}
              onToggle={() => {
                setIsPropertiesPanelVisible(false);
              }}
              side="right"
            />
          )}
        </div>

        {/* Right Panel - Properties solo en modo design */}
        {isPropertiesPanelVisible && mode === 'design' && (
          <PropertiesPanel gondola={selectedGondola} onUpdate={handleUpdateGondola} />
        )}

        {/* Right Toggle Button - solo en modo design */}
        {mode === 'design' && !isPropertiesPanelVisible && (
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

      {/* Shelf Details Modal - solo en modo results */}
      {mode === 'results' && (
        <ShelfDetailsModal
          open={isShelfModalOpen}
          onOpenChange={setIsShelfModalOpen}
          gondola={selectedGondola}
          selectedShelfId={selectedShelfId}
          onShelfSelect={handleSelectShelf}
        />
      )}
    </div>
  );
}
