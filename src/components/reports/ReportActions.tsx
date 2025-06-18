
import { RefObject } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet } from "lucide-react";
import { Transaction } from "@/types";

type ReportActionsProps = {
  combinedData: Transaction[] | undefined;
  reportContentRef: RefObject<HTMLDivElement>;
};

export const ReportActions = ({ combinedData, reportContentRef }: ReportActionsProps) => {
  const handleExportCSV = () => {
    if (!combinedData || combinedData.length === 0) {
      toast.warning("No hay datos para exportar", {
        description: "Ajusta los filtros o agrega nuevas transacciones.",
      });
      return;
    }

    const headers = ['Fecha', 'Descripción', 'Monto', 'Tipo', 'Categoría'];
    const csvRows = [headers.join(',')];

    for (const transaction of combinedData) {
      const row = [
        transaction.transaction_date,
        `"${transaction.description?.replace(/"/g, '""') ?? ''}"`,
        transaction.amount,
        transaction.type,
        `"${transaction.categories?.name ?? 'Sin Categoría'}"`,
      ];
      csvRows.push(row.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exportación a CSV completada.");
  };

  const handleExportPDF = async () => {
    if (!reportContentRef.current) {
        toast.error("No se pudo encontrar el contenido del reporte para exportar.");
        return;
    }
    
    if (!combinedData || combinedData.length === 0) {
      toast.warning("No hay datos para exportar", {
        description: "Ajusta los filtros o agrega nuevas transacciones.",
      });
      return;
    }

    const toastId = toast.loading("Generando PDF...", {
        description: "Esto puede tardar unos segundos. Por favor, espera.",
    });

    try {
        const canvas = await html2canvas(reportContentRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
        });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        
        let imgWidth = pdfWidth - 20;
        let imgHeight = imgWidth / ratio;

        if (imgHeight > pdfHeight - 20) {
            imgHeight = pdfHeight - 20;
            imgWidth = imgHeight * ratio;
        }
        
        const x = (pdfWidth - imgWidth) / 2;
        const y = 10;

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save(`reporte-financiero-${new Date().toISOString().split('T')[0]}.pdf`);

        toast.success("Exportación a PDF completada.", { id: toastId });
    } catch (error) {
        console.error("Error al exportar a PDF:", error);
        toast.error("Ocurrió un error al generar el PDF.", { id: toastId });
    }
  };

  const handleExportToSheets = async () => {
    if (!combinedData || combinedData.length === 0) {
      toast.warning("No hay datos para exportar", {
        description: "Ajusta los filtros o agrega nuevas transacciones.",
      });
      return;
    }

    const toastId = toast.loading("Iniciando exportación a Google Sheets...");

    try {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(`Error al obtener la sesión: ${sessionError.message}`);
      }
      
      const session = data.session;

      if (!session) {
        toast.error("No has iniciado sesión.", { 
            id: toastId, 
            description: "Por favor, inicia sesión para poder exportar." 
        });
        return;
      }

      if (!session.provider_token) {
        toast.info("Se necesita autorización de Google.", { 
          id: toastId,
          description: "Serás redirigido para conceder los permisos necesarios.",
        });
        
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            scopes: 'https://www.googleapis.com/auth/spreadsheets',
            redirectTo: window.location.href,
          },
        });

        if (oauthError) {
            throw new Error(`Error al iniciar la autenticación con Google: ${oauthError.message}`);
        }
        
        return;
      }
      
      const accessToken = session.provider_token;

      toast.loading("Creando nueva hoja de cálculo...", { id: toastId });
      const spreadsheetResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            title: `Reporte Financiero - ${new Date().toLocaleString()}`
          }
        })
      });

      if (!spreadsheetResponse.ok) {
        const errorData = await spreadsheetResponse.json();
        const errorStatus = errorData.error?.status;

        if (errorStatus === 'UNAUTHENTICATED' || errorStatus === 'PERMISSION_DENIED') {
          const toastMessage = errorStatus === 'PERMISSION_DENIED'
            ? "Se requieren permisos adicionales para Google Sheets."
            : "Tu sesión de Google ha expirado. Por favor, autentícate de nuevo.";
          
          toast.info(toastMessage, { 
            id: toastId,
            description: "Serás redirigido para autorizar la aplicación.",
          });
          
          const { error: oauthError } = await supabase.auth.signInWithOAuth({ 
            provider: 'google', 
            options: { 
              scopes: 'https://www.googleapis.com/auth/spreadsheets',
              redirectTo: window.location.href,
            } 
          });

          if (oauthError) {
            throw new Error(`Error al intentar re-autenticar con Google: ${oauthError.message}`);
          }
          
          return;
        }

        throw new Error(`Error al crear la hoja de cálculo: ${errorData.error?.message || 'Error desconocido'}`);
      }

      const spreadsheetData = await spreadsheetResponse.json();
      const spreadsheetId = spreadsheetData.spreadsheetId;
      const spreadsheetUrl = spreadsheetData.spreadsheetUrl;
      
      const headers = ['Fecha', 'Descripción', 'Monto', 'Tipo', 'Categoría'];
      const values = combinedData.map(t => [
        t.transaction_date,
        t.description ?? '',
        t.amount,
        t.type,
        t.categories?.name ?? 'Sin Categoría'
      ]);
      const dataToAppend = [headers, ...values];

      toast.loading("Exportando datos a la hoja de cálculo...", { id: toastId });
      const appendResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: dataToAppend
        })
      });

      if (!appendResponse.ok) {
        const errorData = await appendResponse.json();
        throw new Error(`Error al exportar los datos: ${errorData.error?.message || 'Error desconocido'}`);
      }
      
      toast.success("¡Exportación a Google Sheets completada!", {
        id: toastId,
        description: "Tu reporte está listo.",
        action: {
          label: "Abrir Hoja de Cálculo",
          onClick: () => window.open(spreadsheetUrl, '_blank'),
        },
      });

    } catch (error) {
      console.error("Error al exportar a Google Sheets:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado al exportar.";
      toast.error("Error de Exportación", { id: toastId, description: errorMessage });
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t pt-4">
      <Button variant="outline" onClick={handleExportToSheets}><Sheet className="mr-2 h-4 w-4" />Exportar a Google Sheets</Button>
      <Button variant="outline" onClick={handleExportPDF}>Exportar a PDF</Button>
      <Button variant="outline" onClick={handleExportCSV}>Exportar a CSV</Button>
    </div>
  )
}
