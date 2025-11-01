import { create } from 'zustand';
import { Assignment, AssignmentsStore } from '@/types';

export const useAssignmentsStore = create<AssignmentsStore>((set) => ({
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
}));
