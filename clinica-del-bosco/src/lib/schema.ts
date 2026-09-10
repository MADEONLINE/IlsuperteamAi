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

/** MedicalWebPage per pagine servizio e pronto soccorso (con specialità e briciole). */
export function medicalWebPage(opzioni: {
  url: string;
  titolo: string;
  descrizione: string;
  briciole: Briciola[];
  specialita?: string | undefined;
  dataPubblicazione?: string;
  dataModifica?: string;
  autore?: { nome: string; url: string };
}): JsonLd {
  const pagina = webPage({ ...opzioni, tipo: 'MedicalWebPage' });
  pagina['audience'] = {
    '@type': 'PeopleAudience',
    audienceType: 'Proprietari di animali da compagnia',
  };
  pagina['medicalAudience'] = { '@type': 'MedicalAudience', audienceType: 'Patient' };
  if (opzioni.specialita) pagina['specialty'] = opzioni.specialita;
  if (opzioni.autore) {
    pagina['author'] = {
      '@type': 'Person',
      name: opzioni.autore.nome,
      url: urlAssoluto(opzioni.autore.url),
    };
    pagina['reviewedBy'] = pagina['author'];
  }
  pagina['breadcrumb'] = breadcrumbList([{ nome: 'Home', href: '/' }, ...opzioni.briciole]);
  return pagina;
}

/** EmergencyService dedicato alla pagina /pronto-soccorso (h24, stessa sede). */
export function emergencyService(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'EmergencyService',
    '@id': `${clinica.dominio.canonico}/pronto-soccorso#servizio`,
    name: `Pronto soccorso veterinario 24h — ${clinica.nome}`,
    url: urlAssoluto('/pronto-soccorso'),
    telephone: clinica.contatti.telefono.e164,
    address: postalAddress(),
    openingHours: 'Mo-Su 00:00-23:59',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    parentOrganization: { '@id': ID_ORGANIZZAZIONE },
    areaServed: clinica.areaServita.map((z) => ({ '@type': 'City', name: z.nome })),
    availableService: [
      { '@type': 'MedicalProcedure', name: 'Triage e stabilizzazione' },
      { '@type': 'MedicalProcedure', name: 'Terapia intensiva e ossigenoterapia' },
      { '@type': 'MedicalProcedure', name: "Chirurgia d'urgenza" },
      { '@type': 'MedicalTest', name: 'Esami di laboratorio in sede' },
      { '@type': 'ImagingTest', name: 'Radiologia digitale, ecografia, TAC' },
    ],
  };
}

/** FAQPage da una lista domanda/risposta (le stesse coppie visibili nella pagina). */
export function faqPage(voci: Array<{ domanda: string; risposta: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: voci.map((v) => ({
      '@type': 'Question',
      name: v.domanda,
      acceptedAnswer: { '@type': 'Answer', text: v.risposta },
    })),
  };
}

/** Physician/Person per le schede équipe, con memberOf verso la clinica. */
export function physician(medico: {
  slug: string;
  nome: string;
  titolo: string;
  ruolo: string;
  specializzazioni: string[];
  numeroOrdine: string;
  provinciaOrdine: string;
  foto?: string;
}): JsonLd {
  const persona: JsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Physician', 'Person'],
    '@id': `${urlAssoluto(`/equipe/${medico.slug}`)}#persona`,
    name: `${medico.titolo} ${medico.nome}`,
    givenName: medico.nome.split(' ')[0],
    familyName: medico.nome.split(' ').slice(1).join(' '),
    honorificPrefix: medico.titolo,
    jobTitle: medico.ruolo,
    url: urlAssoluto(`/equipe/${medico.slug}`),
    worksFor: { '@id': ID_ORGANIZZAZIONE },
    memberOf: { '@id': ID_ORGANIZZAZIONE },
    knowsAbout: medico.specializzazioni.filter((x) => !daConfermare(x)),
  };
  if (!daConfermare(medico.numeroOrdine) && !daConfermare(medico.provinciaOrdine)) {
    persona['identifier'] = {
      '@type': 'PropertyValue',
      propertyID: `Ordine dei Medici Veterinari di ${medico.provinciaOrdine}`,
      value: medico.numeroOrdine,
    };
    persona['memberOf'] = [
      { '@id': ID_ORGANIZZAZIONE },
      {
        '@type': 'Organization',
        name: `Ordine dei Medici Veterinari della Provincia di ${medico.provinciaOrdine}`,
      },
    ];
  }
  if (medico.foto) persona['image'] = urlAssoluto(medico.foto);
  return persona;
}

/** Service + Offer per i Piani Salute. */
export function pianoSaluteOffer(piano: {
  id: string;
  nome: string;
  descrizione: string;
  prezzoAnnuo: number;
  valuta: string;
  include: string[];
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${urlAssoluto('/piani-salute')}#${piano.id}`,
    name: `Piano Salute ${piano.nome}`,
    serviceType: 'Programma di prevenzione veterinaria programmata',
    description: piano.descrizione,
    provider: { '@id': ID_ORGANIZZAZIONE },
    areaServed: clinica.areaServita.map((z) => ({ '@type': 'City', name: z.nome })),
    audience: { '@type': 'PeopleAudience', audienceType: 'Proprietari di cani e gatti' },
    offers: {
      '@type': 'Offer',
      url: urlAssoluto(`/piani-salute#${piano.id}`),
      price: piano.prezzoAnnuo,
      priceCurrency: piano.valuta,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: piano.prezzoAnnuo,
        priceCurrency: piano.valuta,
        unitText: 'anno',
        billingIncrement: 1,
      },
      availability: 'https://schema.org/InStock',
      itemOffered: { '@type': 'Service', name: `Piano Salute ${piano.nome}` },
      seller: { '@id': ID_ORGANIZZAZIONE },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Prestazioni incluse nel Piano ${piano.nome}`,
      itemListElement: piano.include.map((voce) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: voce },
      })),
    },
  };
}

/** Article (MedicalScholarlyArticle no: è divulgativo) con autore, revisore e date. */
export function article(opzioni: {
  url: string;
  titolo: string;
  descrizione: string;
  dataPubblicazione: string;
  dataModifica: string;
  autore: { nome: string; url: string };
  revisore?: { nome: string; url: string };
  immagine?: string;
  tag?: string[];
  parole?: number;
}): JsonLd {
  const art: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${urlAssoluto(opzioni.url)}#articolo`,
    headline: opzioni.titolo,
    description: opzioni.descrizione,
    url: urlAssoluto(opzioni.url),
    mainEntityOfPage: { '@id': `${urlAssoluto(opzioni.url)}#pagina` },
    inLanguage: 'it-IT',
    datePublished: opzioni.dataPubblicazione,
    dateModified: opzioni.dataModifica,
    author: { '@type': 'Person', name: opzioni.autore.nome, url: urlAssoluto(opzioni.autore.url) },
    publisher: { '@id': ID_ORGANIZZAZIONE },
    image: urlAssoluto(opzioni.immagine ?? '/og/default.png'),
    isAccessibleForFree: true,
  };
  if (opzioni.revisore)
    art['reviewedBy'] = {
      '@type': 'Person',
      name: opzioni.revisore.nome,
      url: urlAssoluto(opzioni.revisore.url),
    };
  if (opzioni.tag?.length) art['keywords'] = opzioni.tag.join(', ');
  if (opzioni.parole) art['wordCount'] = opzioni.parole;
  return art;
}

/** MedicalProcedure/MedicalTest per un servizio, agganciato all'organizzazione. */
export function servizioMedico(opzioni: {
  url: string;
  nome: string;
  descrizione: string;
  tipo?:
    | 'MedicalProcedure'
    | 'MedicalTest'
    | 'MedicalTherapy'
    | 'ImagingTest'
    | 'DiagnosticProcedure'
    | undefined;
  specialita?: string | undefined;
}): JsonLd {
  const s: JsonLd = {
    '@context': 'https://schema.org',
    '@type': opzioni.tipo ?? 'MedicalProcedure',
    '@id': `${urlAssoluto(opzioni.url)}#servizio`,
    name: opzioni.nome,
    description: opzioni.descrizione,
    url: urlAssoluto(opzioni.url),
    provider: { '@id': ID_ORGANIZZAZIONE },
  };
  if (opzioni.specialita) s['relevantSpecialty'] = opzioni.specialita;
  return s;
}

export { ID_ORGANIZZAZIONE, ID_SITO };
