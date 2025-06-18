
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GoogleIcon } from '@/components/GoogleIcon';
import { PiggyBank } from 'lucide-react';

const Auth = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error('Error al iniciar sesión con Google', { description: error.message });
      setIsSubmitting(false);
    }
    // No es necesario manejar el éxito, Supabase redirigirá automáticamente.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-lg text-center">
        <div className="flex justify-center">
            <PiggyBank className="w-16 h-16 text-violet-600 dark:text-lime-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Carle's Finance</h1>
          <p className="text-muted-foreground">Control de gastos</p>
        </div>
        <div className="pt-4">
          <Button onClick={handleGoogleLogin} className="w-full" disabled={isSubmitting} variant="outline">
            <GoogleIcon />
            {isSubmitting ? 'Redirigiendo...' : 'Iniciar Sesión con Google'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground pt-4">
            Solo las cuentas autorizadas podrán acceder.
        </p>
      </div>
    </div>
  );
};

export default Auth;
