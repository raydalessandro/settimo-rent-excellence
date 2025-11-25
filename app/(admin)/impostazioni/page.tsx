'use client';

/**
 * Admin Settings Page
 * Impostazioni del pannello admin
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { config } from '@/lib/core/config';
import { Save, Mail, Bell, Shield, Database } from 'lucide-react';

export default function AdminSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newLeadAlert, setNewLeadAlert] = useState(true);
  const [dailyReport, setDailyReport] = useState(false);
  const [adminEmail, setAdminEmail] = useState(config.app.email);

  const handleSave = () => {
    // In una implementazione reale, salverebbe le impostazioni
    toast.success('Impostazioni salvate');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Impostazioni</h1>
        <p className="text-muted-foreground">
          Configura il pannello di amministrazione
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notifiche */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifiche
            </CardTitle>
            <CardDescription>
              Configura le notifiche per nuovi lead
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifiche Email</Label>
                <p className="text-sm text-muted-foreground">
                  Ricevi email per ogni nuovo lead
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Alert Nuovo Lead</Label>
                <p className="text-sm text-muted-foreground">
                  Notifica push per nuovi lead
                </p>
              </div>
              <Switch
                checked={newLeadAlert}
                onCheckedChange={setNewLeadAlert}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Report Giornaliero</Label>
                <p className="text-sm text-muted-foreground">
                  Ricevi un riepilogo giornaliero
                </p>
              </div>
              <Switch
                checked={dailyReport}
                onCheckedChange={setDailyReport}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contatti
            </CardTitle>
            <CardDescription>
              Email per le notifiche admin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email Admin</Label>
              <Input
                id="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Questa email riceverà le notifiche per nuovi lead e report.
            </p>
          </CardContent>
        </Card>

        {/* Info App */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Informazioni App
            </CardTitle>
            <CardDescription>
              Dettagli della configurazione attuale
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Nome App</Label>
                <p className="font-medium">{config.app.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Versione</Label>
                <p className="font-medium">{"1.0.0"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Ambiente</Label>
                <p className="font-medium">{"development"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Azienda</Label>
                <p className="font-medium">{config.app.company}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Feature Flags
            </CardTitle>
            <CardDescription>
              Funzionalità attive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {Object.entries(config.features).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {value ? 'Attivo' : 'Disattivo'}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Le feature flags sono configurate via variabili d&apos;ambiente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salva Impostazioni
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zona Pericolosa</CardTitle>
          <CardDescription>
            Azioni irreversibili
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Esporta Tutti i Dati</p>
              <p className="text-sm text-muted-foreground">
                Scarica tutti i lead e preventivi in formato JSON
              </p>
            </div>
            <Button variant="outline">
              Esporta
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
            <div>
              <p className="font-medium text-destructive">Reset Dati Demo</p>
              <p className="text-sm text-muted-foreground">
                Riporta il sistema ai dati di esempio iniziali
              </p>
            </div>
            <Button variant="destructive">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


