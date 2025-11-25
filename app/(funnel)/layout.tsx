'use client';

/**
 * Funnel Layout
 * Layout ultra-minimal per massimizzare conversioni
 */

import Link from 'next/link';
import { useConfiguratorStore } from '@/lib/features/configurator';
import { config } from '@/lib/core/config';
import { MessageCircle } from 'lucide-react';

export default function FunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const progress = useConfiguratorStore(state => state.getProgress());
  const currentStep = useConfiguratorStore(state => state.currentStep);

  const whatsappUrl = `https://wa.me/${config.app.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Ciao, vorrei informazioni sul noleggio auto')}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header Minimal */}
      <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container h-full flex items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">{config.app.name}</span>
          </Link>

          {/* Progress Bar */}
          <div className="hidden sm:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Step {currentStep}/4
            </span>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="hidden sm:inline">Hai bisogno di aiuto?</span>
          </a>
        </div>

        {/* Mobile Progress Bar */}
        <div className="sm:hidden h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer Minimal */}
      <footer className="py-4 border-t bg-muted/30">
        <div className="container px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/termini" className="hover:text-foreground transition-colors">
                Termini e Condizioni
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span>Hai domande?</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
              >
                <MessageCircle className="h-4 w-4" />
                Scrivici su WhatsApp
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


