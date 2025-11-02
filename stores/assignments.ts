import { create } from 'zustand';
import { Assignment, AssignmentsStore, Product } from '@/types';

export const useAssignmentsStore = create<AssignmentsStore>((set, get) => ({
  assignments: [],
  
  assignProduct: (assignment: Assignment) =>
    set((state) => {
      // Remove existing assignment for this space if any
      const filtered = state.assignments.filter(
        (a) => !(a.gondolaId === assignment.gondolaId && 
                 a.shelfId === assignment.shelfId && 
                 a.spaceId === assignment.spaceId)
      );
      return {
        assignments: [...filtered, assignment],
      };
    }),
  
  removeAssignment: (assignmentId: string) =>
    set((state) => ({
      assignments: state.assignments.filter((a) => a.id !== assignmentId),
    })),
  
  clearAssignments: () =>
    set({ assignments: [] }),
  
  applyBulkAssignments: (newAssignments: Assignment[]) =>
    set({ assignments: newAssignments }),
  
  getUnassignedProducts: (products: Product[]) => {
    const assignments = get().assignments;
    const assignedProductIds = new Set(assignments.map(a => a.productId));
    return products.filter(p => !assignedProductIds.has(p.id) && p.stock > 0);
  },
}));
