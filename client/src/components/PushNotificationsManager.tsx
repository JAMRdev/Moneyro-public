
import { usePushNotifications } from '@/hooks/usePushNotifications';

const PushNotificationsManager = () => {
  // Solo inicializa las notificaciones si el usuario está logueado
  usePushNotifications();
  
  return null; // Este componente no renderiza nada
};

export default PushNotificationsManager;
