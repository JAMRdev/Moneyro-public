
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface PendingAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cargar acciones pendientes del localStorage
    const stored = localStorage.getItem('pending-actions');
    if (stored) {
      try {
        setPendingActions(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading pending actions:', error);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Guardar acciones pendientes en localStorage
    localStorage.setItem('pending-actions', JSON.stringify(pendingActions));
  }, [pendingActions]);

  const addPendingAction = (action: Omit<PendingAction, 'id' | 'timestamp'>) => {
    const newAction: PendingAction = {
      ...action,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    
    setPendingActions(prev => [...prev, newAction]);
  };

  const syncPendingActions = async () => {
    if (!isOnline || pendingActions.length === 0) return;

    // Aquí implementarías la lógica de sincronización
    // Por ahora, simplemente limpiamos las acciones pendientes
    setPendingActions([]);
    
    // Invalidar queries para refrescar datos
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };

  useEffect(() => {
    if (isOnline) {
      syncPendingActions();
    }
  }, [isOnline]);

  return {
    isOnline,
    pendingActions: pendingActions.length,
    addPendingAction,
    syncPendingActions
  };
};
