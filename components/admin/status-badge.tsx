'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LeadStatus } from '@/lib/core/storage';

const STATUS_CONFIG: Record<LeadStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  new: { 
    label: 'Nuovo', 
    variant: 'default',
    className: 'bg-blue-500 hover:bg-blue-600',
  },
  contacted: { 
    label: 'Contattato', 
    variant: 'secondary',
    className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  },
  qualified: { 
    label: 'Qualificato', 
    variant: 'secondary',
    className: 'bg-purple-500 hover:bg-purple-600 text-white',
  },
  won: { 
    label: 'Chiuso', 
    variant: 'default',
    className: 'bg-green-500 hover:bg-green-600',
  },
  lost: { 
    label: 'Perso', 
    variant: 'destructive',
    className: '',
  },
};

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}


