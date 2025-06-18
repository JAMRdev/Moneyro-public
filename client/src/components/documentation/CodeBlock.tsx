
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Props para el componente CodeBlock
 * 
 * @interface CodeBlockProps
 * @property {string} code - Código a mostrar
 * @property {string} [language='typescript'] - Lenguaje del código
 * @property {string} [title] - Título opcional del bloque
 */
interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

/**
 * Componente para mostrar bloques de código con sintaxis resaltada
 * 
 * Características:
 * - Copia al portapapeles con un click
 * - Soporte para múltiples lenguajes
 * - Título opcional
 * - Feedback visual de copia exitosa
 * 
 * @param {CodeBlockProps} props - Props del componente
 * @returns {JSX.Element} Componente CodeBlock
 */
export const CodeBlock = ({ code, language = 'typescript', title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  /**
   * Copia el código al portapapeles
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Código copiado al portapapeles');
      
      // Resetear el estado después de 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar el código');
    }
  };

  return (
    <div className="relative">
      {title && (
        <div className="bg-muted px-4 py-2 border-b">
          <h4 className="text-sm font-medium">{title}</h4>
        </div>
      )}
      
      <div className="relative bg-muted/30 rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        
        <pre className="p-4 overflow-x-auto text-sm">
          <code className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};
