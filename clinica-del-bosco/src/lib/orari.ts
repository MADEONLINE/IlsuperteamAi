/**
 * Logica orari — pura, senza dipendenze, usata sia in build (Astro) sia nel browser
 * (badge "Aperto ora"). Fuso orario sempre Europe/Rome.
 *
 * Regola d'oro: il pronto soccorso è SEMPRE aperto. Il badge non deve mai mostrare
 * "chiuso" per errore: in caso di dubbio si mostra lo stato statico h24.
 */

export type Fascia = [apertura: string, chiusura: string];
export type Settimana = Record<
  'lunedi' | 'martedi' | 'mercoledi' | 'giovedi' | 'venerdi' | 'sabato' | 'domenica',
  Fascia[]
>;

export interface OrariInput {
  ambulatorioConfermato: boolean;
  settimana: Settimana;
}

export interface StatoOrari {
  /** Sempre true: il PS è h24. Esposto per chiarezza semantica. */
  prontoSoccorsoAperto: true;
  /** 'aperto' | 'chiuso' | 'sconosciuto' (orari non ancora confermati) */
  ambulatorio: 'aperto' | 'chiuso' | 'sconosciuto';
  /** Orario locale "HH:MM" a Portici */
  oraLocale: string;
  /** Es. "fino alle 20:00" oppure "riapre lunedì alle 09:00" */
  dettaglioAmbulatorio: string | null;
}

const NOMI_GIORNI: Array<keyof Settimana> = [
  'domenica',
  'lunedi',
  'martedi',
  'mercoledi',
  'giovedi',
  'venerdi',
  'sabato',
];
const ETICHETTE_GIORNI: Record<keyof Settimana, string> = {
  lunedi: 'lunedì',
  martedi: 'martedì',
  mercoledi: 'mercoledì',
  giovedi: 'giovedì',
  venerdi: 'venerdì',
  sabato: 'sabato',
  domenica: 'domenica',
};

/** Estrae giorno della settimana e minuti dalla mezzanotte nel fuso Europe/Rome. */
export function oraRoma(adesso: Date = new Date()): {
  giorno: keyof Settimana;
  minuti: number;
  hhmm: string;
} {
  const parti = new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(adesso);
  const leggi = (tipo: string) => parti.find((p) => p.type === tipo)?.value ?? '';
  const ore = Number(leggi('hour')) % 24;
  const minuti = Number(leggi('minute'));
  const nomeGiorno = leggi('weekday').toLowerCase();
  const giorno =
    NOMI_GIORNI.find((g) => ETICHETTE_GIORNI[g] === nomeGiorno) ??
    NOMI_GIORNI[adesso.getDay()] ??
    'lunedi';
  return {
    giorno,
    minuti: ore * 60 + minuti,
    hhmm: `${String(ore).padStart(2, '0')}:${String(minuti).padStart(2, '0')}`,
  };
}

function aMinuti(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** Calcola lo stato corrente. Non lancia mai: in caso di errore restituisce 'sconosciuto'. */
export function statoOrari(input: OrariInput, adesso: Date = new Date()): StatoOrari {
  const base: StatoOrari = {
    prontoSoccorsoAperto: true,
    ambulatorio: 'sconosciuto',
    oraLocale: '',
    dettaglioAmbulatorio: null,
  };
  try {
    const { giorno, minuti, hhmm } = oraRoma(adesso);
    base.oraLocale = hhmm;
    if (!input.ambulatorioConfermato) return base;

    const fasceOggi = input.settimana[giorno] ?? [];
    const fasciaAperta = fasceOggi.find(([a, c]) => minuti >= aMinuti(a) && minuti < aMinuti(c));
    if (fasciaAperta) {
      return {
        ...base,
        ambulatorio: 'aperto',
        dettaglioAmbulatorio: `fino alle ${fasciaAperta[1]}`,
      };
    }

    // Prossima apertura: oggi più tardi, oppure nei giorni successivi.
    const prossimaOggi = fasceOggi.find(([a]) => aMinuti(a) > minuti);
    if (prossimaOggi) {
      return {
        ...base,
        ambulatorio: 'chiuso',
        dettaglioAmbulatorio: `riapre oggi alle ${prossimaOggi[0]}`,
      };
    }
    const indiceOggi = NOMI_GIORNI.indexOf(giorno);
    for (let i = 1; i <= 7; i++) {
      const g = NOMI_GIORNI[(indiceOggi + i) % 7]!;
      const prima = input.settimana[g]?.[0];
      if (prima) {
        const quando = i === 1 ? 'domani' : ETICHETTE_GIORNI[g];
        return {
          ...base,
          ambulatorio: 'chiuso',
          dettaglioAmbulatorio: `riapre ${quando} alle ${prima[0]}`,
        };
      }
    }
    return { ...base, ambulatorio: 'chiuso' };
  } catch {
    return base;
  }
}

/** openingHoursSpecification per schema.org: h24 se non ci sono orari ambulatoriali confermati. */
export function openingHoursSpecification(input: OrariInput) {
  const giorniSchema: Record<keyof Settimana, string> = {
    lunedi: 'Monday',
    martedi: 'Tuesday',
    mercoledi: 'Wednesday',
    giovedi: 'Thursday',
    venerdi: 'Friday',
    sabato: 'Saturday',
    domenica: 'Sunday',
  };
  // Il pronto soccorso è sempre aperto: questa è la specifica dell'attività nel suo complesso.
  const h24 = {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: Object.values(giorniSchema),
    opens: '00:00',
    closes: '23:59',
  };
  if (!input.ambulatorioConfermato) return [h24];
  const ambulatorio = (Object.keys(giorniSchema) as Array<keyof Settimana>).flatMap((g) =>
    (input.settimana[g] ?? []).map(([opens, closes]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: giorniSchema[g],
      opens,
      closes,
    })),
  );
  return [h24, ...ambulatorio];
}

/** Riga leggibile per il footer: "Lun–Ven 09:00–13:00, 16:00–20:00". */
export function orariLeggibili(settimana: Settimana): Array<{ giorno: string; fasce: string }> {
  return (Object.keys(ETICHETTE_GIORNI) as Array<keyof Settimana>).map((g) => ({
    giorno: ETICHETTE_GIORNI[g],
    fasce: (settimana[g] ?? []).map(([a, c]) => `${a}–${c}`).join(', ') || 'solo pronto soccorso',
  }));
}
