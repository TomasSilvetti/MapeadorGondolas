'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProjectsStore } from '@/stores/projects';
import { ProjectCard } from '@/components/custom/ProjectCard';
import { CreateProjectModal } from '@/components/custom/CreateProjectModal';
import { Plus, FolderOpen } from 'lucide-react';

export default function Home() {
  const projects = useProjectsStore((state) => state.projects);
  const loadProjects = useProjectsStore((state) => state.loadProjects);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-100">Mapeador de Góndolas</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-100 mb-2">
            Mis Proyectos
          </h2>
          <p className="text-slate-400">
            Gestiona y organiza tus layouts de góndolas
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-slate-800 rounded-full p-6 mb-6">
              <FolderOpen className="w-16 h-16 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              No hay proyectos aún
            </h3>
            <p className="text-slate-500 mb-6 text-center max-w-md">
              Crea tu primer proyecto para comenzar a diseñar layouts de góndolas y optimizar la disposición de productos
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Primer Proyecto
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* Floating Action Button */}
      {projects.length > 0 && (
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          aria-label="Crear nuevo proyecto"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
