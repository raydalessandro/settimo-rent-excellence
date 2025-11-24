import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Rent4Business Excellence</h3>
            <p className="text-sm text-muted-foreground">
              Noleggio auto a lungo termine per aziende. Soluzioni personalizzate e servizi dedicati.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Servizi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/offerte" className="text-muted-foreground hover:text-foreground">
                  Catalogo Veicoli
                </Link>
              </li>
              <li>
                <Link href="/configuratore" className="text-muted-foreground hover:text-foreground">
                  Configuratore
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Azienda</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/chi-siamo" className="text-muted-foreground hover:text-foreground">
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="text-muted-foreground hover:text-foreground">
                  Contatti
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Supporto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Rent4Business Excellence. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}

