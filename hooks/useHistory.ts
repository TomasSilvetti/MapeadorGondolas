'use client';

import { useState, useCallback } from 'react';

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export const useHistory = <T,>(initialState: T) => {
  const maxHistorySize = 20;
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const setState = useCallback((newState: T) => {
    setHistory((prevHistory) => ({
      past: [...prevHistory.past, prevHistory.present].slice(-maxHistorySize),
      present: newState,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.past.length === 0) return prevHistory;

      const newPresent = prevHistory.past[prevHistory.past.length - 1];
      const newPast = prevHistory.past.slice(0, -1);
      const newFuture = [prevHistory.present, ...prevHistory.future];

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.future.length === 0) return prevHistory;

      const newPresent = prevHistory.future[0];
      const newFuture = prevHistory.future.slice(1);
      const newPast = [...prevHistory.past, prevHistory.present];

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return {
    state: history.present,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
