'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  ChevronDown, 
  ChevronUp,
  Lightbulb,
  FileSpreadsheet,
  Grid3x3,
  Settings,
  Package,
  Wand2,
  Save,
  Info
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface WelcomeSectionProps {
  hasProjects: boolean;
}

export function WelcomeSection({ hasProjects }: WelcomeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(!hasProjects);

  const handleDownloadCSV = () => {
    const link = document.createElement('a');
    link.href = '/productos-prueba.csv';
    link.download = 'productos-prueba.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Si hay proyectos, mostrar versión compacta colapsable
  if (hasProjects) {
    return (
      <div className="mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader 
            className="cursor-pointer hover:bg-slate-750 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600/20 p-2 rounded-lg">
                  <Info className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-slate-100 text-lg">
                    Guía de Uso del Mapeador de Góndolas
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Tutorial completo y archivo CSV de ejemplo
                  </CardDescription>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </CardHeader>
          {isExpanded && (
            <CardContent>
              <WelcomeContent onDownloadCSV={handleDownloadCSV} />
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  // Si no hay proyectos, mostrar versión expandida prominente
  return (
    <div className="mb-12">
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-100 text-2xl">
                Bienvenido al Mapeador de Góndolas
              </CardTitle>
              <CardDescription className="text-slate-300 text-base mt-1">
                Optimiza la disposición de productos en tus góndolas de manera inteligente
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <WelcomeContent onDownloadCSV={handleDownloadCSV} />
        </CardContent>
      </Card>
    </div>
  );
}

interface WelcomeContentProps {
  onDownloadCSV: () => void;
}

function WelcomeContent({ onDownloadCSV }: WelcomeContentProps) {
  return (
    <div className="space-y-6">
      {/* Descripción del proyecto */}
      <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-400" />
          ¿Qué es el Mapeador de Góndolas?
        </h3>
        <p className="text-slate-300 leading-relaxed mb-3">
          El Mapeador de Góndolas es una herramienta profesional diseñada para optimizar la disposición 
          de productos en góndolas de supermercados y comercios. Permite crear layouts visuales, 
          configurar estantes con precisión y utilizar algoritmos inteligentes para maximizar ventas, 
          rentabilidad y aprovechamiento del espacio.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <div className="bg-slate-800/50 rounded p-3 border border-slate-700/50">
            <p className="text-sm text-slate-400">✓ Diseño visual intuitivo</p>
          </div>
          <div className="bg-slate-800/50 rounded p-3 border border-slate-700/50">
            <p className="text-sm text-slate-400">✓ Optimización automática</p>
          </div>
          <div className="bg-slate-800/50 rounded p-3 border border-slate-700/50">
            <p className="text-sm text-slate-400">✓ Exportación de proyectos</p>
          </div>
        </div>
      </div>

      {/* Botón de descarga destacado */}
      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-5 border border-green-700/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-400" />
              Archivo CSV de Ejemplo
            </h3>
            <p className="text-slate-300 text-sm mb-3">
              Descarga nuestro archivo CSV de prueba con 50 productos de ejemplo. 
              Incluye todas las columnas necesarias: id, nombre, precio, margen de ganancia, 
              ventas, categoría y stock. Úsalo para probar la aplicación sin necesidad de crear tu propio archivo.
            </p>
            <p className="text-slate-400 text-xs">
              Formato: CSV con encabezados | Tamaño: ~2KB | Productos: 50
            </p>
          </div>
          <Button
            onClick={onDownloadCSV}
            className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Descargar CSV
          </Button>
        </div>
      </div>

      {/* Guía paso a paso */}
      <div>
        <h3 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-400" />
          Guía Paso a Paso
        </h3>
        
        <Accordion type="single" collapsible className="space-y-3">
          {/* Paso 1 */}
          <AccordionItem value="step-1" className="bg-slate-800/50 border border-slate-700 rounded-lg px-4">
            <AccordionTrigger className="text-slate-100 hover:text-slate-200 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <span className="font-semibold">Crear un Nuevo Proyecto</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-slate-300 pt-4 pb-4 pl-11">
              <p className="mb-3">
                Haz clic en el botón <strong className="text-blue-400">"Crear Primer Proyecto"</strong> o 
                en el botón flotante <strong className="text-blue-400">+</strong> (si ya tienes proyectos).
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Ingresa un nombre descriptivo para tu proyecto (ej: "Góndola Bebidas Enero 2025")</li>
                <li>El proyecto se guardará automáticamente en tu navegador</li>
                <li>Podrás editarlo, exportarlo o eliminarlo en cualquier momento</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Paso 2 */}
          <AccordionItem value="step-2" className="bg-slate-800/50 border border-slate-700 rounded-lg px-4">
            <AccordionTrigger className="text-slate-100 hover:text-slate-200 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <span className="font-semibold">Importar Productos desde CSV</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-slate-300 pt-4 pb-4 pl-11">
              <p className="mb-3">
                Una vez dentro del proyecto, ve a la pestaña <strong className="text-green-400">"Productos"</strong> 
                y haz clic en <strong className="text-green-400">"Importar CSV"</strong>.
              </p>
              <div className="bg-slate-900/50 rounded p-4 mb-3 border border-slate-700/50">
                <p className="text-sm font-semibold text-slate-200 mb-2">Columnas requeridas en el CSV:</p>
                <ul className="space-y-1 text-sm">
                  <li><code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300">id</code> - Identificador único del producto (número)</li>
                  <li><code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300">nombre</code> - Nombre descriptivo del producto</li>
                  <li><code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300">precio</code> - Precio de venta (número decimal)</li>
                  <li><code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300">margen_ganancia</code> - Margen en decimal (ej: 0.35 = 35%)</li>
                  <li><code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300">ventas</code> - Unidades vendidas en el período</li>
                  <li><code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300">categoria</code> - Categoría del producto (texto)</li>
                  <li><code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300">stock</code> - Cantidad disponible en inventario</li>
                </ul>
              </div>
              <p className="text-sm text-slate-400">
                💡 <strong>Tip:</strong> Descarga el CSV de ejemplo arriba para ver el formato correcto.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Paso 3 */}
          <AccordionItem value="step-3" className="bg-slate-800/50 border border-slate-700 rounded-lg px-4">
            <AccordionTrigger className="text-slate-100 hover:text-slate-200 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  3
                </div>
                <span className="font-semibold">Crear Góndolas en el Canvas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-slate-300 pt-4 pb-4 pl-11">
              <p className="mb-3">
                Ve a la pestaña <strong className="text-purple-400">"Mapa"</strong> para acceder al canvas de diseño.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm mb-3">
                <li>Arrastra componentes desde el panel lateral izquierdo al canvas</li>
                <li>Puedes agregar múltiples góndolas y organizarlas libremente</li>
                <li>Usa las herramientas de zoom (+/-) y pan (arrastra el canvas) para navegar</li>
                <li>Cada góndola puede tener configuraciones independientes</li>
              </ul>
              <div className="bg-blue-900/20 border border-blue-700/50 rounded p-3 text-sm">
                <p className="text-blue-300">
                  <strong>Nota:</strong> Las góndolas se representan visualmente en el canvas. 
                  Puedes moverlas, redimensionarlas y organizarlas según el layout de tu tienda.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Paso 4 - El más detallado */}
          <AccordionItem value="step-4" className="bg-slate-800/50 border border-slate-700 rounded-lg px-4">
            <AccordionTrigger className="text-slate-100 hover:text-slate-200 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  4
                </div>
                <span className="font-semibold">Configurar Estantes (Detallado)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-slate-300 pt-4 pb-4 pl-11">
              <p className="mb-4">
                Selecciona una góndola en el canvas para abrir el panel de propiedades a la derecha. 
                Aquí configurarás las características físicas de los estantes:
              </p>

              <div className="space-y-4">
                {/* Cantidad de estantes */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
                    <Grid3x3 className="w-4 h-4 text-blue-400" />
                    Cantidad de Estantes
                  </h4>
                  <p className="text-sm mb-2">
                    Define cuántos niveles horizontales tendrá tu góndola (de arriba hacia abajo).
                  </p>
                  <ul className="text-sm space-y-1 text-slate-400">
                    <li>• <strong className="text-slate-300">Mínimo:</strong> 1 estante</li>
                    <li>• <strong className="text-slate-300">Máximo:</strong> 10 estantes</li>
                    <li>• <strong className="text-slate-300">Recomendado:</strong> 4-6 estantes para góndolas estándar</li>
                    <li>• <strong className="text-slate-300">Uso:</strong> Más estantes = más capacidad, pero productos superiores menos accesibles</li>
                  </ul>
                </div>

                {/* Altura de estantes */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-green-400" />
                    Altura de Estantes (cm)
                  </h4>
                  <p className="text-sm mb-2">
                    Espacio vertical disponible en cada nivel para colocar productos. Se mide en centímetros.
                  </p>
                  <ul className="text-sm space-y-1 text-slate-400">
                    <li>• <strong className="text-slate-300">Rango típico:</strong> 20-50 cm</li>
                    <li>• <strong className="text-slate-300">Productos pequeños:</strong> 20-30 cm (latas, paquetes pequeños)</li>
                    <li>• <strong className="text-slate-300">Productos medianos:</strong> 30-40 cm (botellas, cajas)</li>
                    <li>• <strong className="text-slate-300">Productos grandes:</strong> 40-50 cm (botellas grandes, productos voluminosos)</li>
                    <li>• <strong className="text-slate-300">Consideración:</strong> Deja espacio extra para facilitar la toma del producto</li>
                  </ul>
                </div>

                {/* Ancho de góndola */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-yellow-400" />
                    Ancho de Góndola (cm)
                  </h4>
                  <p className="text-sm mb-2">
                    Espacio horizontal total disponible en cada estante. Determina cuántos productos caben lado a lado.
                  </p>
                  <ul className="text-sm space-y-1 text-slate-400">
                    <li>• <strong className="text-slate-300">Góndola pequeña:</strong> 80-120 cm</li>
                    <li>• <strong className="text-slate-300">Góndola estándar:</strong> 120-180 cm</li>
                    <li>• <strong className="text-slate-300">Góndola grande:</strong> 180-250 cm</li>
                    <li>• <strong className="text-slate-300">Impacto:</strong> Mayor ancho = más productos visibles = más ventas potenciales</li>
                    <li>• <strong className="text-slate-300">Tip:</strong> Mide tu góndola física para mayor precisión</li>
                  </ul>
                </div>

                {/* Profundidad */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-purple-400" />
                    Profundidad (cm)
                  </h4>
                  <p className="text-sm mb-2">
                    Espacio hacia atrás del estante. Permite colocar productos en fila (uno detrás de otro).
                  </p>
                  <ul className="text-sm space-y-1 text-slate-400">
                    <li>• <strong className="text-slate-300">Estante poco profundo:</strong> 30-40 cm</li>
                    <li>• <strong className="text-slate-300">Estante estándar:</strong> 40-60 cm</li>
                    <li>• <strong className="text-slate-300">Estante profundo:</strong> 60-80 cm</li>
                    <li>• <strong className="text-slate-300">Ventaja:</strong> Mayor profundidad = más stock visible sin reponer constantemente</li>
                    <li>• <strong className="text-slate-300">Desventaja:</strong> Productos al fondo menos accesibles</li>
                  </ul>
                </div>

                {/* Capacidad de peso */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4 text-red-400" />
                    Capacidad de Peso (kg)
                  </h4>
                  <p className="text-sm mb-2">
                    Peso máximo que puede soportar cada estante de forma segura. Importante para productos pesados.
                  </p>
                  <ul className="text-sm space-y-1 text-slate-400">
                    <li>• <strong className="text-slate-300">Estante ligero:</strong> 20-50 kg (productos pequeños, snacks)</li>
                    <li>• <strong className="text-slate-300">Estante medio:</strong> 50-100 kg (bebidas, enlatados)</li>
                    <li>• <strong className="text-slate-300">Estante reforzado:</strong> 100-200 kg (productos muy pesados)</li>
                    <li>• <strong className="text-slate-300">Seguridad:</strong> El sistema alertará si excedes la capacidad</li>
                    <li>• <strong className="text-slate-300">Recomendación:</strong> Productos pesados en estantes inferiores</li>
                  </ul>
                </div>

                {/* Orientación de productos */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-orange-400" />
                    Orientación de Productos
                  </h4>
                  <p className="text-sm mb-2">
                    Define cómo se colocarán los productos en el estante: de pie o acostados.
                  </p>
                  <div className="space-y-3 mt-3">
                    <div className="bg-slate-800/50 rounded p-3 border-l-4 border-blue-500">
                      <p className="text-sm font-semibold text-slate-200 mb-1">Vertical (De pie)</p>
                      <ul className="text-xs space-y-1 text-slate-400">
                        <li>• Botellas, latas, cajas de cereales</li>
                        <li>• Mejor visibilidad de etiquetas frontales</li>
                        <li>• Aprovecha mejor la altura del estante</li>
                        <li>• Ideal para productos con marca visible al frente</li>
                      </ul>
                    </div>
                    <div className="bg-slate-800/50 rounded p-3 border-l-4 border-green-500">
                      <p className="text-sm font-semibold text-slate-200 mb-1">Horizontal (Acostados)</p>
                      <ul className="text-xs space-y-1 text-slate-400">
                        <li>• Productos planos, paquetes, bolsas</li>
                        <li>• Aprovecha mejor el ancho del estante</li>
                        <li>• Más estable para productos irregulares</li>
                        <li>• Útil para productos con etiqueta superior</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-amber-900/20 border border-amber-700/50 rounded p-4">
                <p className="text-amber-300 text-sm">
                  <strong>💡 Consejo profesional:</strong> Configura diferentes góndolas con distintas 
                  configuraciones según el tipo de productos. Por ejemplo: góndolas con estantes más altos 
                  para bebidas grandes, y estantes más bajos y numerosos para productos pequeños.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Paso 5 */}
          <AccordionItem value="step-5" className="bg-slate-800/50 border border-slate-700 rounded-lg px-4">
            <AccordionTrigger className="text-slate-100 hover:text-slate-200 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  5
                </div>
                <span className="font-semibold">Asignar Productos a Estantes</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-slate-300 pt-4 pb-4 pl-11">
              <p className="mb-3">
                Con las góndolas configuradas, es momento de asignar productos manualmente o usar el solver automático.
              </p>
              
              <div className="space-y-3">
                <div className="bg-slate-900/50 rounded p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-2">Asignación Manual</h4>
                  <ul className="text-sm space-y-1 text-slate-400">
                    <li>• Haz clic en un estante de la góndola</li>
                    <li>• Selecciona productos de la lista</li>
                    <li>• Define cuántas unidades (facings) mostrar de cada producto</li>
                    <li>• Organiza según tu criterio comercial</li>
                  </ul>
                </div>

                <div className="bg-slate-900/50 rounded p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-2">Facings (Frentes)</h4>
                  <p className="text-sm text-slate-400 mb-2">
                    Los "facings" son la cantidad de unidades del mismo producto que se muestran lado a lado.
                  </p>
                  <ul className="text-sm space-y-1 text-slate-400">
                    <li>• <strong className="text-slate-300">1-2 facings:</strong> Productos de baja rotación</li>
                    <li>• <strong className="text-slate-300">3-4 facings:</strong> Productos de rotación media</li>
                    <li>• <strong className="text-slate-300">5+ facings:</strong> Productos estrella o promociones</li>
                    <li>• <strong className="text-slate-300">Regla de oro:</strong> Más facings = más ventas (hasta cierto punto)</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Paso 6 */}
          <AccordionItem value="step-6" className="bg-slate-800/50 border border-slate-700 rounded-lg px-4">
            <AccordionTrigger className="text-slate-100 hover:text-slate-200 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  6
                </div>
                <span className="font-semibold">Usar el Solver Automático</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-slate-300 pt-4 pb-4 pl-11">
              <p className="mb-3">
                El solver es un algoritmo inteligente que optimiza automáticamente la distribución de productos.
              </p>

              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-700/50 mb-4">
                <div className="flex items-start gap-3">
                  <Wand2 className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-100 mb-2">¿Cómo funciona?</h4>
                    <p className="text-sm text-slate-300 mb-3">
                      El solver analiza múltiples factores para crear la distribución óptima:
                    </p>
                    <ul className="text-sm space-y-1 text-slate-400">
                      <li>• Maximiza ventas totales</li>
                      <li>• Optimiza márgenes de ganancia</li>
                      <li>• Respeta restricciones físicas (espacio, peso)</li>
                      <li>• Agrupa productos por categoría</li>
                      <li>• Considera el stock disponible</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-900/50 rounded p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-2">Configuración del Solver</h4>
                  <p className="text-sm mb-2 text-slate-400">
                    Haz clic en el botón "Configurar Solver" para ajustar los parámetros:
                  </p>
                  <ul className="text-sm space-y-1 text-slate-400">
                    <li>• <strong className="text-slate-300">Objetivo:</strong> Maximizar ventas, ganancias o balance</li>
                    <li>• <strong className="text-slate-300">Restricciones:</strong> Espacio, peso, categorías</li>
                    <li>• <strong className="text-slate-300">Prioridades:</strong> Qué productos favorcer</li>
                  </ul>
                </div>

                <div className="bg-slate-900/50 rounded p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-2">Ejecutar Optimización</h4>
                  <p className="text-sm text-slate-400">
                    Una vez configurado, haz clic en "Ejecutar Solver". El algoritmo procesará los datos 
                    y generará la distribución óptima en segundos. Puedes aceptar la solución o ajustarla manualmente.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Paso 7 */}
          <AccordionItem value="step-7" className="bg-slate-800/50 border border-slate-700 rounded-lg px-4">
            <AccordionTrigger className="text-slate-100 hover:text-slate-200 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  7
                </div>
                <span className="font-semibold">Exportar y Guardar el Proyecto</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-slate-300 pt-4 pb-4 pl-11">
              <p className="mb-3">
                Una vez satisfecho con tu diseño, puedes exportar y compartir tu proyecto.
              </p>

              <div className="space-y-3">
                <div className="bg-slate-900/50 rounded p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
                    <Save className="w-4 h-4 text-green-400" />
                    Guardado Automático
                  </h4>
                  <p className="text-sm text-slate-400">
                    El proyecto se guarda automáticamente en tu navegador (LocalStorage). 
                    No necesitas hacer nada especial, tus cambios se preservan al cerrar y reabrir la aplicación.
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-2">Exportar Proyecto</h4>
                  <ul className="text-sm space-y-2 text-slate-400">
                    <li>• Haz clic en "Exportar Proyecto" en el menú superior</li>
                    <li>• Se descargará un archivo <code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300">.map</code></li>
                    <li>• Este archivo contiene toda la configuración: góndolas, productos, asignaciones</li>
                    <li>• Compártelo con colegas o úsalo como respaldo</li>
                  </ul>
                </div>

                <div className="bg-slate-900/50 rounded p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-2">Importar Proyecto</h4>
                  <p className="text-sm text-slate-400">
                    Para abrir un proyecto exportado, simplemente arrastra el archivo <code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300">.map</code> a 
                    la página inicial o usa el botón "Importar Proyecto". Si ya existe un proyecto con el mismo 
                    nombre, podrás elegir si reemplazarlo o crear uno nuevo.
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-green-900/20 border border-green-700/50 rounded p-4">
                <p className="text-green-300 text-sm">
                  <strong>✓ ¡Listo!</strong> Ya tienes todas las herramientas para crear layouts profesionales 
                  de góndolas. Experimenta con diferentes configuraciones y usa el solver para descubrir 
                  oportunidades de optimización.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Recursos adicionales */}
      <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-3">
          Recursos Adicionales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-blue-400">📊</span>
            <p className="text-slate-300">
              <strong>Reportes:</strong> Accede a la pestaña "Reportes" para ver métricas detalladas
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400">⚡</span>
            <p className="text-slate-300">
              <strong>Atajos:</strong> Usa Ctrl+Z para deshacer y Ctrl+Y para rehacer
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-400">🎨</span>
            <p className="text-slate-300">
              <strong>Visualización:</strong> Alterna entre vista 2D y 3D en el canvas
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400">💾</span>
            <p className="text-slate-300">
              <strong>Backup:</strong> Exporta tus proyectos regularmente como respaldo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

