'use client';

/**
 * Admin Dashboard
 * Overview con metriche principali
 */

import { useAdminDashboard } from '@/lib/features/admin';
import { StatCard } from '@/components/admin/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SourceBadge } from '@/components/admin/source-badge';
import type { LeadSource } from '@/lib/core/storage';

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Errore nel caricamento dei dati</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Panoramica delle performance del sito
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Leads Totali"
          value={stats.leads.total}
          description="da inizio attività"
          icon="users"
        />
        <StatCard
          title="Leads Oggi"
          value={stats.leads.today}
          description={`${stats.leads.thisWeek} questa settimana`}
          icon="users"
          trend={stats.leads.today > 0 ? { value: 12, isPositive: true } : undefined}
        />
        <StatCard
          title="Preventivi"
          value={stats.quotes.total}
          description={`media €${stats.quotes.avgValue}/mese`}
          icon="fileText"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversions.leadToQuote}%`}
          description="lead → preventivo"
          icon="trendingUp"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Leads by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Lead per Status</CardTitle>
            <CardDescription>Distribuzione dei lead per stato</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.leads.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status as any)}`} />
                    <span className="capitalize">{getStatusLabel(status as any)}</span>
                  </div>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leads by Source */}
        <Card>
          <CardHeader>
            <CardTitle>Lead per Fonte</CardTitle>
            <CardDescription>Da dove arrivano i lead</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.leads.bySource)
                .filter(([_, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between">
                    <SourceBadge source={source as LeadSource} />
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              {Object.values(stats.leads.bySource).every(c => c === 0) && (
                <p className="text-muted-foreground text-sm">
                  Nessun lead ancora ricevuto
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle>Veicoli Più Richiesti</CardTitle>
          <CardDescription>Top 5 veicoli per numero di richieste</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.topVehicles.mostRequested.length > 0 ? (
            <div className="space-y-4">
              {stats.topVehicles.mostRequested.map((vehicle, index) => (
                <div key={vehicle.vehicleId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span>{vehicle.vehicleName}</span>
                  </div>
                  <span className="font-semibold">{vehicle.count} richieste</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Nessun dato disponibile
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-blue-500',
    contacted: 'bg-yellow-500',
    qualified: 'bg-purple-500',
    won: 'bg-green-500',
    lost: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: 'Nuovi',
    contacted: 'Contattati',
    qualified: 'Qualificati',
    won: 'Chiusi',
    lost: 'Persi',
  };
  return labels[status] || status;
}


