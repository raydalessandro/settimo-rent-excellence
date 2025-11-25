'use client';

/**
 * Admin Analytics Page
 * Dashboard analytics con grafici e metriche
 */

import { useAdminAnalytics, useAdminDashboard } from '@/lib/features/admin';
import { StatCard } from '@/components/admin/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SourceBadge } from '@/components/admin/source-badge';
import { Progress } from '@/components/ui/progress';
import type { LeadSource } from '@/lib/core/storage';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();
  const { data: stats, isLoading: statsLoading } = useAdminDashboard();

  const isLoading = analyticsLoading || statsLoading;

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (!analytics || !stats) {
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
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Metriche e performance del sito
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Lead Questo Mese"
          value={stats.leads.thisMonth}
          description="lead generati"
          icon="users"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversions.leadToQuote}%`}
          description="lead → preventivo"
          icon="trendingUp"
        />
        <StatCard
          title="Preventivi"
          value={stats.quotes.total}
          description={`media €${stats.quotes.avgValue}/mese`}
          icon="fileText"
        />
        <StatCard
          title="Quote→Contact"
          value={`${stats.conversions.quoteToContact}%`}
          description="preventivo → contatto"
          icon="trendingUp"
        />
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Funnel di Conversione</CardTitle>
          <CardDescription>Performance del percorso utente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {analytics.funnelStats.map((step, index) => {
              const nextStep = analytics.funnelStats[index + 1];
              const percentage = index === 0 ? 100 : Math.round((step.count / analytics.funnelStats[0].count) * 100);
              
              return (
                <div key={step.step} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{step.step}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold">{step.count}</span>
                      <span className="text-sm text-muted-foreground">({percentage}%)</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-3" />
                  
                  {nextStep && (
                    <div className="flex items-center justify-end mt-2 text-sm text-muted-foreground">
                      <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                      {step.dropOffRate}% drop-off
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Source Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance per Fonte</CardTitle>
            <CardDescription>Leads e conversion rate per canale</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.sourceStats.length > 0 ? (
              <div className="space-y-4">
                {analytics.sourceStats.map((source) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <SourceBadge source={source.source} />
                      <div className="flex items-center gap-4 text-sm">
                        <span>{source.leads} leads</span>
                        <span className="font-semibold">{source.conversionRate}% conv.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={source.conversionRate} className="h-2 flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">
                Nessun dato disponibile
              </p>
            )}
          </CardContent>
        </Card>

        {/* Daily Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Ultimi 30 Giorni</CardTitle>
            <CardDescription>Lead giornalieri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Simple bar chart */}
              <div className="flex items-end h-40 gap-1">
                {analytics.dailyLeads.map((day, index) => {
                  const maxLeads = Math.max(...analytics.dailyLeads.map(d => d.leads), 1);
                  const height = (day.leads / maxLeads) * 100;
                  
                  return (
                    <div
                      key={day.date}
                      className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t relative group"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                          {new Date(day.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                          : {day.leads} lead
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>30 giorni fa</span>
                <span>Oggi</span>
              </div>
            </div>
            
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Totale periodo</p>
                <p className="text-2xl font-bold">
                  {analytics.dailyLeads.reduce((sum, d) => sum + d.leads, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Media giornaliera</p>
                <p className="text-2xl font-bold">
                  {(analytics.dailyLeads.reduce((sum, d) => sum + d.leads, 0) / 30).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Performing Days */}
      <Card>
        <CardHeader>
          <CardTitle>Giorni Migliori</CardTitle>
          <CardDescription>I 5 giorni con più lead</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.dailyLeads.filter(d => d.leads > 0).length > 0 ? (
            <div className="space-y-3">
              {[...analytics.dailyLeads]
                .filter(d => d.leads > 0)
                .sort((a, b) => b.leads - a.leads)
                .slice(0, 5)
                .map((day, index) => (
                  <div 
                    key={day.date} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium">
                        {new Date(day.date).toLocaleDateString('it-IT', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-bold">{day.leads} lead</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">
              Nessun dato disponibile
            </p>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💡 Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Migliora il drop-off del configuratore</p>
              <p className="text-sm text-muted-foreground">
                Il {analytics.funnelStats[2]?.dropOffRate || 0}% degli utenti abbandona al configuratore. 
                Considera di semplificare il processo o aggiungere un&apos;opzione di preventivo rapido.
              </p>
            </div>
          </div>
          {analytics.sourceStats.length > 0 && (
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">
                  {analytics.sourceStats.sort((a, b) => b.conversionRate - a.conversionRate)[0].source} 
                  {' '}è la fonte migliore
                </p>
                <p className="text-sm text-muted-foreground">
                  Con un conversion rate del {analytics.sourceStats.sort((a, b) => b.conversionRate - a.conversionRate)[0].conversionRate}%, 
                  considera di aumentare il budget su questo canale.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsSkeleton() {
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
      <Skeleton className="h-80" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}


