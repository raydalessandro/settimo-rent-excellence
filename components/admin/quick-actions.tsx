'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Phone, Mail, MessageCircle, Eye, Edit } from 'lucide-react';
import { config } from '@/lib/core/config';

interface QuickActionsProps {
  leadId: string;
  telefono: string;
  email: string;
  onView?: () => void;
  onEdit?: () => void;
}

export function QuickActions({ 
  leadId, 
  telefono, 
  email, 
  onView, 
  onEdit 
}: QuickActionsProps) {
  const whatsappUrl = `https://wa.me/${telefono.replace(/[^0-9]/g, '')}`;
  const phoneUrl = `tel:${telefono}`;
  const mailUrl = `mailto:${email}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Azioni</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            Visualizza
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Modifica
          </DropdownMenuItem>
        )}
        {(onView || onEdit) && <DropdownMenuSeparator />}
        <DropdownMenuItem asChild>
          <a href={phoneUrl}>
            <Phone className="mr-2 h-4 w-4" />
            Chiama
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={mailUrl}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


