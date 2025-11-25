'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LeadSource } from '@/lib/core/storage';

const SOURCE_CONFIG: Record<LeadSource, { label: string; className: string }> = {
  instagram_ads: { 
    label: 'Instagram Ads', 
    className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0',
  },
  instagram_bio: { 
    label: 'Instagram Bio', 
    className: 'bg-gradient-to-r from-purple-400 to-pink-400 text-white border-0',
  },
  facebook_ads: { 
    label: 'Facebook Ads', 
    className: 'bg-blue-600 text-white border-0',
  },
  google_ads: { 
    label: 'Google Ads', 
    className: 'bg-red-500 text-white border-0',
  },
  google_organic: { 
    label: 'Google Organic', 
    className: 'bg-green-600 text-white border-0',
  },
  direct: { 
    label: 'Diretto', 
    className: 'bg-gray-500 text-white border-0',
  },
  referral: { 
    label: 'Referral', 
    className: 'bg-orange-500 text-white border-0',
  },
  whatsapp: { 
    label: 'WhatsApp', 
    className: 'bg-green-500 text-white border-0',
  },
  unknown: { 
    label: 'Sconosciuto', 
    className: 'bg-gray-400 text-white border-0',
  },
};

interface SourceBadgeProps {
  source: LeadSource;
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  const config = SOURCE_CONFIG[source];

  return (
    <Badge 
      variant="outline"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}


