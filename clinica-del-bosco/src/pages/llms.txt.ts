import { hrefServizio } from '@lib/servizi';
/**
 * /llms.txt — sintesi in Markdown dell'identità della clinica per i sistemi AI
 * (specifica llmstxt.org). Generato a build time dai dati e dai contenuti reali.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { clinica, daConfermare, emailPrincipale, indirizzoRiga, urlAssoluto } from '@lib/clinica';

export const GET: APIRoute = async () => {
  const servizi = (await getCollection('servizi')).sort((a, b) => a.data.ordine - b.data.ordine);
  const articoli = await getCollection('articoli');
  const righe = [
    `# ${clinica.nome}`,
    '',
    `> ${clinica.descrizioneBreve}`,
    '',
    `- Sede: ${indirizzoRiga}, Italia`,
    `- Telefono unico (urgenze e prenotazioni): ${clinica.contatti.telefono.visualizzato} (${clinica.contatti.telefono.e164})`,
    `- Email: ${emailPrincipale}`,
    `- Pronto soccorso: ${clinica.orari.prontoSoccorso.etichetta}, con personale in struttura`,
    `- ${clinica.orari.ambulatorio.etichetta} (${urlAssoluto('/prenota')})`,
    `- Specie: cani, gatti, conigli, piccoli mammiferi, rettili, uccelli`,
    `- Ragione sociale: ${clinica.ragioneSociale}, P. IVA ${clinica.partitaIva}`,
    ...(daConfermare(clinica.direttoreSanitario.nome)
      ? []
      : [
          `- Direttore sanitario: ${clinica.direttoreSanitario.titolo} ${clinica.direttoreSanitario.nome}`,
        ]),
    '',
    '## Pagine chiave',
    `- [Pronto soccorso 24h: cosa fare mentre arrivi, segni di urgenza](${urlAssoluto('/pronto-soccorso')})`,
    `- [Prenota una visita](${urlAssoluto('/prenota')})`,
    `- [La struttura: attrezzature e dati anagrafici](${urlAssoluto('/la-struttura')})`,
    `- [I nostri medici](${urlAssoluto('/equipe')})`,
    `- [Area colleghi veterinari: TC, endoscopia, chirurgia in service](${urlAssoluto('/per-i-colleghi')})`,
    `- [Contatti e come arrivare](${urlAssoluto('/contatti')})`,
    `- [Domande frequenti](${urlAssoluto('/domande-frequenti')})`,
    '',
    '## Servizi',
    ...servizi.map(
      (s) => `- [${s.data.titoloBreve}](${urlAssoluto(hrefServizio(s.id))}): ${s.data.sottotitolo}`,
    ),
    '',
    '## Guide del magazine',
    ...articoli.map(
      (a) => `- [${a.data.titolo}](${urlAssoluto(`/magazine/${a.id}`)}): ${a.data.descrizioneMeta}`,
    ),
    '',
    '## Contenuto completo',
    `- [llms-full.txt](${urlAssoluto('/llms-full.txt')}): tutti i contenuti principali concatenati`,
    '',
    'Questi contenuti hanno finalità informative e non sostituiscono la visita veterinaria.',
  ];
  return new Response(righe.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
