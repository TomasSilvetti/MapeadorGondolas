'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjectsStore } from '@/stores/projects';
import { Plus } from 'lucide-react';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
  const router = useRouter();
  const createProject = useProjectsStore((state) => state.createProject);
  const setActiveProject = useProjectsStore((state) => state.setActiveProject);

  const [projectName, setProjectName] = useState('');

  const handleCreate = () => {
    if (projectName.trim()) {
      const newProject = createProject(projectName.trim());
      setActiveProject(newProject.id);
      setProjectName('');
      onOpenChange(false);
      router.push('/map');
    }
  };

  const handleClose = () => {
    setProjectName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Nuevo Proyecto
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Ingresa un nombre para tu nuevo proyecto de mapeado de góndolas
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Ej: Layout Supermercado Central"
            className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreate();
              }
            }}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!projectName.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Proyecto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

