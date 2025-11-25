'use client';

/**
 * Admin Preventivi List
 * Lista preventivi generati
 */

import Link from 'next/link';
import { useAdminLeads } from '@/lib/features/admin';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPreventiviPage() {
  // Get leads with quotes
  const { leads, isLoading } = useAdminLeads();
  
  // Filter leads that have a quoteId
  const leadsWithQuotes = leads.filter(lead => lead.quoteId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Preventivi</h1>
        <p className="text-muted-foreground">
          Preventivi generati dai clienti
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{leadsWithQuotes.length}</p>
                <p className="text-sm text-muted-foreground">Preventivi totali</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : leadsWithQuotes.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nessun preventivo ancora generato
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Preventivo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veicolo</TableHead>
                  <TableHead>Contatto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadsWithQuotes.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {lead.quoteId?.slice(-8).toUpperCase()}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {lead.nome} {lead.cognome}
                      </div>
                      {lead.azienda && (
                        <div className="text-sm text-muted-foreground">
                          {lead.azienda}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.vehicle ? (
                        <span>
                          {lead.vehicle.marca} {lead.vehicle.modello}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{lead.email}</div>
                        <div className="text-muted-foreground">{lead.telefono}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString('it-IT')}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/leads/${lead.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Dettagli
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


