import { clinica } from '@lib/clinica';

/** Forma breve del nome usata in coda al title (il nome completo resta in testo, footer e dati strutturati). */
const BRAND_TITLE = 'Clinica del Bosco';
const MAX_TITLE = 60;

/**
 * Titolo per il tag <title>, entro 60 caratteri quando possibile:
 * "Pagina | Clinica del Bosco"; se è troppo lungo usa la parte prima dei due punti,
 * e se serve toglie il nome della clinica.
 */
export function titoloCompleto(titolo: string, conBrand = true): string {
  const t = titolo.replace(/\s+/g, ' ').trim();
  if (!conBrand || t.includes(clinica.nome) || t.includes(BRAND_TITLE)) return t;
  const conCoda = (x: string) => `${x} | ${BRAND_TITLE}`;
  if (conCoda(t).length <= MAX_TITLE) return conCoda(t);
  const breve = t.includes(':') ? t.slice(0, t.indexOf(':')).trim() : t;
  if (conCoda(breve).length <= MAX_TITLE) return conCoda(breve);
  return breve;
}

/**
 * Riduce una descrizione a 160 caratteri al massimo (lo stesso limite dello schema dei contenuti) senza lasciarla a metà:
 * tiene le frasi intere che stanno nel limite; solo se nessuna frase ci sta, taglia a fine parola.
 */
export function descrizioneMeta(testo: string, max = 160): string {
  const pulito = testo.replace(/\s+/g, ' ').trim();
  if (pulito.length <= max) return pulito;
  const frasi = pulito.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [];
  let out = '';
  for (const f of frasi) {
    if ((out + f).trim().length > max) break;
    out += f;
  }
  if (out.trim().length >= 70) return out.trim();
  const tagliato = pulito.slice(0, max - 1);
  return `${tagliato.slice(0, tagliato.lastIndexOf(' ')).replace(/[,;:]$/, '')}…`;
}

export interface Briciola {
  nome: string;
  href: string;
}
