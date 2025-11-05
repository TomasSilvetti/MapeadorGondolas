'use client';

import { Project } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText, Calendar, Package, Grid3x3 } from 'lucide-react';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  existingProject: Project | null;
  onConfirm: (replaceExisting: boolean) => void;
}

export function ImportDialog({
  open,
  onOpenChange,
  project,
  existingProject,
  onConfirm,
}: ImportDialogProps) {
  if (!project) return null;

  const hasConflict = !!existingProject;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100 flex items-center gap-2">
            {hasConflict ? (
              <>
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Proyecto Existente Detectado
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 text-blue-500" />
                Importar Proyecto
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {hasConflict
              ? 'Ya existe un proyecto con el mismo ID. ¿Qué deseas hacer?'
              : '¿Deseas importar este proyecto?'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Información del proyecto a importar */}
          <div className="bg-slate-900 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">
              Proyecto a importar:
            </h3>
            
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 font-medium">{project.nombre}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>
                Creado: {new Date(project.fechaCreacion).toLocaleDateString('es-ES')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>
                Modificado: {new Date(project.fechaModificacion).toLocaleDateString('es-ES')}
              </span>
            </div>

            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Grid3x3 className="w-4 h-4" />
                <span>{project.cantidadGondolas} góndolas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Package className="w-4 h-4" />
                <span>{project.cantidadProductos} productos</span>
              </div>
            </div>
          </div>

          {/* Información del proyecto existente si hay conflicto */}
          {hasConflict && existingProject && (
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-yellow-300 mb-2">
                Proyecto existente:
              </h3>
              
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-200 font-medium">{existingProject.nombre}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-yellow-300">
                <Calendar className="w-4 h-4" />
                <span>
                  Modificado: {new Date(existingProject.fechaModificacion).toLocaleDateString('es-ES')}
                </span>
              </div>

              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-yellow-300">
                  <Grid3x3 className="w-4 h-4" />
                  <span>{existingProject.cantidadGondolas} góndolas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-yellow-300">
                  <Package className="w-4 h-4" />
                  <span>{existingProject.cantidadProductos} productos</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
          >
            Cancelar
          </Button>
          
          {hasConflict ? (
            <>
              <Button
                onClick={() => {
                  onConfirm(false);
                  onOpenChange(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Crear Nuevo
              </Button>
              <Button
                onClick={() => {
                  onConfirm(true);
                  onOpenChange(false);
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Reemplazar Existente
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                onConfirm(false);
                onOpenChange(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Importar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

