/**
 * Accesso tipizzato e validato ai dati della clinica (src/data/clinica.json).
 * Tutto il sito passa da qui: nessun dato di contatto va scritto nei componenti.
 */
import { z } from 'zod';
import datiGrezzi from '@dati/clinica.json';

export const PLACEHOLDER = '{{DA_CONFERMARE}}';

/** Vero se il valore è ancora un segnaposto da confermare con la clinica. */
export function daConfermare(valore: unknown): boolean {
  return typeof valore === 'string' && valore.includes(PLACEHOLDER);
}

const fascia = z.tuple([z.string().regex(/^\d{2}:\d{2}$/), z.string().regex(/^\d{2}:\d{2}$/)]);

const giorniSettimana = [
  'lunedi',
  'martedi',
  'mercoledi',
  'giovedi',
  'venerdi',
  'sabato',
  'domenica',
] as const;
export type GiornoSettimana = (typeof giorniSettimana)[number];

const schemaClinica = z.object({
  nome: z.string().min(1),
  nomeBreve: z.string().min(1),
  ragioneSociale: z.string().min(1),
  partitaIva: z.string().regex(/^\d{11}$/),
  partitaIvaDaVerificare: z.boolean(),
  annoFondazione: z.string(),
  slogan: z.string(),
  descrizioneBreve: z.string().min(50),
  dominio: z.object({
    canonico: z.url(),
    alternativi: z.array(z.url()),
  }),
  indirizzo: z.object({
    via: z.string(),
    civico: z.string(),
    civicoDaConfermare: z.boolean(),
    cap: z.string().regex(/^\d{5}$/),
    comune: z.string(),
    provincia: z.string().length(2),
    provinciaEstesa: z.string(),
    regione: z.string(),
    paese: z.literal('IT'),
    riferimenti: z.string(),
    parcheggio: z.string(),
  }),
  geo: z.object({ lat: z.string(), lng: z.string() }),
  contatti: z.object({
    telefono: z.object({
      visualizzato: z.string(),
      e164: z.string().regex(/^\+\d{6,15}$/),
      nota: z.string().optional(),
    }),
    email: z.object({
      principale: z.email(),
      proposta: z.object({
        info: z.email(),
        urgenze: z.email(),
        attiva: z.boolean(),
      }),
    }),
    pec: z.string(),
  }),
  social: z.object({
    facebook: z.url(),
    instagram: z.url(),
    instagramHandle: z.string(),
    googleBusiness: z.string(),
  }),
  orari: z.object({
    fusoOrario: z.literal('Europe/Rome'),
    prontoSoccorso: z.object({
      h24: z.literal(true),
      personaleInStruttura: z.boolean(),
      festiviInclusi: z.boolean(),
      etichetta: z.string(),
      accessoDiretto: z.boolean().default(true),
      rispondeUnMedico: z.boolean().default(true),
      aiutoAllArrivo: z.boolean().nullable().default(null),
      proprietarioAccanto: z.boolean().nullable().default(null),
    }),
    ambulatorio: z.object({
      confermato: z.boolean(),
      settimana: z.object(
        Object.fromEntries(giorniSettimana.map((g) => [g, z.array(fascia)])) as Record<
          GiornoSettimana,
          z.ZodArray<typeof fascia>
        >,
      ),
    }),
  }),
  direttoreSanitario: z.object({
    nome: z.string(),
    titolo: z.string(),
    numeroOrdine: z.string(),
    provinciaOrdine: z.string(),
  }),
  soci: z.array(z.object({ nome: z.string(), titolo: z.string(), slug: z.string() })),
  numeri: z.object({
    confermato: z.boolean(),
    clientiAttivi: z.number().int(),
    animaliSeguiti: z.number().int(),
    accessiProntoSoccorsoUltimoAnno: z.number().int(),
    residentiBacino: z.number().int(),
  }),
  areaServita: z.array(
    z.object({ nome: z.string(), slug: z.string(), tipo: z.enum(['comune', 'area']) }),
  ),
  priceRange: z.string(),
  struttura: z.object({
    metriQuadri: z.number().int(),
    saleVisita: z.number().int(),
    saleChirurgiche: z.number().int(),
    postiDegenza: z.number().int(),
    veterinari: z.number().int(),
    tecnici: z.number().int(),
    reception: z.number().int(),
    confermato: z.boolean(),
  }),
  impegni: z.object({
    richiamoEntroOre: z.number().int().positive(),
    preventivoScritto: z.boolean(),
    nessunPagamentoAnticipato: z.boolean(),
  }),
  misurazione: z.object({
    plausibleDomain: z.string(),
    plausibleScript: z.url(),
    ga4MeasurementId: z.string(),
    googleSiteVerification: z.string(),
    bingSiteVerification: z.string(),
    indexNowKey: z.string(),
  }),
});

export type Clinica = z.infer<typeof schemaClinica>;

const risultato = schemaClinica.safeParse(datiGrezzi);
if (!risultato.success) {
  throw new Error(
    `src/data/clinica.json non è valido:\n${risultato.error.issues
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n')}`,
  );
}

export const clinica: Clinica = risultato.data;

/* ---------- Helper derivati (una sola definizione per tutto il sito) ---------- */

/** Indirizzo su una riga: "Corso Umberto I 12, 80055 Portici (NA)". */
export const indirizzoRiga = `${clinica.indirizzo.via} ${clinica.indirizzo.civico}, ${clinica.indirizzo.cap} ${clinica.indirizzo.comune} (${clinica.indirizzo.provincia})`;

/** Indirizzo breve per header/hero: "Corso Umberto I 12, Portici". */
export const indirizzoBreve = `${clinica.indirizzo.via} ${clinica.indirizzo.civico}, ${clinica.indirizzo.comune}`;

/** Link tel: con numero reale in formato E.164. */
export const telHref = `tel:${clinica.contatti.telefono.e164}`;

/** Email operativa: quella sul dominio se attiva, altrimenti quella attuale. */
export const emailPrincipale = clinica.contatti.email.proposta.attiva
  ? clinica.contatti.email.proposta.info
  : clinica.contatti.email.principale;

export const emailUrgenze = clinica.contatti.email.proposta.attiva
  ? clinica.contatti.email.proposta.urgenze
  : clinica.contatti.email.principale;

const destinazione = encodeURIComponent(`${clinica.nome}, ${indirizzoRiga}`);

/** Deep link "Indicazioni" (Google Maps universale: apre l'app su mobile, il sito su desktop). */
export const indicazioniHref = `https://www.google.com/maps/dir/?api=1&destination=${destinazione}&travelmode=driving`;

/** Deep link Apple Maps per iOS. */
export const indicazioniAppleHref = `https://maps.apple.com/?daddr=${destinazione}&dirflg=d`;

/** Vero se le coordinate GPS sono numeriche e utilizzabili. */
export const geoDisponibile =
  !daConfermare(clinica.geo.lat) &&
  !daConfermare(clinica.geo.lng) &&
  Number.isFinite(Number(clinica.geo.lat)) &&
  Number.isFinite(Number(clinica.geo.lng));

/** URL assoluto a partire da un percorso relativo al sito. */
export function urlAssoluto(percorso: string): string {
  const base = clinica.dominio.canonico.replace(/\/$/, '');
  const p = percorso.startsWith('/') ? percorso : `/${percorso}`;
  return `${base}${p}`;
}

/** Direttore sanitario formattato per il footer (con segnaposto se mancante). */
export const direttoreSanitarioRiga = `${clinica.direttoreSanitario.titolo} ${clinica.direttoreSanitario.nome} — Iscrizione Ordine dei Medici Veterinari di ${clinica.direttoreSanitario.provinciaOrdine} n. ${clinica.direttoreSanitario.numeroOrdine}`;

/** sameAs per schema.org: solo URL reali (i segnaposto vengono esclusi). */
export const sameAs = [
  clinica.social.facebook,
  clinica.social.instagram,
  clinica.social.googleBusiness,
].filter((u) => !daConfermare(u));

export { giorniSettimana };
