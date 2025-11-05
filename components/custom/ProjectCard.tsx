'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProjectsStore } from '@/stores/projects';
import { Trash2, Edit2, FolderOpen, Box, Package } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const setActiveProject = useProjectsStore((state) => state.setActiveProject);
  const updateProject = useProjectsStore((state) => state.updateProject);
  const deleteProject = useProjectsStore((state) => state.deleteProject);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedName, setEditedName] = useState(project.nombre);

  const handleOpenProject = () => {
    setActiveProject(project.id);
    router.push('/map');
  };

  const handleEditName = () => {
    if (editedName.trim()) {
      updateProject(project.id, { nombre: editedName.trim() });
      setIsEditModalOpen(false);
    }
  };

  const handleDelete = () => {
    deleteProject(project.id);
    setIsDeleteModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-slate-100 text-xl mb-2">
                {project.nombre}
              </CardTitle>
              <CardDescription className="text-slate-400">
                Creado: {formatDate(project.fechaCreacion)}
              </CardDescription>
              <CardDescription className="text-slate-400 text-xs mt-1">
                Modificado: {formatDate(project.fechaModificacion)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-slate-300">
                <Box className="w-4 h-4 text-blue-400" />
                <span className="text-sm">
                  {project.cantidadGondolas} {project.cantidadGondolas === 1 ? 'góndola' : 'góndolas'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Package className="w-4 h-4 text-green-400" />
                <span className="text-sm">
                  {project.cantidadProductos} {project.cantidadProductos === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleOpenProject}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Abrir
              </Button>
              <Button
                onClick={() => {
                  setEditedName(project.nombre);
                  setIsEditModalOpen(true);
                }}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-950"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Editar nombre del proyecto</DialogTitle>
            <DialogDescription className="text-slate-400">
              Ingresa un nuevo nombre para el proyecto
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Nombre del proyecto"
              className="bg-slate-900 border-slate-700 text-slate-100"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEditName();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditName}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-100">¿Eliminar proyecto?</DialogTitle>
            <DialogDescription className="text-slate-400">
              Esta acción no se puede deshacer. Se eliminará permanentemente el proyecto
              <span className="font-semibold text-slate-300"> &quot;{project.nombre}&quot;</span> y
              todos sus datos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

