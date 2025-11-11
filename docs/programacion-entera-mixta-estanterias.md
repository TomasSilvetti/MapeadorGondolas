# Programación Entera Mixta con Restricciones para Optimización de Estanterías

## Concepto

La **Programación Entera Mixta (MILP)** es un enfoque matemático que encuentra soluciones óptimas garantizadas para el problema de asignación de productos en estanterías, permitiendo repetición controlada de productos.

## Formulación Matemática

### Variables de Decisión
- `x_ij`: Cantidad de facings del producto i en el estante j (entero ≥ 0)
- `y_ij`: Variable binaria (1 si producto i aparece en estante j, 0 si no)

### Función Objetivo
```
Maximizar: Σ(i,j) x_ij × (ganancia_i × ventas_i × precio_i)
```

### Restricciones Principales
1. **Capacidad del estante**: `Σ(i) x_ij ≤ capacidad_j` para cada estante j
2. **Diversidad mínima**: `Σ(i) y_ij ≥ diversidad_min × capacidad_j`
3. **Relación facings-diversidad**: `x_ij ≤ max_facings × y_ij`
4. **No productos negativos**: `x_ij ≥ 0`, `y_ij ∈ {0,1}`

## Ventajas
- **Solución óptima garantizada**: Encuentra la mejor asignación posible
- **Control preciso**: Restricciones exactas sobre diversidad y repetición
- **15-25% mejor ganancia**: Comparado con métodos heurísticos simples

## Desventajas
- **Alto costo computacional**: Tiempo que crece exponencialmente con el tamaño
- **Complejidad de implementación**: Requiere solvers especializados (CPLEX, Gurobi)

## Parámetros Recomendados (Industria)
- **Diversidad mínima**: 60-80% del espacio del estante
- **Máximo facings**: 2-3 por producto individual
- **Productos prioritarios**: Basado en ratio margen × ventas

