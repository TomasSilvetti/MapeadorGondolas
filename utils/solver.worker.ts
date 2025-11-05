/* eslint-disable @typescript-eslint/no-explicit-any */
import GLPK from 'glpk.js';

interface WorkerInput {
  products: any[];
  positions: any[];
  visibilityFactors: Record<string, number>;
  categoryConstraints: Record<string, any>;
  config: any;
}

interface WorkerOutput {
  success: boolean;
  assignments?: any[];
  totalGanancia?: number;
  productosNoAsignados?: string[];
  tiempoEjecucion?: number;
  status?: 'optimal' | 'feasible' | 'infeasible' | 'error';
  message?: string;
  error?: string;
}

// Escuchar mensajes del thread principal
self.onmessage = async (e: MessageEvent<WorkerInput>) => {
  const startTime = Date.now();
  
  try {
    const { products, positions, visibilityFactors, categoryConstraints, config } = e.data;
    
    console.log('🔧 [Solver Worker] Iniciando solver...');
    console.log('📊 [Solver Worker] Datos recibidos:', {
      productos: products.length,
      posiciones: positions.length,
      config: config,
    });
    
    // Inicializar GLPK
    console.log('⚙️ [Solver Worker] Inicializando GLPK...');
    const glpk = await GLPK();
    console.log('✅ [Solver Worker] GLPK inicializado correctamente');
    
    // Construir el modelo ILP
    console.log('🏗️ [Solver Worker] Construyendo modelo ILP...');
    const model = buildILPModel(
      products,
      positions,
      visibilityFactors,
      categoryConstraints,
      config,
      glpk
    );
    console.log('✅ [Solver Worker] Modelo construido:', {
      variables: model.binaries?.length || 0,
      restricciones: model.subjectTo?.length || 0,
    });
    
    // Log del modelo para debugging (limitado para no saturar consola)
    const modelSummary = {
      name: model.name,
      objective: {
        direction: model.objective.direction,
        varsCount: model.objective.vars?.length || 0,
      },
      constraintsCount: model.subjectTo?.length || 0,
      binariesCount: model.binaries?.length || 0,
    };
    console.log('📋 [Solver Worker] Resumen del modelo:', modelSummary);
    
    // 🔍 VALIDACIÓN: Verificar que el modelo tiene datos válidos
    if (!model.objective.vars || model.objective.vars.length === 0) {
      throw new Error(`El modelo no tiene variables en la función objetivo. Esto puede ocurrir si todas las combinaciones producto-posición fueron excluidas por restricciones de categoría.`);
    }
    
    if (!model.binaries || model.binaries.length === 0) {
      throw new Error(`El modelo no tiene variables binarias. Verifica que haya productos y posiciones disponibles.`);
    }
    
    if (!model.subjectTo || model.subjectTo.length === 0) {
      console.warn('⚠️ [Solver Worker] El modelo no tiene restricciones. Esto es inusual pero no necesariamente un error.');
    }
    
    console.log('✅ [Solver Worker] Validación del modelo pasada');
    console.log('🔍 [Solver Worker] Primeras 3 variables:', model.binaries.slice(0, 3));
    console.log('🔍 [Solver Worker] Primeras 3 vars en objetivo:', model.objective.vars.slice(0, 3).map((v: any) => ({name: v.name, coef: v.coef.toFixed(2)})));
    
    // Resolver el modelo
    console.log('🚀 [Solver Worker] Resolviendo modelo ILP...');
    const result = await glpk.solve(model, {
      msglev: glpk.GLP_MSG_OFF, // Sin mensajes de log
      presol: true, // Usar presolver
      tmlim: (config.maxExecutionTime || 30) * 1000, // Tiempo límite en ms
    });
    
    const tiempoEjecucion = (Date.now() - startTime) / 1000;
    console.log('⏱️ [Solver Worker] Tiempo de ejecución:', tiempoEjecucion.toFixed(2) + 's');
    
    // Validar resultado
    console.log('🔍 [Solver Worker] Resultado raw de GLPK:', result);
    console.log('🔍 [Solver Worker] Tipo de resultado:', typeof result);
    console.log('🔍 [Solver Worker] Keys del resultado:', result ? Object.keys(result) : 'null/undefined');
    
    if (!result) {
      throw new Error('GLPK devolvió null o undefined. El modelo puede estar completamente vacío o mal formado.');
    }
    
    if (!result.result) {
      console.error('❌ [Solver Worker] result.result es undefined/null');
      console.error('🔍 [Solver Worker] Contenido completo de result:', JSON.stringify(result, null, 2));
      throw new Error('GLPK no devolvió un resultado válido (result.result es undefined). El modelo puede estar mal formado o GLPK no pudo procesarlo.');
    }
    
    // Procesar resultado
    console.log('📊 [Solver Worker] Resultado completo:', {
      status: result.result.status,
      statusName: getStatusName(result.result.status, glpk),
      z: result.result.z,
      varsCount: Object.keys(result.result.vars || {}).length,
    });
    
    if (result.result.status === glpk.GLP_OPT || result.result.status === glpk.GLP_FEAS) {
      console.log('✅ [Solver Worker] Solución encontrada');
      console.log('💰 [Solver Worker] Ganancia total:', result.result.z);
      
      const assignments = extractAssignments(result, products, positions);
      const totalGanancia = result.result.z || 0;
      const assignedProductIds = new Set(assignments.map((a: any) => a.productId));
      const productosNoAsignados = products
        .filter(p => !assignedProductIds.has(p.id))
        .map(p => p.id);
      
      console.log('📦 [Solver Worker] Asignaciones:', {
        asignados: assignments.length,
        noAsignados: productosNoAsignados.length,
      });
      
      const output: WorkerOutput = {
        success: true,
        assignments,
        totalGanancia,
        productosNoAsignados,
        tiempoEjecucion,
        status: result.result.status === glpk.GLP_OPT ? 'optimal' : 'feasible',
        message: result.result.status === glpk.GLP_OPT 
          ? 'Solución óptima encontrada' 
          : 'Solución factible encontrada',
      };
      
      self.postMessage(output);
    } else {
      console.warn('⚠️ [Solver Worker] No se encontró solución factible');
      console.log('📊 [Solver Worker] Status code:', result.result.status);
      
      const output: WorkerOutput = {
        success: false,
        tiempoEjecucion,
        status: 'infeasible',
        message: 'No se encontró una solución factible. Verifica que haya suficiente espacio en las góndolas y que las restricciones de categorías no sean demasiado estrictas.',
      };
      
      self.postMessage(output);
    }
  } catch (error: any) {
    const tiempoEjecucion = (Date.now() - startTime) / 1000;
    
    console.error('❌ [Solver Worker] Error en el solver:', error);
    console.error('📍 [Solver Worker] Stack trace:', error.stack);
    
    // Agregar información adicional del error
    const errorDetails = {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 5).join('\n'), // Primeras 5 líneas
    };
    console.error('🔍 [Solver Worker] Detalles del error:', errorDetails);
    
    const output: WorkerOutput = {
      success: false,
      tiempoEjecucion,
      status: 'error',
      error: error.message || 'Error desconocido',
      message: `Error al ejecutar el solver: ${error.message || 'Error desconocido'}. Revisa la consola para más detalles.`,
    };
    
    self.postMessage(output);
  }
};

/**
 * Construye el modelo de Programación Lineal Entera
 */
function buildILPModel(
  products: any[],
  positions: any[],
  visibilityFactors: Record<string, number>,
  categoryConstraints: Record<string, any>,
  config: any,
  glpk: any
): any {
  console.log('🔨 [Build Model] Iniciando construcción del modelo...');
  
  const variables: any[] = [];
  const constraints: any[] = [];
  const objective: any[] = [];
  
  // Crear variables x[i][j][f] para cada combinación producto-posición-facing
  const varMap = new Map<string, string>();
  // Crear variables y[i][j] para indicar si producto i está en posición j (para restricciones de diversidad)
  const yVarMap = new Map<string, string>();
  let varIndex = 0;
  let skippedCombinations = 0;
  
  console.log('📝 [Build Model] Creando variables...');
  
  // 🔍 DEPURACIÓN: Contador de restricciones aplicadas
  let restrictionsApplied = 0;
  let restrictionsBlocked = 0;
  
  for (const product of products) {
    const maxFacings = product.facingsDeseados || 1;
    
    for (const position of positions) {
      // Verificar restricciones de categoría
      const constraint = categoryConstraints[position.shelfId];
      
      if (constraint) {
        restrictionsApplied++;
        const allowed = isCategoryAllowed(product.categoria, constraint);
        
        if (!allowed) {
          restrictionsBlocked++;
          skippedCombinations++;
          
          // Log de las primeras 5 combinaciones bloqueadas para debugging
          if (restrictionsBlocked <= 5) {
            console.log(`🔍 [Build Model] Combinación bloqueada #${restrictionsBlocked}:`, {
              producto: product.id,
              categoria: product.categoria,
              posicion: position.id,
              shelfId: position.shelfId,
              restriccion: constraint,
            });
          }
          
          continue; // Saltar esta combinación
        }
      }
      
      for (let f = 1; f <= maxFacings; f++) {
        const varName = `x_${product.id}_${position.id}_${f}`;
        varMap.set(`${product.id}|${position.id}|${f}`, varName);
        
        // Definir variable binaria
        variables.push({
          name: varName,
          coef: 0, // Se define en la función objetivo
        });
        
        // Calcular coeficiente para función objetivo
        // Nueva fórmula: margen × precio × ventas × visibilidad
        const gananciaBase = 
          product.margen_ganancia * 
          product.precio * 
          product.ventas;
        
        const visibilidad = visibilityFactors[position.id] || 0.5;
        const ganancia = gananciaBase * visibilidad;
        
        objective.push({
          name: varName,
          coef: ganancia,
        });
        
        varIndex++;
      }
    }
  }
  
  console.log('🔍 [Build Model] Estadísticas de restricciones:', {
    restriccionesAplicadas: restrictionsApplied,
    combinacionesBloqueadas: restrictionsBlocked,
    porcentajeBloqueado: restrictionsApplied > 0 ? ((restrictionsBlocked / restrictionsApplied) * 100).toFixed(2) + '%' : '0%',
  });
  
  console.log('✅ [Build Model] Variables creadas:', {
    total: varIndex,
    combinacionesExcluidas: skippedCombinations,
  });
  
  // 🔍 DEPURACIÓN: Verificar que se crearon variables
  if (varIndex === 0) {
    console.error('❌ [Build Model] NO SE CREARON VARIABLES!');
    console.error('🔍 [Build Model] Productos:', products.length);
    console.error('🔍 [Build Model] Posiciones:', positions.length);
    console.error('🔍 [Build Model] Restricciones de categoría:', Object.keys(categoryConstraints).length);
    console.error('🔍 [Build Model] Todas las combinaciones fueron excluidas por restricciones');
    
    // Mostrar detalles de las restricciones
    console.error('🔍 [Build Model] Muestra de restricciones de categoría:');
    let sampleCount = 0;
    for (const [shelfId, constraint] of Object.entries(categoryConstraints)) {
      if (sampleCount < 3) {
        console.error(`   Shelf ${shelfId}:`, constraint);
        sampleCount++;
      }
    }
    
    // Mostrar muestra de productos
    console.error('🔍 [Build Model] Muestra de productos:');
    products.slice(0, 3).forEach(p => {
      console.error(`   Producto ${p.id}: categoría="${p.categoria}", facings=${p.facingsDeseados || 1}`);
    });
  }
  
  // Restricción 1: Cada posición máximo un producto-facing
  console.log('🔒 [Build Model] Creando restricciones de posición...');
  
  for (const position of positions) {
    const vars: any[] = [];
    
    for (const product of products) {
      const maxFacings = product.facingsDeseados || 1;
      
      for (let f = 1; f <= maxFacings; f++) {
        const varName = varMap.get(`${product.id}|${position.id}|${f}`);
        if (varName) {
          vars.push({ name: varName, coef: 1 });
        }
      }
    }
    
    if (vars.length > 0) {
      constraints.push({
        name: `pos_${position.id}`,
        vars,
        bnds: { type: glpk.GLP_DB, ub: 1, lb: 0 },
      });
    }
  }
  
  console.log('✅ [Build Model] Restricciones de posición:', constraints.length);
  
  // Restricción 2: Cada producto máximo sus facings deseados
  console.log('🔒 [Build Model] Creando restricciones de facings...');
  
  for (const product of products) {
    const vars: any[] = [];
    const maxFacings = product.facingsDeseados || 1;
    
    for (const position of positions) {
      for (let f = 1; f <= maxFacings; f++) {
        const varName = varMap.get(`${product.id}|${position.id}|${f}`);
        if (varName) {
          vars.push({ name: varName, coef: 1 });
        }
      }
    }
    
    if (vars.length > 0) {
      constraints.push({
        name: `prod_${product.id}`,
        vars,
        bnds: { type: glpk.GLP_DB, ub: maxFacings, lb: 0 },
      });
    }
  }
  
  // Restricción 3: Stock disponible
  console.log('🔒 [Build Model] Creando restricciones de stock...');
  
  for (const product of products) {
    const vars: any[] = [];
    const maxFacings = product.facingsDeseados || 1;
    
    for (const position of positions) {
      for (let f = 1; f <= maxFacings; f++) {
        const varName = varMap.get(`${product.id}|${position.id}|${f}`);
        if (varName) {
          vars.push({ name: varName, coef: 1 });
        }
      }
    }
    
    if (vars.length > 0) {
      constraints.push({
        name: `stock_${product.id}`,
        vars,
        bnds: { type: glpk.GLP_DB, ub: Math.min(product.stock, maxFacings), lb: 0 },
      });
    }
  }
  
  // ========================================
  // NUEVAS RESTRICCIONES MILP
  // ========================================
  
  // Restricción 4: Máximo facings por producto (global)
  console.log('🔒 [Build Model] Creando restricciones de máximo facings por producto...');
  const maxFacingsConfig = config.maxFacingsPorProducto || 3;
  
  for (const product of products) {
    const vars: any[] = [];
    const maxFacings = product.facingsDeseados || 1;
    
    // Sumar todos los facings del producto en todas las posiciones
    for (const position of positions) {
      for (let f = 1; f <= maxFacings; f++) {
        const varName = varMap.get(`${product.id}|${position.id}|${f}`);
        if (varName) {
          vars.push({ name: varName, coef: 1 });
        }
      }
    }
    
    if (vars.length > 0) {
      constraints.push({
        name: `maxfacings_${product.id}`,
        vars,
        bnds: { type: glpk.GLP_UP, ub: maxFacingsConfig, lb: 0 },
      });
    }
  }
  
  console.log(`✅ [Build Model] Restricciones de máximo facings (${maxFacingsConfig} por producto)`);
  
  // Restricción 5: Crear variables auxiliares y[i][shelf] para diversidad
  // y[i][shelf] = 1 si el producto i aparece en alguna posición del estante shelf
  console.log('🔒 [Build Model] Creando variables auxiliares para diversidad...');
  
  // Agrupar posiciones por estante
  const shelfPositions = new Map<string, any[]>();
  for (const position of positions) {
    if (!shelfPositions.has(position.shelfId)) {
      shelfPositions.set(position.shelfId, []);
    }
    shelfPositions.get(position.shelfId)!.push(position);
  }
  
  // Crear variables y[i][shelf]
  const yVariables: any[] = [];
  for (const product of products) {
    for (const [shelfId, shelfPos] of shelfPositions) {
      const yVarName = `y_${product.id}_${shelfId}`;
      yVarMap.set(`${product.id}|${shelfId}`, yVarName);
      yVariables.push(yVarName);
      
      // Restricción: y[i][shelf] = 1 si existe algún x[i][pos][f] = 1 en ese estante
      // Implementación: Σ(pos en shelf, f) x[i][pos][f] <= capacidad_shelf × y[i][shelf]
      // Simplificado: y[i][shelf] >= x[i][pos][f] para cada pos, f
      
      const maxFacings = product.facingsDeseados || 1;
      for (const position of shelfPos) {
        for (let f = 1; f <= maxFacings; f++) {
          const xVarName = varMap.get(`${product.id}|${position.id}|${f}`);
          if (xVarName) {
            // x[i][pos][f] <= y[i][shelf]
            constraints.push({
              name: `link_${xVarName}_${yVarName}`,
              vars: [
                { name: xVarName, coef: 1 },
                { name: yVarName, coef: -1 },
              ],
              bnds: { type: glpk.GLP_UP, ub: 0, lb: 0 },
            });
          }
        }
      }
    }
  }
  
  console.log(`✅ [Build Model] Variables auxiliares y creadas: ${yVariables.length}`);
  
  // Restricción 6: Diversidad mínima por estante
  console.log('🔒 [Build Model] Creando restricciones de diversidad mínima...');
  const diversidadMinima = config.diversidadMinima || 0.7;
  
  for (const [shelfId, shelfPos] of shelfPositions) {
    const capacidadEstante = shelfPos.length;
    const minProductosDiferentes = Math.floor(diversidadMinima * capacidadEstante);
    
    // Solo aplicar si tiene sentido (al menos 2 productos diferentes)
    if (minProductosDiferentes >= 2) {
      const vars: any[] = [];
      
      for (const product of products) {
        const yVarName = yVarMap.get(`${product.id}|${shelfId}`);
        if (yVarName) {
          vars.push({ name: yVarName, coef: 1 });
        }
      }
      
      if (vars.length > 0) {
        constraints.push({
          name: `diversity_${shelfId}`,
          vars,
          bnds: { type: glpk.GLP_LO, ub: 0, lb: minProductosDiferentes },
        });
      }
    }
  }
  
  console.log(`✅ [Build Model] Restricciones de diversidad (${(diversidadMinima * 100).toFixed(0)}% mínimo)`);
  
  // Restricción 7: Mínimo facings por producto (si está asignado)
  console.log('🔒 [Build Model] Creando restricciones de mínimo facings...');
  const minFacingsConfig = config.minFacingsPorProducto || 1;
  
  if (minFacingsConfig > 1) {
    for (const product of products) {
      for (const [shelfId, shelfPos] of shelfPositions) {
        const yVarName = yVarMap.get(`${product.id}|${shelfId}`);
        if (!yVarName) continue;
        
        const vars: any[] = [];
        const maxFacings = product.facingsDeseados || 1;
        
        // Sumar facings del producto en este estante
        for (const position of shelfPos) {
          for (let f = 1; f <= maxFacings; f++) {
            const xVarName = varMap.get(`${product.id}|${position.id}|${f}`);
            if (xVarName) {
              vars.push({ name: xVarName, coef: 1 });
            }
          }
        }
        
        if (vars.length > 0) {
          // Σ x[i][pos][f] >= minFacings × y[i][shelf]
          vars.push({ name: yVarName, coef: -minFacingsConfig });
          
          constraints.push({
            name: `minfacings_${product.id}_${shelfId}`,
            vars,
            bnds: { type: glpk.GLP_LO, ub: 0, lb: 0 },
          });
        }
      }
    }
    console.log(`✅ [Build Model] Restricciones de mínimo facings (${minFacingsConfig} por producto)`);
  }
  
  console.log('✅ [Build Model] Total de restricciones:', constraints.length);
  console.log('🎯 [Build Model] Variables en función objetivo:', objective.length);
  console.log('🎯 [Build Model] Variables auxiliares (y):', yVariables.length);
  
  // 🔍 DEPURACIÓN: Verificar coherencia
  console.log('🔍 [Build Model] Verificación de coherencia:');
  console.log('   Variables creadas:', variables.length);
  console.log('   Variables en objetivo:', objective.length);
  console.log('   Restricciones:', constraints.length);
  
  if (variables.length !== objective.length) {
    console.warn('⚠️ [Build Model] ADVERTENCIA: Número de variables no coincide con objetivo');
  }
  
  // Construir modelo GLPK
  const model = {
    name: 'GondolaOptimization',
    objective: {
      direction: glpk.GLP_MAX,
      name: 'ganancia',
      vars: objective,
    },
    subjectTo: constraints,
    binaries: [...variables.map(v => v.name), ...yVariables], // Variables x e y
  };
  
  console.log('✅ [Build Model] Modelo construido exitosamente');
  console.log('🔍 [Build Model] Estructura del modelo:');
  console.log('   name:', model.name);
  console.log('   objective.direction:', model.objective.direction);
  console.log('   objective.vars.length:', model.objective.vars.length);
  console.log('   subjectTo.length:', model.subjectTo.length);
  console.log('   binaries.length:', model.binaries.length);
  
  return model;
}

/**
 * Verifica si una categoría está permitida según las restricciones
 */
function isCategoryAllowed(categoria: string, constraint: any): boolean {
  if (!constraint) return true;
  
  const { modo, categorias } = constraint;
  
  if (modo === 'permitir') {
    // Solo permitir las categorías en la lista
    return categorias.length === 0 || categorias.includes(categoria);
  } else {
    // Excluir las categorías en la lista
    return !categorias.includes(categoria);
  }
}

/**
 * Extrae las asignaciones del resultado del solver
 */
function extractAssignments(result: any, products: any[], positions: any[]): any[] {
  console.log('📦 [Extract] Extrayendo asignaciones del resultado...');
  
  const assignments: any[] = [];
  
  if (!result.result.vars) {
    console.warn('⚠️ [Extract] No hay variables en el resultado');
    return assignments;
  }
  
  // Agrupar por producto y posición para contar facings
  const assignmentMap = new Map<string, any>();
  let totalVarsProcessed = 0;
  let varsWithValue1 = 0;
  
  for (const varName in result.result.vars) {
    totalVarsProcessed++;
    const value = result.result.vars[varName];
    
    if (value === 1) {
      varsWithValue1++;
      // Parsear el nombre de la variable: x_productId_positionId_facing
      const parts = varName.split('_');
      if (parts.length >= 4 && parts[0] === 'x') {
        const productId = parts[1];
        const positionId = parts[2];
        const facing = parseInt(parts[3]);
        
        const key = `${productId}|${positionId}`;
        
        if (!assignmentMap.has(key)) {
          const position = positions.find(p => p.id === positionId);
          const product = products.find(p => p.id === productId);
          
          if (position && product) {
            assignmentMap.set(key, {
              id: `assignment-${productId}-${positionId}`,
              productId,
              gondolaId: position.gondolaId,
              shelfId: position.shelfId,
              spaceId: position.spaceId,
              cantidad: 0,
              facings: [],
            });
          }
        }
        
        const assignment = assignmentMap.get(key);
        if (assignment) {
          assignment.cantidad++;
          assignment.facings.push(facing);
        }
      }
    }
  }
  
  const finalAssignments = Array.from(assignmentMap.values());
  
  console.log('✅ [Extract] Extracción completada:', {
    variablesProcesadas: totalVarsProcessed,
    variablesConValor1: varsWithValue1,
    asignacionesFinales: finalAssignments.length,
  });
  
  return finalAssignments;
}

/**
 * Convierte el código de status de GLPK a un nombre legible
 */
function getStatusName(status: number, glpk: any): string {
  const statusMap: Record<number, string> = {
    [glpk.GLP_OPT]: 'OPTIMAL',
    [glpk.GLP_FEAS]: 'FEASIBLE',
    [glpk.GLP_INFEAS]: 'INFEASIBLE',
    [glpk.GLP_NOFEAS]: 'NO_FEASIBLE',
    [glpk.GLP_UNBND]: 'UNBOUNDED',
    [glpk.GLP_UNDEF]: 'UNDEFINED',
  };
  return statusMap[status] || `UNKNOWN(${status})`;
}

export {};

