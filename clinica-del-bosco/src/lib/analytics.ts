/**
 * Misurazione privacy-first. Plausible (senza cookie) è attivo di default;
 * GA4 viene caricato SOLO dopo consenso esplicito (vedi CookieBanner).
 *
 * Eventi standard del sito (vedi MISURAZIONE.md):
 *  click_chiama · click_indicazioni · form_step_1..4 · form_inviato
 *  assistente_aperto · assistente_domanda
 *  piano_salute_scelto · caso_collega_inviato · scroll_75
 */
export type EventoSito =
  | 'click_chiama'
  | 'click_indicazioni'
  | 'form_step_1'
  | 'form_step_2'
  | 'form_step_3'
  | 'form_step_4'
  | 'form_inviato'
  | 'piano_salute_scelto'
  | 'caso_collega_inviato'
  | 'scroll_75'
  | 'assistente_aperto'
  | 'assistente_domanda';

type Proprieta = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (evento: string, opzioni?: { props?: Proprieta }) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Invia un evento a Plausible (se caricato) e a GA4 (solo se consentito e caricato). */
export function traccia(evento: EventoSito, props: Proprieta = {}): void {
  try {
    window.plausible?.(evento, { props });
    window.gtag?.('event', evento, props);
  } catch {
    /* la misurazione non deve mai rompere la pagina */
  }
}

/**
 * Collega automaticamente gli elementi con data-evento="nome_evento".
 * Esempio: <a href="tel:..." data-evento="click_chiama" data-evento-posizione="hero">
 */
export function collegaEventiClick(radice: ParentNode = document): void {
  radice.querySelectorAll<HTMLElement>('[data-evento]').forEach((el) => {
    if (el.dataset['eventoCollegato']) return;
    el.dataset['eventoCollegato'] = '1';
    el.addEventListener('click', () => {
      const nome = el.dataset['evento'] as EventoSito | undefined;
      if (!nome) return;
      const posizione = el.dataset['eventoPosizione'];
      traccia(nome, posizione ? { posizione } : {});
    });
  });
}

/** Evento scroll_75: una sola volta per pagina. */
export function osservaScroll75(): void {
  let inviato = false;
  const controlla = () => {
    if (inviato) return;
    const h = document.documentElement;
    const progresso = (h.scrollTop + window.innerHeight) / h.scrollHeight;
    if (progresso >= 0.75) {
      inviato = true;
      traccia('scroll_75');
      window.removeEventListener('scroll', controlla);
    }
  };
  window.addEventListener('scroll', controlla, { passive: true });
}
