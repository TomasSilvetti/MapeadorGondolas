'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useProjectsStore } from '@/stores/projects';
import { ProjectCard } from '@/components/custom/ProjectCard';
import { CreateProjectModal } from '@/components/custom/CreateProjectModal';
import { ImportDialog } from '@/components/custom/ImportDialog';
import { WelcomeGuide } from '@/components/custom/WelcomeGuide';
import { Plus, FolderOpen, Upload, FileUp } from 'lucide-react';
import { readProjectFile } from '@/utils/project-io';
import { Project } from '@/types';

export default function Home() {
  const projects = useProjectsStore((state) => state.projects);
  const loadProjects = useProjectsStore((state) => state.loadProjects);
  const importProject = useProjectsStore((state) => state.importProject);
  const checkProjectExists = useProjectsStore((state) => state.checkProjectExists);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [projectToImport, setProjectToImport] = useState<Project | null>(null);
  const [existingProject, setExistingProject] = useState<Project | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Manejar archivo seleccionado
  const handleFileSelect = async (file: File) => {
    setImportError(null);
    
    const result = await readProjectFile(file);
    
    if (!result.isValid || !result.project) {
      setImportError(result.error || 'Error al leer el archivo');
      return;
    }

    const project = result.project;
    const exists = checkProjectExists(project.id);
    
    if (exists) {
      // Mostrar diálogo de conflicto
      setProjectToImport(project);
      setExistingProject(projects.find(p => p.id === project.id) || null);
      setIsImportDialogOpen(true);
    } else {
      // Importar directamente
      importProject(project, false);
    }
  };

  // Manejar drag and drop
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileSelect(files[0]);
    }
  };

  // Manejar selección desde input de archivo
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileSelect(files[0]);
    }
    // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Manejar confirmación de importación
  const handleImportConfirm = (replaceExisting: boolean) => {
    if (projectToImport) {
      importProject(projectToImport, replaceExisting);
      setProjectToImport(null);
      setExistingProject(null);
    }
  };

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-100 mb-2">
              Mis Proyectos
            </h2>
            <p className="text-slate-400">
              Gestiona y organiza tus layouts de góndolas
            </p>
          </div>
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".map"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar Proyecto
            </Button>
          </div>
        </div>

        {/* Welcome Guide */}
        <WelcomeGuide />

        {/* Error de importación */}
        {importError && (
          <div className="mb-6 bg-red-900/20 border border-red-700/50 rounded-lg p-4">
            <p className="text-red-300 text-sm">{importError}</p>
          </div>
        )}

        {/* Projects Grid */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative transition-all ${
            isDragging ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900' : ''
          }`}
        >
          {/* Overlay de drag and drop */}
          {isDragging && (
            <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-blue-500">
              <div className="text-center">
                <FileUp className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-blue-300">
                  Suelta el archivo aquí
                </p>
                <p className="text-sm text-blue-400 mt-2">
                  Archivos .map solamente
                </p>
              </div>
            </div>
          )}

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
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Crear Primer Proyecto
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  size="lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Importar Proyecto
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
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

      {/* Import Dialog */}
      <ImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        project={projectToImport}
        existingProject={existingProject}
        onConfirm={handleImportConfirm}
      />
    </div>
  );
}
