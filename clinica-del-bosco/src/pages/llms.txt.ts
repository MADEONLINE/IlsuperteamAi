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
  const zone = (await getCollection('zone')).sort((a, b) => a.data.ordine - b.data.ordine);
  const righe = [
    `# ${clinica.nome}`,
    '',
    `> ${clinica.descrizioneBreve}`,
    '',
    `- Sede: ${indirizzoRiga}, Italia`,
    `- Telefono unico (urgenze e prenotazioni, 24 ore su 24): ${clinica.contatti.telefono.visualizzato} (${clinica.contatti.telefono.e164})`,
    `- Email: ${emailPrincipale}`,
    `- Pronto soccorso: ${clinica.orari.prontoSoccorso.etichetta}, con personale in struttura`,
    `- Visite programmate: su appuntamento (${urlAssoluto('/prenota')})`,
    `- Specie: cani, gatti, conigli, piccoli mammiferi, rettili, uccelli`,
    `- Area servita: ${clinica.areaServita.map((z) => z.nome).join(', ')}`,
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
    `- [Piani Salute (prevenzione programmata)](${urlAssoluto('/piani-salute')})`,
    `- [La struttura: attrezzature e dati anagrafici](${urlAssoluto('/la-struttura')})`,
    `- [Équipe medica](${urlAssoluto('/equipe')})`,
    `- [Area colleghi veterinari: TAC, endoscopia, chirurgia in service](${urlAssoluto('/per-i-colleghi')})`,
    `- [Contatti e come arrivare](${urlAssoluto('/contatti')})`,
    `- [Domande frequenti](${urlAssoluto('/domande-frequenti')})`,
    '',
    '## Servizi',
    ...servizi.map(
      (s) => `- [${s.data.titoloBreve}](${urlAssoluto(`/servizi/${s.id}`)}): ${s.data.sottotitolo}`,
    ),
    '',
    '## Guide del magazine',
    ...articoli.map(
      (a) => `- [${a.data.titolo}](${urlAssoluto(`/magazine/${a.id}`)}): ${a.data.descrizioneMeta}`,
    ),
    '',
    '## Zone servite',
    ...zone.map(
      (z) =>
        `- [Veterinario a ${z.data.nome}](${urlAssoluto(`/veterinario-a/${z.id}`)}): ${z.data.tempoAutoMinuti[0]}–${z.data.tempoAutoMinuti[1]} minuti in auto`,
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
