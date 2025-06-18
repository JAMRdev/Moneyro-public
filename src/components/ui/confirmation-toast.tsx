
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ConfirmationToastProps {
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
};

export const showConfirmationToast = ({ 
  title, 
  description, 
  type, 
  duration = 4000 
}: ConfirmationToastProps) => {
  const Icon = icons[type];
  
  toast(title, {
    description,
    duration,
    icon: <Icon className={`h-4 w-4 ${colors[type]}`} />,
    action: type === 'error' ? {
      label: 'Cerrar',
      onClick: () => {},
    } : undefined,
  });
};

export const confirmationToast = {
  success: (title: string, description?: string) => 
    showConfirmationToast({ title, description, type: 'success' }),
  
  error: (title: string, description?: string) => 
    showConfirmationToast({ title, description, type: 'error' }),
  
  info: (title: string, description?: string) => 
    showConfirmationToast({ title, description, type: 'info' }),
  
  warning: (title: string, description?: string) => 
    showConfirmationToast({ title, description, type: 'warning' }),
};
