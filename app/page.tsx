import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Mapeador de Góndolas</h1>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Optimiza la Disposición de Productos en tu Supermercado
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Utiliza nuestro sistema de mapeo visual para diseñar layouts óptimos y maximizar rentabilidad
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/map">
              <Button size="lg" className="px-8">
                Comenzar Mapeador
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Diseño Visual</CardTitle>
              <CardDescription>Crea layouts interactivos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Posiciona góndolas en una vista superior con drag and drop intuitivo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de Góndolas</CardTitle>
              <CardDescription>Personaliza cada góndola</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Configura estantes, espacios y restricciones de categorías
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Algoritmo Solver</CardTitle>
              <CardDescription>Optimiza automáticamente</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Asigna productos según margen de ganancia y popularidad
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Flujo de Trabajo</h3>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="bg-blue-100 text-blue-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                1
              </div>
              <p className="text-gray-700 font-medium">Cargar Productos</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-2xl text-gray-400">→</div>
            </div>
            <div>
              <div className="bg-blue-100 text-blue-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                2
              </div>
              <p className="text-gray-700 font-medium">Diseñar Layout</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-2xl text-gray-400">→</div>
            </div>
            <div>
              <div className="bg-blue-100 text-blue-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                3
              </div>
              <p className="text-gray-700 font-medium">Ejecutar Solver</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-2xl text-gray-400">→</div>
            </div>
            <div>
              <div className="bg-blue-100 text-blue-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                4
              </div>
              <p className="text-gray-700 font-medium">Ver Reportes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
