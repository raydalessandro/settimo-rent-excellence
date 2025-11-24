# Rent4Business Excellence

Progetto Next.js 15 professionale per noleggio auto a lungo termine per aziende.

## 🚀 Tecnologie

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS** + **shadcn/ui**
- **Zustand** (state management + localStorage)
- **TanStack Query v5** (data fetching)
- **React Hook Form** + **Zod** (form validation)
- **@react-pdf/renderer** (PDF generation)
- **Sonner** (toast notifications)
- **Lucide React** (icons)

## 📁 Architettura Modulare

Il progetto è strutturato in moduli completamente indipendenti che comunicano esclusivamente tramite il database centrale:

- `lib/auth/` - Autenticazione (login, registrazione, sessione)
- `lib/vehicles/` - Catalogo veicoli e filtri
- `lib/favorites/` - Gestione preferiti
- `lib/quotes/` - Preventivi salvati
- `lib/configurator/` - Configuratore preventivi
- `lib/orders/` - Richieste contatto
- `lib/db.ts` - Database centrale (Zustand + localStorage)

## 🎯 Funzionalità

### Autenticazione
- Login e registrazione con validazione Zod
- Sessione persistente in localStorage
- Route protection per pagine protette
- Guest mode per navigazione anonima

### Catalogo Veicoli
- 218+ veicoli con immagini reali
- Filtri avanzati (marca, categoria, alimentazione, canone, anticipo zero)
- Dettaglio veicolo con carousel immagini
- Aggiunta ai preferiti (solo utenti loggati)

### Configuratore Preventivi
- Stepper a 4 step:
  1. Parametri (durata, anticipo, km/anno, servizi base)
  2. Servizi aggiuntivi (GPS, sostituzione, consegna, ritiro)
  3. Calcolo preventivo
  4. Riepilogo e salvataggio

### Preferiti e Preventivi
- Salvataggio preferiti per utente
- Salvataggio automatico preventivi
- Pagina "I Miei Preventivi" con lista cronologica
- Download PDF preventivo

### Form Contatto
- Richiesta contatto da preventivo
- Salvataggio in database centrale

## 🛠️ Setup

```bash
# Installazione dipendenze
npm install

# Sviluppo
npm run dev

# Build produzione
npm run build

# Avvio produzione
npm start
```

## 📦 Database

Il database è simulato con Zustand + localStorage persistence. Tutti i dati vengono salvati localmente e persistono tra le sessioni.

Struttura:
- `users` - Utenti registrati
- `favorites` - Preferiti per utente
- `quotes` - Preventivi salvati
- `orders` - Richieste contatto

## 🎨 UI/UX

- Design moderno e responsive
- Mobile-first
- Loading states e skeleton
- Error boundaries
- Toast notifications
- PWA ready

## 📄 Licenza

Proprietario - Rent4Business Excellence
