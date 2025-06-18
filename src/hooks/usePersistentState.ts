
import { useState, useEffect } from 'react';

function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

export default usePersistentState;
