import { clinica } from '@lib/clinica';

/** Titolo completo per il tag <title>: "Pagina | Clinica Veterinaria del Bosco". */
export function titoloCompleto(titolo: string, conBrand = true): string {
  if (!conBrand || titolo.includes(clinica.nome)) return titolo;
  return `${titolo} | ${clinica.nome}`;
}

/** Tronca una descrizione a ~155 caratteri senza spezzare le parole. */
export function descrizioneMeta(testo: string, max = 155): string {
  const pulito = testo.replace(/\s+/g, ' ').trim();
  if (pulito.length <= max) return pulito;
  const tagliato = pulito.slice(0, max);
  return `${tagliato.slice(0, tagliato.lastIndexOf(' '))}…`;
}

export interface Briciola {
  nome: string;
  href: string;
}
