'use client';

/**
 * Admin Lead Detail
 * Dettaglio lead con cambio status e note
 */

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminLead, useUpdateLeadStatus } from '@/lib/features/admin';
import { StatusBadge } from '@/components/admin/status-badge';
import { SourceBadge } from '@/components/admin/source-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MessageCircle, 
  Building2,
  Car,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Save,
  Loader2,
} from 'lucide-react';
import type { LeadStatus } from '@/lib/core/storage';

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'Nuovo' },
  { value: 'contacted', label: 'Contattato' },
  { value: 'qualified', label: 'Qualificato' },
  { value: 'won', label: 'Chiuso - Vinto' },
  { value: 'lost', label: 'Chiuso - Perso' },
];

export default function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: lead, isLoading } = useAdminLead(id);
  const updateStatus = useUpdateLeadStatus();
  
  const [status, setStatus] = useState<LeadStatus | null>(null);
  const [notes, setNotes] = useState('');

  // Set initial values when lead loads
  if (lead && status === null) {
    setStatus(lead.status);
    setNotes(lead.notes || '');
  }

  const handleSave = async () => {
    if (!lead || !status) return;

    try {
      await updateStatus.mutateAsync({
        leadId: lead.id,
        status,
        notes: notes || undefined,
      });
      toast.success('Lead aggiornato');
    } catch (error) {
      toast.error('Errore nell\'aggiornamento');
    }
  };

  if (isLoading) {
    return <LeadDetailSkeleton />;
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Lead non trovato</p>
        <Button variant="link" onClick={() => router.back()}>
          Torna alla lista
        </Button>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${lead.telefono.replace(/[^0-9]/g, '')}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna alla lista
          </Button>
          <h1 className="text-3xl font-bold">
            {lead.nome} {lead.cognome}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={lead.status} />
            <SourceBadge source={lead.source} />
            {lead.utmCampaign && (
              <Badge variant="outline">{lead.utmCampaign}</Badge>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`tel:${lead.telefono}`}>
              <Phone className="h-4 w-4 mr-2" />
              Chiama
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`mailto:${lead.email}`}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </a>
          </Button>
          <Button 
            variant="outline" 
            className="text-green-600 border-green-600 hover:bg-green-50"
            asChild
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Contatto</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{lead.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Telefono</Label>
                <p className="font-medium">{lead.telefono}</p>
              </div>
              {lead.azienda && (
                <div>
                  <Label className="text-muted-foreground">Azienda</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {lead.azienda}
                  </p>
                </div>
              )}
              {lead.partitaIva && (
                <div>
                  <Label className="text-muted-foreground">Partita IVA</Label>
                  <p className="font-medium">{lead.partitaIva}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicle & Quote */}
          {lead.vehicle && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Veicolo Richiesto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {lead.vehicle.immagini?.[0] && (
                    <img
                      src={lead.vehicle.immagini[0]}
                      alt={`${lead.vehicle.marca} ${lead.vehicle.modello}`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {lead.vehicle.marca} {lead.vehicle.modello}
                    </h3>
                    <p className="text-muted-foreground">{lead.vehicle.versione}</p>
                    <Link
                      href={`/veicoli/${lead.vehicle.slug}`}
                      className="text-primary text-sm hover:underline mt-2 inline-flex items-center gap-1"
                    >
                      <LinkIcon className="h-3 w-3" />
                      Vedi scheda veicolo
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Message */}
          {lead.messaggio && (
            <Card>
              <CardHeader>
                <CardTitle>Messaggio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{lead.messaggio}</p>
              </CardContent>
            </Card>
          )}

          {/* Attribution */}
          <Card>
            <CardHeader>
              <CardTitle>Tracciamento</CardTitle>
              <CardDescription>Dati di attribuzione del lead</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Fonte</Label>
                  <p className="font-medium">{lead.source}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Funnel Step</Label>
                  <p className="font-medium">{lead.funnelStep}</p>
                </div>
                {lead.utmSource && (
                  <div>
                    <Label className="text-muted-foreground">UTM Source</Label>
                    <p className="font-medium">{lead.utmSource}</p>
                  </div>
                )}
                {lead.utmMedium && (
                  <div>
                    <Label className="text-muted-foreground">UTM Medium</Label>
                    <p className="font-medium">{lead.utmMedium}</p>
                  </div>
                )}
                {lead.utmCampaign && (
                  <div>
                    <Label className="text-muted-foreground">UTM Campaign</Label>
                    <p className="font-medium">{lead.utmCampaign}</p>
                  </div>
                )}
                {lead.utmContent && (
                  <div>
                    <Label className="text-muted-foreground">UTM Content</Label>
                    <p className="font-medium">{lead.utmContent}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Gestione Lead</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={status || lead.status}
                  onValueChange={(v) => setStatus(v as LeadStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Note</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Aggiungi note sul lead..."
                  rows={4}
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleSave}
                disabled={updateStatus.isPending}
              >
                {updateStatus.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salva Modifiche
              </Button>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Creato:</span>
                <span>{new Date(lead.createdAt).toLocaleString('it-IT')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Aggiornato:</span>
                <span>{new Date(lead.updatedAt).toLocaleString('it-IT')}</span>
              </div>
              {lead.convertedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground">Convertito:</span>
                  <span>{new Date(lead.convertedAt).toLocaleString('it-IT')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Consent */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Consensi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Privacy Policy</span>
                <Badge variant={lead.privacyAccepted ? 'default' : 'destructive'}>
                  {lead.privacyAccepted ? 'Accettata' : 'Non accettata'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Marketing</span>
                <Badge variant={lead.marketingAccepted ? 'default' : 'secondary'}>
                  {lead.marketingAccepted ? 'Accettato' : 'Non accettato'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LeadDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-48 mt-2" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-32" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </div>
  );
}


