/**
 * Indirizzo pubblico di un servizio. Il pronto soccorso ha una sola pagina, /pronto-soccorso:
 * la scheda servizio "pronto-soccorso-h24" resta come contenuto (FAQ, tabella, fonti, turno di
 * notte) ma non genera una pagina propria, così le due pagine non si fanno concorrenza.
 */
export const SERVIZI_CON_PAGINA_DEDICATA: Record<string, string> = {
  'pronto-soccorso-h24': '/pronto-soccorso',
};

export function hrefServizio(id: string | undefined): string {
  if (!id) return '/servizi';
  return SERVIZI_CON_PAGINA_DEDICATA[id] ?? `/servizi/${id}`;
}
