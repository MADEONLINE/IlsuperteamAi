/**
 * /assistente.json — la base di conoscenza dell'assistente del sito.
 *
 * Generata a build time dai contenuti reali (FAQ, servizi, pagine principali):
 * l'assistente non inventa nulla e non interroga servizi esterni, cerca solo
 * dentro quello che la clinica ha già pubblicato. Il file viene scaricato la
 * prima volta che qualcuno apre l'assistente, non pesa sul caricamento delle
 * pagine.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { clinica, indirizzoRiga } from '@lib/clinica';
import { orariLeggibili } from '@lib/orari';

/** Testo pulito dal Markdown, ridotto a un estratto leggibile. */
function estratto(markdown: string, caratteri = 260): string {
  const piano = markdown
    .replace(/^---[\s\S]*?---/, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (piano.length <= caratteri) return piano;
  const taglio = piano.slice(0, caratteri);
  const ultimo = taglio.lastIndexOf('. ');
  return (ultimo > caratteri * 0.5 ? taglio.slice(0, ultimo + 1) : taglio.trimEnd() + '…').trim();
}

/** Sinonimi e modi di dire: come la gente cerca davvero, non come scriviamo noi. */
const SINONIMI: Record<string, string[]> = {
  urgenze: ['urgenza', 'emergenza', 'subito', 'notte', 'notturno', 'festivo', 'domenica', 'pronto'],
  visite: ['visita', 'appuntamento', 'prenotare', 'prenotazione', 'controllo'],
  costi: ['costo', 'prezzo', 'prezzi', 'tariffa', 'tariffe', 'quanto', 'pagare', 'preventivo'],
  chirurgia: ['operazione', 'intervento', 'operare', 'sterilizzazione'],
  diagnostica: ['tac', 'radiografia', 'lastra', 'ecografia', 'analisi', 'esami', 'endoscopia'],
  'piani-salute': ['abbonamento', 'piano', 'prevenzione', 'vaccini', 'vaccinazione'],
  struttura: ['dove', 'indirizzo', 'parcheggio', 'parcheggiare', 'arrivare', 'orari', 'aperto'],
  esotici: ['coniglio', 'furetto', 'criceto', 'tartaruga', 'pappagallo', 'rettile', 'uccello'],
};

/** Orari dell'ambulatorio in una riga: se i giorni coincidono non li elenca uno per uno. */
function orariAmbulatorio(): string {
  const righe = orariLeggibili(clinica.orari.ambulatorio.settimana);
  const distinti = new Set(righe.map((r) => r.fasce));
  if (distinti.size === 1) return `tutti i giorni, ${righe[0]?.fasce}`;
  return righe.map((r) => `${r.giorno} ${r.fasce}`).join(' · ');
}

interface Voce {
  t: string; // titolo
  u: string; // url
  e: string; // estratto
  k: string[]; // parole chiave
  c: string; // categoria mostrata come etichetta
}

export const GET: APIRoute = async () => {
  const voci: Voce[] = [];

  // --- Domande frequenti: sono già scritte per rispondere, vanno benissimo così.
  const faq = (await getCollection('faq')).sort((a, b) => a.data.ordine - b.data.ordine);
  for (const f of faq) {
    voci.push({
      t: f.data.domanda,
      u: f.data.paginaCorrelata ?? `/domande-frequenti#${f.id}`,
      e: estratto(f.body ?? ''),
      k: [...(SINONIMI[f.data.categoria] ?? []), f.data.categoria],
      c: 'Domanda frequente',
    });
  }

  // --- Servizi.
  const servizi = (await getCollection('servizi')).sort((a, b) => a.data.ordine - b.data.ordine);
  for (const s of servizi) {
    voci.push({
      t: s.data.titoloBreve,
      u: `/servizi/${s.id}`,
      e: s.data.sottotitolo,
      k: [s.data.categoria],
      c: 'Servizio',
    });
  }

  // --- Pagine principali: è la parte "ti accompagno nel sito".
  const pagine: Array<[string, string, string, string[]]> = [
    [
      'Pronto soccorso 24 ore su 24',
      '/pronto-soccorso',
      `${clinica.orari.prontoSoccorso.etichetta}. Si arriva direttamente, senza appuntamento: al telefono risponde sempre un medico.`,
      SINONIMI['urgenze'] ?? [],
    ],
    [
      'Prenotare una visita',
      '/prenota',
      'Il modulo raccoglie i dati dell’animale e le tue preferenze di giorno e orario. Ti richiamiamo per confermare.',
      SINONIMI['visite'] ?? [],
    ],
    [
      'Piani Salute',
      '/piani-salute',
      'Un calendario annuale di visite, vaccini, antiparassitari ed esami, con una rata mensile fissa.',
      SINONIMI['piani-salute'] ?? [],
    ],
    [
      'La prima visita',
      '/prima-visita',
      'Come si svolge la prima visita, cosa portare e quanto dura.',
      ['prima volta', 'nuovo paziente', 'cosa portare'],
    ],
    [
      'La struttura',
      '/la-struttura',
      `Ospedale veterinario a ${clinica.indirizzo.comune}: sale chirurgiche, TAC in sede, terapia intensiva e laboratorio interno.`,
      SINONIMI['struttura'] ?? [],
    ],
    [
      'Dove siamo e come arrivare',
      '/contatti',
      `${indirizzoRiga}. ${clinica.indirizzo.riferimenti} ${clinica.indirizzo.parcheggio}`,
      ['dove', 'mappa', 'indicazioni', 'parcheggio', 'telefono', 'email'],
    ],
    [
      'Orari',
      '/contatti',
      `Visite su appuntamento: ${orariAmbulatorio()}. Il pronto soccorso è invece attivo 24 ore su 24, festivi inclusi.`,
      ['orari', 'aperto', 'chiuso', 'quando', 'apertura'],
    ],
    [
      'L’équipe medica',
      '/equipe',
      'I medici della clinica, le loro aree cliniche e i giorni in cui ricevono gli specialisti.',
      ['medico', 'medici', 'veterinario', 'chi', 'dottore', 'specialista'],
    ],
    [
      'Per i colleghi veterinari',
      '/per-i-colleghi',
      'Invio di casi in seconda opinione, TAC, endoscopia e chirurgia in service. Il paziente torna sempre al collega.',
      ['collega', 'referente', 'secondo parere', 'service', 'invio'],
    ],
    [
      'Magazine',
      '/magazine',
      'Guide scritte dai medici della clinica su prevenzione, urgenze e malattie più comuni.',
      ['articoli', 'guide', 'consigli', 'blog'],
    ],
    [
      'Lavora con noi',
      '/lavora-con-noi',
      'Le posizioni aperte, come sono organizzati i turni e come candidarsi.',
      ['lavoro', 'assunzione', 'candidatura', 'curriculum'],
    ],
    [
      'Domande frequenti',
      '/domande-frequenti',
      'Tutte le risposte su urgenze, visite, costi, esami e Piani Salute.',
      ['faq', 'domande', 'dubbi'],
    ],
  ];
  for (const [t, u, e, k] of pagine) voci.push({ t, u, e, k, c: 'Pagina' });

  const corpo = {
    aggiornato: new Date().toISOString().slice(0, 10),
    telefono: clinica.contatti.telefono.visualizzato,
    telefonoE164: clinica.contatti.telefono.e164,
    voci,
  };
  return new Response(JSON.stringify(corpo), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
