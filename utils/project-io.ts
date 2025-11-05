import { Project } from '@/types';

/**
 * Resultado de la validación de un archivo de proyecto
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  project?: Project;
}

/**
 * Valida que un objeto tenga la estructura correcta de un proyecto
 */
export function validateProjectStructure(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      error: 'El archivo no contiene datos válidos',
    };
  }

  const project = data as Partial<Project>;

  // Validar campos requeridos
  if (!project.id || typeof project.id !== 'string') {
    return {
      isValid: false,
      error: 'El proyecto no tiene un ID válido',
    };
  }

  if (!project.nombre || typeof project.nombre !== 'string') {
    return {
      isValid: false,
      error: 'El proyecto no tiene un nombre válido',
    };
  }

  if (!project.fechaCreacion || typeof project.fechaCreacion !== 'string') {
    return {
      isValid: false,
      error: 'El proyecto no tiene una fecha de creación válida',
    };
  }

  if (!project.fechaModificacion || typeof project.fechaModificacion !== 'string') {
    return {
      isValid: false,
      error: 'El proyecto no tiene una fecha de modificación válida',
    };
  }

  // Validar arrays
  if (!Array.isArray(project.gondolas)) {
    return {
      isValid: false,
      error: 'El proyecto no tiene un array de góndolas válido',
    };
  }

  if (!Array.isArray(project.products)) {
    return {
      isValid: false,
      error: 'El proyecto no tiene un array de productos válido',
    };
  }

  if (!Array.isArray(project.assignments)) {
    return {
      isValid: false,
      error: 'El proyecto no tiene un array de asignaciones válido',
    };
  }

  // Validar configuración del solver
  if (!project.solverConfig || typeof project.solverConfig !== 'object') {
    return {
      isValid: false,
      error: 'El proyecto no tiene una configuración de solver válida',
    };
  }

  return {
    isValid: true,
    project: project as Project,
  };
}

/**
 * Lee y valida un archivo .map
 */
export async function readProjectFile(file: File): Promise<ValidationResult> {
  // Validar extensión
  if (!file.name.endsWith('.map')) {
    return {
      isValid: false,
      error: 'El archivo debe tener extensión .map',
    };
  }

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    return validateProjectStructure(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        isValid: false,
        error: 'El archivo no contiene JSON válido',
      };
    }
    return {
      isValid: false,
      error: 'Error al leer el archivo: ' + (error as Error).message,
    };
  }
}

/**
 * Genera el nombre de archivo para exportar un proyecto
 */
export function generateExportFilename(projectName: string): string {
  // Limpiar el nombre del proyecto para usarlo como nombre de archivo
  const cleanName = projectName
    .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .toLowerCase();
  
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `${cleanName}-${timestamp}.map`;
}

/**
 * Exporta un proyecto como archivo .map
 */
export function exportProjectToFile(project: Project): void {
  const jsonString = JSON.stringify(project, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = generateExportFilename(project.nombre);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Liberar el objeto URL
  URL.revokeObjectURL(url);
}

/**
 * Genera un nuevo ID para un proyecto
 */
export function generateNewProjectId(): string {
  return crypto.randomUUID();
}

/**
 * Crea una copia de un proyecto con un nuevo ID
 */
export function cloneProjectWithNewId(project: Project): Project {
  return {
    ...project,
    id: generateNewProjectId(),
    nombre: `${project.nombre} (copia)`,
    fechaCreacion: new Date().toISOString(),
    fechaModificacion: new Date().toISOString(),
  };
}

