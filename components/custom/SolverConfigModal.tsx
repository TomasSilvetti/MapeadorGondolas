'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, AlertCircle, Upload, FileText, X } from 'lucide-react';
import { useGondolasStore } from '@/stores/gondolas';
import { useProductsStore } from '@/stores/products';
import { useAssignmentsStore } from '@/stores/assignments';
import { useSolverConfigStore } from '@/stores/solver-config';
import { useViewModeStore } from '@/stores/view-mode';
import { solvePlacementILP } from '@/utils/solver-algorithm';
import { parseCSV } from '@/utils/csv-parser';
import { SolverResult } from '@/types';

interface SolverConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SolverConfigModal = ({ open, onOpenChange }: SolverConfigModalProps) => {
  const gondolas = useGondolasStore((state) => state.gondolas);
  const products = useProductsStore((state) => state.products);
  const loadProducts = useProductsStore((state) => state.loadProducts);
  const applyBulkAssignments = useAssignmentsStore((state) => state.applyBulkAssignments);
  const { config, updateConfig } = useSolverConfigStore();
  const { setMode, setHasResults } = useViewModeStore();
  
  // Estado local para los pesos
  const [marginWeight, setMarginWeight] = useState(config.marginWeight * 100);
  const [salesWeight, setSalesWeight] = useState(config.salesWeight * 100);
  
  // Estado local para parámetros MILP
  const [diversidadMinima, setDiversidadMinima] = useState(config.diversidadMinima * 100);
  const [maxFacings, setMaxFacings] = useState(config.maxFacingsPorProducto);
  const [minFacings, setMinFacings] = useState(config.minFacingsPorProducto);
  
  // Estados de ejecución
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<SolverResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para CSV
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isLoadingCSV, setIsLoadingCSV] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [loadedProductsCount, setLoadedProductsCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar con el store cuando se abre el modal
  useEffect(() => {
    if (open) {
      setMarginWeight(config.marginWeight * 100);
      setSalesWeight(config.salesWeight * 100);
      setDiversidadMinima(config.diversidadMinima * 100);
      setMaxFacings(config.maxFacingsPorProducto);
      setMinFacings(config.minFacingsPorProducto);
      setResult(null);
      setError(null);
      setCsvFile(null);
      setCsvError(null);
      setLoadedProductsCount(products.length);
    }
  }, [open, config, products.length]);

  const handleSliderChange = (value: number[]) => {
    const newMarginWeight = value[0];
    const newSalesWeight = 100 - newMarginWeight;
    setMarginWeight(newMarginWeight);
    setSalesWeight(newSalesWeight);
  };

  const handleFileUpload = async (file: File) => {
    // Validar que sea un archivo CSV
    if (!file.name.endsWith('.csv')) {
      setCsvError('El archivo debe ser un CSV (.csv)');
      return;
    }

    setIsLoadingCSV(true);
    setCsvError(null);

    try {
      const parsedProducts = await parseCSV(file);
      
      if (parsedProducts.length === 0) {
        setCsvError('El archivo CSV no contiene productos válidos');
        setIsLoadingCSV(false);
        return;
      }

      // Reemplazar productos en el store
      loadProducts(parsedProducts);
      setCsvFile(file);
      setLoadedProductsCount(parsedProducts.length);
      setCsvError(null);
    } catch (err: any) {
      setCsvError(err.message || 'Error al procesar el archivo CSV');
      setCsvFile(null);
      setLoadedProductsCount(0);
    } finally {
      setIsLoadingCSV(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleClearFile = () => {
    setCsvFile(null);
    setCsvError(null);
    setLoadedProductsCount(0);
    loadProducts([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleExecuteOptimization = async () => {
    console.log('🎯 [Modal] Iniciando ejecución de optimización...');
    
    // Validaciones
    if (gondolas.length === 0) {
      const errorMsg = 'No hay góndolas en el canvas. Arrastra góndolas desde el panel lateral para comenzar.';
      console.error('❌ [Modal]', errorMsg);
      setError(errorMsg);
      return;
    }
    
    if (products.length === 0) {
      const errorMsg = 'Debe cargar un archivo CSV con productos antes de ejecutar la optimización.';
      console.error('❌ [Modal]', errorMsg);
      setError(errorMsg);
      return;
    }
    
    // Validar que las góndolas tengan estantes
    const totalShelves = gondolas.reduce((sum, g) => sum + (g.estantes?.length || 0), 0);
    if (totalShelves === 0) {
      const errorMsg = 'Las góndolas no tienen estantes configurados. Configura los estantes en el panel de propiedades.';
      console.error('❌ [Modal]', errorMsg);
      setError(errorMsg);
      return;
    }
    
    console.log('✅ [Modal] Validaciones pasadas');
    console.log('📊 [Modal] Góndolas:', gondolas.length, '| Estantes:', totalShelves, '| Productos:', products.length);
    
    // Guardar configuración
    const newConfig = {
      marginWeight: marginWeight / 100,
      salesWeight: salesWeight / 100,
      maxExecutionTime: config.maxExecutionTime || 30,
      diversidadMinima: diversidadMinima / 100,
      maxFacingsPorProducto: maxFacings,
      minFacingsPorProducto: minFacings,
    };
    updateConfig(newConfig);
    console.log('⚙️ [Modal] Configuración actualizada:', newConfig);
    
    // Ejecutar solver
    setIsExecuting(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('🚀 [Modal] Llamando a solvePlacementILP...');
      const solverResult = await solvePlacementILP(products, gondolas, newConfig);
      console.log('📥 [Modal] Resultado recibido:', solverResult);
      
      setResult(solverResult);
      
      if (solverResult.status === 'error' || solverResult.status === 'infeasible') {
        console.error('❌ [Modal] Error en resultado:', solverResult.message);
        setError(solverResult.message || 'No se encontró solución');
      } else {
        console.log('✅ [Modal] Optimización exitosa');
      }
    } catch (err: any) {
      console.error('❌ [Modal] Error capturado:', err);
      console.error('📍 [Modal] Stack:', err.stack);
      setError(err.message || 'Error al ejecutar el solver');
      setResult(null);
    } finally {
      setIsExecuting(false);
      console.log('🏁 [Modal] Ejecución finalizada');
    }
  };

  const handleViewResults = () => {
    if (!result || result.assignments.length === 0) return;
    
    // Aplicar asignaciones
    applyBulkAssignments(result.assignments);
    
    // Cambiar a modo results
    setMode('results');
    setHasResults(true);
    
    // Cerrar modal
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Restaurar valores originales
    setMarginWeight(config.marginWeight * 100);
    setSalesWeight(config.salesWeight * 100);
    setDiversidadMinima(config.diversidadMinima * 100);
    setMaxFacings(config.maxFacingsPorProducto);
    setMinFacings(config.minFacingsPorProducto);
    setResult(null);
    setError(null);
    onOpenChange(false);
  };

  const getStatusIcon = () => {
    if (!result) return null;
    
    switch (result.status) {
      case 'optimal':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'feasible':
        return <CheckCircle2 className="w-5 h-5 text-yellow-500" />;
      case 'infeasible':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    if (!result) return '';
    
    switch (result.status) {
      case 'optimal':
        return 'Solución Óptima';
      case 'feasible':
        return 'Solución Factible';
      case 'infeasible':
        return 'Sin Solución';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-100">
            Optimizador de Layout
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Configura los parámetros y ejecuta el algoritmo de optimización
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sección de Carga de CSV */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Carga de Productos
            </h3>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            {!csvFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-all duration-200
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
                  }
                  ${isLoadingCSV ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isLoadingCSV ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-sm text-slate-300">Cargando productos...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-12 h-12 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Arrastra y suelta tu archivo CSV aquí
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        o haz clic para seleccionar un archivo
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
                      Solo archivos .csv
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <FileText className="w-5 h-5 text-green-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {csvFile.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {loadedProductsCount} productos cargados
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFile}
                    disabled={isExecuting}
                    className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {csvError && (
              <div className="mt-3 bg-red-900/20 border border-red-700 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-300">{csvError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sección de Parámetros del Algoritmo */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Parámetros del Algoritmo
            </h3>
            
            <div className="space-y-4">
              {/* Inputs de porcentajes */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Peso del Margen de Ganancia
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={Math.round(marginWeight)}
                      readOnly
                      disabled={isExecuting}
                      className="bg-slate-800 border-slate-600 text-slate-100 text-center font-semibold"
                    />
                    <span className="text-slate-300 font-medium">%</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Peso de las Ventas
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={Math.round(salesWeight)}
                      readOnly
                      disabled={isExecuting}
                      className="bg-slate-800 border-slate-600 text-slate-100 text-center font-semibold"
                    />
                    <span className="text-slate-300 font-medium">%</span>
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="pt-2">
                <Slider
                  value={[marginWeight]}
                  onValueChange={handleSliderChange}
                  min={0}
                  max={100}
                  step={1}
                  disabled={isExecuting}
                  className="w-full"
                />
              </div>
              
              <p className="text-xs text-slate-400">
                Ajusta el balance entre maximizar margen de ganancia vs ventas mensuales de productos
              </p>

              {/* Separador */}
              <div className="border-t border-slate-700 my-4"></div>

              {/* Parámetros MILP */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-200">Restricciones MILP</h4>
                
                {/* Diversidad Mínima */}
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Diversidad Mínima por Estante: {Math.round(diversidadMinima)}%
                  </label>
                  <Slider
                    value={[diversidadMinima]}
                    onValueChange={(value) => setDiversidadMinima(value[0])}
                    min={0}
                    max={100}
                    step={5}
                    disabled={isExecuting}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Porcentaje mínimo de productos diferentes por estante (recomendado: 60-80%)
                  </p>
                </div>

                {/* Máximo y Mínimo Facings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">
                      Máximo Facings por Producto
                    </label>
                    <Input
                      type="number"
                      value={maxFacings}
                      onChange={(e) => setMaxFacings(Math.max(1, parseInt(e.target.value) || 1))}
                      min={1}
                      max={10}
                      disabled={isExecuting}
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Recomendado: 2-3
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">
                      Mínimo Facings por Producto
                    </label>
                    <Input
                      type="number"
                      value={minFacings}
                      onChange={(e) => setMinFacings(Math.max(1, Math.min(maxFacings, parseInt(e.target.value) || 1)))}
                      min={1}
                      max={maxFacings}
                      disabled={isExecuting}
                      className="bg-slate-800 border-slate-600 text-slate-100"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Si se asigna
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Canvas */}
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold text-slate-200">Estado Actual</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Góndolas:</span>
                <span className="ml-2 font-semibold text-slate-100">{gondolas.length}</span>
              </div>
              <div>
                <span className="text-slate-400">Productos:</span>
                <span className="ml-2 font-semibold text-slate-100">{products.length}</span>
              </div>
              <div>
                <span className="text-slate-400">Espacios disponibles:</span>
                <span className="ml-2 font-semibold text-slate-100">
                  {gondolas.reduce((sum, g) => 
                    sum + (g.estantes?.reduce((s, e) => s + e.cantidadEspacios, 0) || 0), 0
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Resultados */}
          {result && (
            <div className={`rounded-lg p-4 border ${
              result.status === 'optimal' || result.status === 'feasible'
                ? 'bg-green-900/20 border-green-700'
                : 'bg-red-900/20 border-red-700'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {getStatusIcon()}
                <h4 className="text-sm font-semibold text-slate-100">{getStatusText()}</h4>
              </div>
              
              {result.message && (
                <p className="text-sm text-slate-300 mb-3">{result.message}</p>
              )}
              
              {(result.status === 'optimal' || result.status === 'feasible') && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Productos asignados:</span>
                    <span className="font-semibold text-slate-100">
                      {result.assignments.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Productos sin asignar:</span>
                    <span className="font-semibold text-slate-100">
                      {result.productosNoAsignados.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ganancia total esperada:</span>
                    <span className="font-semibold text-green-400">
                      ${result.totalGanancia.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tiempo de ejecución:</span>
                    <span className="font-semibold text-slate-100">
                      {result.tiempoEjecucion.toFixed(2)}s
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-300 mb-1">Error al ejecutar el solver</p>
                  <p className="text-sm text-red-200">{error}</p>
                  <p className="text-xs text-red-400 mt-2">
                    💡 Consejo: Abre la consola del navegador (F12) para ver más detalles técnicos del error.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {isExecuting && (
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    Ejecutando optimización...
                  </p>
                  <p className="text-xs text-slate-400">
                    Esto puede tomar varios segundos
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isExecuting}
            className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
          >
            {result ? 'Cerrar' : 'Cancelar'}
          </Button>
          
          {result && (result.status === 'optimal' || result.status === 'feasible') && (
            <Button
              onClick={handleViewResults}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Ver Resultados en Canvas
            </Button>
          )}
          
          {!result && (
            <Button
              onClick={handleExecuteOptimization}
              disabled={isExecuting || gondolas.length === 0 || products.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ejecutando...
                </>
              ) : (
                'Ejecutar Optimización'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
