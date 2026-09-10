/**
 * Generatori JSON-LD tipizzati. Nessuna stringa copiata a mano nei componenti:
 * ogni pagina compone gli oggetti qui definiti e li passa a <JsonLd />.
 * Espansi nelle fasi successive (MedicalWebPage, Physician, Offer, Article...).
 */
import {
  clinica,
  daConfermare,
  emailPrincipale,
  geoDisponibile,
  indicazioniHref,
  sameAs,
  urlAssoluto,
} from '@lib/clinica';
import { openingHoursSpecification } from '@lib/orari';
import type { Briciola } from '@lib/seo';

export type JsonLd = Record<string, unknown> & { '@context'?: string; '@type': string | string[] };

const ID_ORGANIZZAZIONE = `${clinica.dominio.canonico}/#organizzazione`;
const ID_SITO = `${clinica.dominio.canonico}/#sito`;

/** Indirizzo postale condiviso da tutte le entità. */
export function postalAddress(): JsonLd {
  return {
    '@type': 'PostalAddress',
    streetAddress: `${clinica.indirizzo.via} ${clinica.indirizzo.civico}`,
    postalCode: clinica.indirizzo.cap,
    addressLocality: clinica.indirizzo.comune,
    addressRegion: clinica.indirizzo.provinciaEstesa,
    addressCountry: clinica.indirizzo.paese,
  };
}

/**
 * Entità principale: VeterinaryCare (sottotipo di MedicalOrganization e LocalBusiness).
 * Inclusa in ogni pagina tramite BaseLayout, con @id stabile per i riferimenti.
 */
export function veterinaryCare(estensioni: Record<string, unknown> = {}): JsonLd {
  const base: JsonLd = {
    '@context': 'https://schema.org',
    '@type': ['VeterinaryCare', 'MedicalOrganization', 'LocalBusiness', 'EmergencyService'],
    '@id': ID_ORGANIZZAZIONE,
    name: clinica.nome,
    legalName: clinica.ragioneSociale,
    vatID: `IT${clinica.partitaIva}`,
    url: `${clinica.dominio.canonico}/`,
    logo: urlAssoluto('/og/logo.png'),
    image: urlAssoluto('/og/default.png'),
    description: clinica.descrizioneBreve,
    telephone: clinica.contatti.telefono.e164,
    email: emailPrincipale,
    address: postalAddress(),
    hasMap: indicazioniHref,
    priceRange: clinica.priceRange,
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card, Debit Card',
    isAccessibleForFree: false,
    openingHours: 'Mo-Su 00:00-23:59',
    openingHoursSpecification: openingHoursSpecification({
      ambulatorioConfermato: clinica.orari.ambulatorio.confermato,
      settimana: clinica.orari.ambulatorio.settimana,
    }),
    areaServed: clinica.areaServita.map((z) => ({
      '@type': z.tipo === 'comune' ? 'City' : 'Place',
      name: z.nome,
    })),
    sameAs,
    ...estensioni,
  };
  if (geoDisponibile) {
    base['geo'] = {
      '@type': 'GeoCoordinates',
      latitude: Number(clinica.geo.lat),
      longitude: Number(clinica.geo.lng),
    };
  }
  if (!daConfermare(clinica.annoFondazione)) base['foundingDate'] = clinica.annoFondazione;
  return base;
}

/** WebSite con riferimento all'organizzazione (entità di brand per Google e sistemi AI). */
export function webSite(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': ID_SITO,
    url: `${clinica.dominio.canonico}/`,
    name: clinica.nome,
    inLanguage: 'it-IT',
    publisher: { '@id': ID_ORGANIZZAZIONE },
  };
}

/** BreadcrumbList a partire dalle briciole visibili (stessa fonte: mai disallineati). */
export function breadcrumbList(briciole: Briciola[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: briciole.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.nome,
      item: urlAssoluto(b.href),
    })),
  };
}

/** WebPage generica collegata a organizzazione e sito. */
export function webPage(opzioni: {
  url: string;
  titolo: string;
  descrizione: string;
  tipo?: 'WebPage' | 'MedicalWebPage' | 'AboutPage' | 'ContactPage' | 'FAQPage' | 'CollectionPage';
  dataPubblicazione?: string;
  dataModifica?: string;
}): JsonLd {
  const pagina: JsonLd = {
    '@context': 'https://schema.org',
    '@type': opzioni.tipo ?? 'WebPage',
    '@id': `${urlAssoluto(opzioni.url)}#pagina`,
    url: urlAssoluto(opzioni.url),
    name: opzioni.titolo,
    description: opzioni.descrizione,
    inLanguage: 'it-IT',
    isPartOf: { '@id': ID_SITO },
    about: { '@id': ID_ORGANIZZAZIONE },
  };
  if (opzioni.dataPubblicazione) pagina['datePublished'] = opzioni.dataPubblicazione;
  if (opzioni.dataModifica) pagina['dateModified'] = opzioni.dataModifica;
  return pagina;
}

export { ID_ORGANIZZAZIONE, ID_SITO };
