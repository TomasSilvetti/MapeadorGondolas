'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Download, Info, CheckCircle2 } from 'lucide-react';

export const WelcomeGuide = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownloadCSV = () => {
    const link = document.createElement('a');
    link.href = '/productos-prueba.csv';
    link.download = 'productos-prueba.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const steps = [
    {
      number: 1,
      title: 'Crear Proyecto',
      description: 'Haz clic en "Crear Primer Proyecto" o el botón "+" para comenzar un nuevo proyecto de mapeo.',
    },
    {
      number: 2,
      title: 'Configurar Góndolas',
      description: 'Arrastra góndolas desde el panel lateral izquierdo al canvas para diseñar tu layout.',
    },
    {
      number: 3,
      title: 'Configurar Estantes',
      description: 'Selecciona cada góndola y configura la cantidad de estantes, espacios por estante y restricciones de categorías en el panel derecho.',
    },
    {
      number: 4,
      title: 'Cargar Productos',
      description: 'Haz clic en "Ejecutar Optimización" y carga el archivo CSV con tus productos (puedes usar el CSV de ejemplo).',
    },
    {
      number: 5,
      title: 'Establecer Parámetros',
      description: 'Ajusta los pesos de margen de ganancia vs ventas, diversidad mínima por estante, y cantidad de facings por producto.',
    },
    {
      number: 6,
      title: 'Ejecutar Algoritmo',
      description: 'Presiona "Ejecutar Optimización" para que el algoritmo MILP asigne productos de forma óptima.',
    },
    {
      number: 7,
      title: 'Revisar Resultados',
      description: 'Cambia al modo "Resultados" usando el switch en la barra superior para ver la asignación óptima de productos en cada estante.',
    },
  ];

  return (
    <Card className="mb-6 bg-slate-800/50 border-slate-700">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl text-slate-100 mb-1">
                ¿Qué es el Mapeador de Góndolas?
              </CardTitle>
              <CardDescription className="text-slate-400">
                Herramienta para optimizar la disposición de productos en góndolas usando algoritmos de programación lineal entera mixta (MILP)
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-100 hover:bg-slate-700"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Guía Paso a Paso */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Guía de Uso Paso a Paso
            </h3>
            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-400">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-200 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botón de Descarga CSV */}
          <div className="pt-4 border-t border-slate-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700/30">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-100 mb-1">
                  Archivo CSV de Ejemplo
                </h4>
                <p className="text-sm text-slate-400">
                  Descarga un archivo CSV con 50 productos de ejemplo para probar la aplicación
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
                    50 productos
                  </Badge>
                  <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
                    7 categorías
                  </Badge>
                  <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
                    Formato: CSV
                  </Badge>
                </div>
              </div>
              <Button
                onClick={handleDownloadCSV}
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar CSV de Ejemplo
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

