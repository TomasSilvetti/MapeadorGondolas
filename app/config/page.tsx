'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ConfigPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
              Mapeador de Góndolas
            </Link>
          </div>
          <div className="flex gap-2">
            <Link href="/map">
              <Button variant="outline">Mapa</Button>
            </Link>
            <Link href="/reports">
              <Button variant="outline">Reportes</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración del Solver</h1>
          <p className="text-gray-600">
            Ajusta los parámetros para optimizar la asignación de productos
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pesos de Optimización</CardTitle>
            <CardDescription>
              Controla cómo el algoritmo pondera el margen de ganancia vs popularidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso de Margen de Ganancia
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.6"
                  className="flex-1"
                  disabled
                />
                <span className="text-sm font-semibold text-gray-900 w-12">0.6</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mayor valor = más importancia al margen de ganancia
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso de Popularidad
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.4"
                  className="flex-1"
                  disabled
                />
                <span className="text-sm font-semibold text-gray-900 w-12">0.4</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mayor valor = más importancia a la popularidad
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-900">
                <strong>Nota:</strong> Los pesos deben sumar 1.0 para una distribución equilibrada.
              </p>
            </div>

            <div className="flex gap-3">
              <Button disabled>Guardar Configuración</Button>
              <Button variant="outline" disabled>
                Restaurar Valores Predeterminados
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Parámetros Adicionales</CardTitle>
            <CardDescription>
              Configuración avanzada del algoritmo (próximas versiones)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Más parámetros de configuración estarán disponibles en futuras versiones.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
