/** /llms-full.txt — contenuti principali concatenati (Markdown grezzo dei file sorgente + FAQ). */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { clinica, indirizzoRiga, urlAssoluto } from '@lib/clinica';

export const GET: APIRoute = async () => {
  const servizi = (await getCollection('servizi')).sort((a, b) => a.data.ordine - b.data.ordine);
  const articoli = await getCollection('articoli');
  const faq = await getCollection('faq');
  const zone = (await getCollection('zone')).sort((a, b) => a.data.ordine - b.data.ordine);
  const blocco = (
    titolo: string,
    url: string,
    risposta: string,
    corpo: string | undefined,
    faqs: Array<{ domanda: string; risposta: string }> = [],
  ) =>
    [
      `\n\n---\n\n# ${titolo}`,
      `URL: ${url}`,
      '',
      risposta,
      '',
      (corpo ?? '').trim(),
      ...(faqs.length
        ? ['', '## Domande frequenti', ...faqs.flatMap((f) => [`### ${f.domanda}`, f.risposta, ''])]
        : []),
    ].join('\n');

  const testo = [
    `# ${clinica.nome} — contenuti completi`,
    `Sede: ${indirizzoRiga}. Telefono h24: ${clinica.contatti.telefono.visualizzato}. ${clinica.orari.prontoSoccorso.etichetta}.`,
    ...servizi.map((s) =>
      blocco(s.data.titolo, urlAssoluto(`/servizi/${s.id}`), s.data.risposta, s.body, s.data.faq),
    ),
    ...articoli.map((a) =>
      blocco(a.data.titolo, urlAssoluto(`/magazine/${a.id}`), a.data.riassunto, a.body, a.data.faq),
    ),
    ...zone.map((z) =>
      blocco(
        `Veterinario a ${z.data.nome}`,
        urlAssoluto(`/veterinario-a/${z.id}`),
        z.data.risposta,
        z.body,
        z.data.faq,
      ),
    ),
    '\n\n---\n\n# Domande frequenti generali',
    ...faq.map((f) => `\n### ${f.data.domanda}\n${(f.body ?? '').trim()}`),
    '\n\nQuesti contenuti hanno finalità informative e non sostituiscono la visita veterinaria.',
  ].join('\n');
  return new Response(testo, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
