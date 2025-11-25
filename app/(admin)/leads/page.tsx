'use client';

/**
 * Admin Leads List
 * Lista leads con filtri, ricerca e export
 */

import { useState } from 'react';
import Link from 'next/link';
import { useAdminLeads, type LeadFilters } from '@/lib/features/admin';
import { StatusBadge } from '@/components/admin/status-badge';
import { SourceBadge } from '@/components/admin/source-badge';
import { QuickActions } from '@/components/admin/quick-actions';
import { ExportButton } from '@/components/admin/export-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import type { LeadStatus, LeadSource } from '@/lib/core/storage';

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'Nuovo' },
  { value: 'contacted', label: 'Contattato' },
  { value: 'qualified', label: 'Qualificato' },
  { value: 'won', label: 'Chiuso' },
  { value: 'lost', label: 'Perso' },
];

const SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'instagram_ads', label: 'Instagram Ads' },
  { value: 'facebook_ads', label: 'Facebook Ads' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'google_organic', label: 'Google Organic' },
  { value: 'direct', label: 'Diretto' },
  { value: 'referral', label: 'Referral' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

export default function AdminLeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');

  const filters: LeadFilters = {
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? [statusFilter] : undefined,
    source: sourceFilter !== 'all' ? [sourceFilter] : undefined,
  };

  const { 
    leads, 
    isLoading, 
    hasActiveFilters, 
    resetFilters, 
    refetch 
  } = useAdminLeads(filters);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSourceFilter('all');
    resetFilters();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            Gestisci le richieste di contatto
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <ExportButton filters={filters} />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtri
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca per nome, email, azienda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select 
              value={statusFilter} 
              onValueChange={(v) => setStatusFilter(v as LeadStatus | 'all')}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli status</SelectItem>
                {STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Source Filter */}
            <Select 
              value={sourceFilter} 
              onValueChange={(v) => setSourceFilter(v as LeadSource | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le fonti</SelectItem>
                {SOURCE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">
                {hasActiveFilters 
                  ? 'Nessun lead trovato con questi filtri' 
                  : 'Nessun lead ancora ricevuto'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contatto</TableHead>
                  <TableHead>Azienda</TableHead>
                  <TableHead>Veicolo</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Link 
                        href={`/admin/leads/${lead.id}`}
                        className="hover:underline"
                      >
                        <div className="font-medium">
                          {lead.nome} {lead.cognome}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {lead.email}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {lead.azienda || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.vehicle ? (
                        <span className="text-sm">
                          {lead.vehicle.marca} {lead.vehicle.modello}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <SourceBadge source={lead.source} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString('it-IT')}
                    </TableCell>
                    <TableCell>
                      <QuickActions
                        leadId={lead.id}
                        telefono={lead.telefono}
                        email={lead.email}
                        onView={() => window.location.href = `/admin/leads/${lead.id}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Results count */}
      {!isLoading && leads.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          {leads.length} lead trovati
        </p>
      )}
    </div>
  );
}


