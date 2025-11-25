'use client';

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { SavedQuote } from '@/lib/quotes/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: 'bold',
  },
  total: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: '1 solid #ccc',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    paddingTop: 10,
    borderTop: '1 solid #ccc',
    fontSize: 10,
    color: '#666',
  },
});

interface QuotePDFProps {
  quote: SavedQuote;
}

export function QuotePDF({ quote }: QuotePDFProps) {
  const data = quote as any;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Rent4Business Excellence</Text>
          <Text style={styles.subtitle}>Preventivo di Noleggio</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veicolo</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Marca e Modello:</Text>
            <Text style={styles.value}>
              {data.vehicle.marca} {data.vehicle.modello}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Versione:</Text>
            <Text style={styles.value}>{data.vehicle.versione}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parametri di Noleggio</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Durata:</Text>
            <Text style={styles.value}>{data.parametri.durata} mesi</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Anticipo:</Text>
            <Text style={styles.value}>{data.parametri.anticipo}%</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Chilometri/Anno:</Text>
            <Text style={styles.value}>{data.parametri.kmAnno.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Manutenzione:</Text>
            <Text style={styles.value}>
              {data.parametri.manutenzione ? 'Inclusa' : 'Non inclusa'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Assicurazione:</Text>
            <Text style={styles.value}>
              {data.parametri.assicurazione ? 'Inclusa' : 'Non inclusa'}
            </Text>
          </View>
        </View>

        {data.servizi.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Servizi Aggiuntivi</Text>
            {data.servizi.map((servizio: string, index: number) => (
              <Text key={index}>• {servizio}</Text>
            ))}
          </View>
        )}

        <View style={styles.total}>
          <View style={styles.row}>
            <Text style={styles.label}>Canone Mensile:</Text>
            <Text style={styles.value}>€{data.canone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalText}>Totale per {data.parametri.durata} mesi:</Text>
            <Text style={styles.totalText}>€{data.totale}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            Preventivo generato il {format(new Date(('createdAt' in quote ? quote.createdAt : new Date().toISOString())), 'dd MMMM yyyy', { locale: it })}
          </Text>
          <Text>Rent4Business Excellence - Noleggio Auto a Lungo Termine</Text>
        </View>
      </Page>
    </Document>
  );
}



