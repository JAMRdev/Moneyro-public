
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Clave pública VAPID - Esta clave es pública y segura para ser expuesta.
const VAPID_PUBLIC_KEY = 'BBB030f6M-ow7GL-miP3XaTy6yXtIgqAaorn4pQWN3We-VKPwbDw69c_d8FFLWsbmFMJ7SSQD7hH17mp-pzSpdw';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const usePushNotifications = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('usePushNotifications hook running');
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications are not supported');
      return;
    }

    const registerServiceWorker = async () => {
      const swPath = '/sw.js';
      console.log('Intentando registrar el service worker desde la ruta:', swPath);
      try {
        const registration = await navigator.serviceWorker.register(swPath, { scope: '/' });
        console.log('Service Worker registrado con éxito. Scope:', registration.scope);
        
        if (registration.installing) {
          console.log('Service Worker: Instalando');
        } else if (registration.waiting) {
          console.log('Service Worker: Esperando');
        } else if (registration.active) {
          console.log('Service Worker: Activo');
        }

        askPermissionAndSubscribe(registration);
      } catch (error) {
        console.error('Falló el registro del Service Worker:', error);
      }
    };

    const askPermissionAndSubscribe = async (registration: ServiceWorkerRegistration) => {
      console.log('Asking for permission. Current state:', Notification.permission);
      if (Notification.permission === 'granted') {
        // Sin interacción: suscribimos silenciosamente al usuario
        subscribeUser(registration);
      } else if (Notification.permission === 'default') {
        // Interacción: pedimos permiso con un toast y suscribimos tras aceptar
        toast('¿Quieres recibir notificaciones?', {
          duration: Infinity,
          action: {
            label: 'Activar',
            onClick: async () => {
              console.log('User clicked "Activar". Requesting permission...');
              const permission = await Notification.requestPermission();
              console.log('Permission request result:', permission);
              if (permission === 'granted') {
                subscribeUser(registration);
              }
            },
          },
        });
      } else {
        console.log('Permission has been denied.');
      }
    };
    
    const subscribeUser = async (registration: ServiceWorkerRegistration) => {
      console.log('Automated workflow: Resetting push subscriptions...');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('User not logged in, cannot subscribe.');
          return;
        }

        // ELIMINAMOS TODAS las suscripciones en Supabase de este user (limpieza total)
        const { error: deleteError } = await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error al eliminar las suscripciones previas en Supabase', deleteError);
        } else {
          console.log('Eliminadas todas las suscripciones previas en Supabase para usuario', user.id);
        }

        // ELIMINAMOS la suscripción previa del navegador si existe
        const existingBrowserSubscription = await registration.pushManager.getSubscription();
        if (existingBrowserSubscription) {
          console.log('Eliminando suscripción previa en navegador...');
          await existingBrowserSubscription.unsubscribe();
        }

        // Creamos una nueva suscripción
        console.log('Creando nueva suscripción push...');
        const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });

        // Guardamos la nueva suscripción en Supabase
        const { error: insertError } = await supabase.from('push_subscriptions').insert({
          user_id: user.id,
          subscription: newSubscription.toJSON() as any,
        });

        if (insertError) {
          throw insertError;
        }

        toast.success('¡Te has suscrito a las notificaciones!');
        console.log('Suscripción guardada correctamente en Supabase.');
      } catch (error) {
        console.error('Falló la suscripción automática: ', error);
        toast.error('No se pudo suscribir a las notificaciones.', {
          description: 'Revisa la consola del navegador para más detalles.'
        });
      }
    };
    
    registerServiceWorker();

  }, [queryClient]);
};

