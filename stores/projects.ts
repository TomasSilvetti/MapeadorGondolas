import { create } from 'zustand';
import { Project, ProjectsStore, Gondola, Product, Assignment, SolverConfig } from '@/types';
import { exportProjectToFile, cloneProjectWithNewId } from '@/utils/project-io';

const STORAGE_KEY = 'mapeador-gondolas-projects';
const ACTIVE_PROJECT_KEY = 'mapeador-gondolas-active-project';

// Cargar proyectos desde localStorage
const loadFromStorage = (): Project[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading projects from storage:', error);
    return [];
  }
};

// Guardar proyectos en localStorage
const saveToStorage = (projects: Project[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to storage:', error);
  }
};

// Cargar proyecto activo desde localStorage
const loadActiveProjectId = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  } catch (error) {
    console.error('Error loading active project:', error);
    return null;
  }
};

// Guardar proyecto activo en localStorage
const saveActiveProjectId = (id: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (id) {
      localStorage.setItem(ACTIVE_PROJECT_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
    }
  } catch (error) {
    console.error('Error saving active project:', error);
  }
};

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  activeProjectId: null,

  loadProjects: () => {
    const projects = loadFromStorage();
    const activeProjectId = loadActiveProjectId();
    set({ projects, activeProjectId });
  },

  createProject: (nombre: string) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      id: crypto.randomUUID(),
      nombre,
      fechaCreacion: now,
      fechaModificacion: now,
      cantidadGondolas: 0,
      cantidadProductos: 0,
      gondolas: [],
      products: [],
      assignments: [],
      solverConfig: {
        marginWeight: 0.5,
        salesWeight: 0.5,
        maxExecutionTime: 60,
        diversidadMinima: 0.7,
        maxFacingsPorProducto: 3,
        minFacingsPorProducto: 1,
      },
    };

    set((state) => {
      const newProjects = [...state.projects, newProject];
      saveToStorage(newProjects);
      saveActiveProjectId(newProject.id);
      return {
        projects: newProjects,
        activeProjectId: newProject.id,
      };
    });

    return newProject;
  },

  updateProject: (id: string, data: Partial<Project>) => {
    set((state) => {
      const newProjects = state.projects.map((p) =>
        p.id === id
          ? {
              ...p,
              ...data,
              fechaModificacion: new Date().toISOString(),
            }
          : p
      );
      saveToStorage(newProjects);
      return { projects: newProjects };
    });
  },

  deleteProject: (id: string) => {
    set((state) => {
      const newProjects = state.projects.filter((p) => p.id !== id);
      saveToStorage(newProjects);
      
      // Si se elimina el proyecto activo, limpiar la referencia
      const newActiveProjectId = state.activeProjectId === id ? null : state.activeProjectId;
      if (newActiveProjectId !== state.activeProjectId) {
        saveActiveProjectId(newActiveProjectId);
      }
      
      return {
        projects: newProjects,
        activeProjectId: newActiveProjectId,
      };
    });
  },

  setActiveProject: (id: string | null) => {
    set({ activeProjectId: id });
    saveActiveProjectId(id);
  },

  getActiveProject: () => {
    const state = get();
    if (!state.activeProjectId) return null;
    return state.projects.find((p) => p.id === state.activeProjectId) || null;
  },

  syncActiveProject: () => {
    const state = get();
    const activeProject = state.getActiveProject();
    if (!activeProject) return;

    // Esta función se llamará desde el mapeador para sincronizar cambios
    // Por ahora es un placeholder - la sincronización real se hará desde map/page.tsx
  },

  exportProject: (id: string) => {
    const state = get();
    const project = state.projects.find((p) => p.id === id);
    if (!project) {
      console.error('Proyecto no encontrado para exportar');
      return;
    }
    exportProjectToFile(project);
  },

  importProject: (project: Project, replaceIfExists: boolean) => {
    set((state) => {
      const existingIndex = state.projects.findIndex((p) => p.id === project.id);
      let newProjects: Project[];
      let projectToSet: Project;

      if (existingIndex !== -1 && replaceIfExists) {
        // Reemplazar proyecto existente
        newProjects = [...state.projects];
        newProjects[existingIndex] = {
          ...project,
          fechaModificacion: new Date().toISOString(),
        };
        projectToSet = newProjects[existingIndex];
      } else {
        // Crear nuevo proyecto (con nuevo ID si ya existe)
        if (existingIndex !== -1) {
          projectToSet = cloneProjectWithNewId(project);
        } else {
          projectToSet = {
            ...project,
            fechaModificacion: new Date().toISOString(),
          };
        }
        newProjects = [...state.projects, projectToSet];
      }

      saveToStorage(newProjects);
      saveActiveProjectId(projectToSet.id);

      return {
        projects: newProjects,
        activeProjectId: projectToSet.id,
      };
    });
  },

  checkProjectExists: (id: string): boolean => {
    const state = get();
    return state.projects.some((p) => p.id === id);
  },
}));


