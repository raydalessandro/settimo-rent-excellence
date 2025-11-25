'use client';

import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useExportLeads, type LeadFilters } from '@/lib/features/admin';
import { toast } from 'sonner';

interface ExportButtonProps {
  filters?: LeadFilters;
}

export function ExportButton({ filters }: ExportButtonProps) {
  const exportMutation = useExportLeads();

  const handleExport = async () => {
    try {
      const count = await exportMutation.mutateAsync(filters);
      toast.success(`Esportati ${count} lead`);
    } catch (error) {
      toast.error('Errore durante l\'esportazione');
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={exportMutation.isPending}
    >
      {exportMutation.isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Esporta CSV
    </Button>
  );
}


