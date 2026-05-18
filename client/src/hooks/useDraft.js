import { useState, useEffect, useCallback } from 'react';

const DRAFT_TTL_MS = 2 * 24 * 60 * 60 * 1000; // 2 days

/**
 * useDraft — A hook that persists form state in localStorage with a 2-day TTL.
 * @param {string} key - Unique localStorage key for this draft.
 * @param {object} initialState - Default state if no draft exists.
 * @returns {[state, setState, clearDraft]} - State tuple + a function to clear the draft.
 */
const useDraft = (key, initialState) => {
  const [state, setStateRaw] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return initialState;
      const { value, expiresAt } = JSON.parse(stored);
      if (Date.now() > expiresAt) {
        localStorage.removeItem(key);
        return initialState;
      }
      return value;
    } catch {
      return initialState;
    }
  });

  const setState = useCallback((updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(key, JSON.stringify({
          value: next,
          expiresAt: Date.now() + DRAFT_TTL_MS
        }));
      } catch { /* storage full */ }
      return next;
    });
  }, [key]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return [state, setState, clearDraft];
};

export default useDraft;
