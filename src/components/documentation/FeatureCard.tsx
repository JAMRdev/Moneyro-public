
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

/**
 * Props para el componente FeatureCard
 * 
 * @interface FeatureCardProps
 * @property {string} title - Título de la característica
 * @property {string} description - Descripción de la característica
 * @property {LucideIcon} icon - Icono de la característica
 * @property {string[]} [features] - Lista de sub-características
 * @property {string} [status] - Estado de la característica
 */
interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features?: string[];
  status?: 'stable' | 'beta' | 'deprecated';
}

/**
 * Componente para mostrar información de una característica
 * 
 * @param {FeatureCardProps} props - Props del componente
 * @returns {JSX.Element} Componente FeatureCard
 */
export const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  features, 
  status = 'stable' 
}: FeatureCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'beta':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'deprecated':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        
        {features && features.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Características:</h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="text-primary mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
