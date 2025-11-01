'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function ReportsPage() {
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
            <Link href="/config">
              <Button variant="outline">Configuración</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportes</h1>
          <p className="text-gray-600">
            Visualiza los resultados de la asignación de productos y estatísticas del layout
          </p>
        </div>

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="shelves">Estantes</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Productos Asignados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-gray-500">de 0 total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Espacios Ocupados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-gray-500">de 0 disponibles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Rentabilidad Promedio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">0%</p>
                  <p className="text-xs text-gray-500">margen ponderado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Góndolas Configuradas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-gray-500">activas</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Productos Asignados</CardTitle>
                <CardDescription>Listado de productos y sus ubicaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No hay productos asignados aún. Ejecuta el solver para generar asignaciones.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shelves">
            <Card>
              <CardHeader>
                <CardTitle>Análisis por Estante</CardTitle>
                <CardDescription>
                  Distribución de productos y ocupación por estante
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No hay datos disponibles. Crea un layout y ejecuta el solver.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Categorías</CardTitle>
                <CardDescription>Visualización de categorías por góndola</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No hay datos disponibles. Crea un layout y ejecuta el solver.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
