#!/usr/bin/env node
/**
 * Genera public/documenti/richiesta-convenzione-clinica-del-bosco.pdf dal template HTML,
 * con i dati di src/data/clinica.json (nessun dato hard-coded). Usa il Chromium di Playwright.
 * Uso: node scripts/genera-pdf-convenzione.mjs
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const clinica = JSON.parse(
  readFileSync(new URL('../src/data/clinica.json', import.meta.url), 'utf8'),
);
const out = new URL('../public/documenti/', import.meta.url);
mkdirSync(out, { recursive: true });
const indirizzo = `${clinica.indirizzo.via} ${clinica.indirizzo.civico}, ${clinica.indirizzo.cap} ${clinica.indirizzo.comune} (${clinica.indirizzo.provincia})`;
const email = clinica.contatti.email.proposta.attiva
  ? clinica.contatti.email.proposta.info
  : clinica.contatti.email.principale;
const campo = (etichetta, larghezza = '100%') =>
  `<div class="campo" style="width:${larghezza}"><span>${etichetta}</span><div class="riga"></div></div>`;

const html = `<!doctype html><html lang="it"><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 18mm 16mm; }
  body { font: 11pt/1.45 Helvetica, Arial, sans-serif; color: #131d17; }
  h1 { font: 700 20pt/1.2 Georgia, serif; color: #1e5f41; margin: 0 0 2mm; }
  h2 { font: 700 12pt/1.2 Helvetica, Arial, sans-serif; margin: 7mm 0 2mm; color: #1e5f41; border-bottom: 1px solid #bfe0cc; padding-bottom: 1mm; }
  .testa { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1e5f41; padding-bottom: 4mm; margin-bottom: 5mm; }
  .testa small { color: #46564d; }
  .campi { display: flex; flex-wrap: wrap; gap: 3mm 4mm; }
  .campo { display: flex; flex-direction: column; }
  .campo span { font-size: 8.5pt; color: #46564d; }
  .riga { border-bottom: 1px solid #66776d; height: 7mm; }
  .box { border: 1px solid #66776d; height: 24mm; margin-top: 2mm; }
  ul { margin: 1mm 0; padding-left: 5mm; }
  li { margin-bottom: 1mm; }
  .check { display: inline-block; width: 4mm; height: 4mm; border: 1px solid #131d17; vertical-align: middle; margin-right: 2mm; }
  .firma { display: flex; gap: 10mm; margin-top: 8mm; }
  .firma div { flex: 1; border-top: 1px solid #131d17; padding-top: 1mm; font-size: 9pt; color: #46564d; }
  .nota { font-size: 8.5pt; color: #46564d; margin-top: 6mm; }
</style></head><body>
<div class="testa">
  <div><h1>${clinica.nome}</h1><small>${clinica.ragioneSociale} · P. IVA ${clinica.partitaIva}<br>${indirizzo}<br>Tel. ${clinica.contatti.telefono.visualizzato} (h24) · ${email} · ${clinica.dominio.canonico.replace('https://', '')}</small></div>
  <div style="text-align:right"><strong>Richiesta di convenzione</strong><br><small>Service diagnostico, chirurgico e di degenza<br>per medici veterinari</small></div>
</div>

<h2>1. Struttura richiedente</h2>
<div class="campi">${campo('Denominazione ambulatorio / clinica', '62%')}${campo('Partita IVA', '34%')}${campo('Indirizzo', '62%')}${campo('Comune e CAP', '34%')}${campo('Medico veterinario referente', '48%')}${campo('N. iscrizione Ordine e provincia', '48%')}${campo('Telefono diretto', '30%')}${campo('Email per referti', '34%')}${campo('PEC', '32%')}</div>

<h2>2. Prestazioni di interesse</h2>
<div><span class="check"></span>TAC &nbsp; <span class="check"></span>Endoscopia &nbsp; <span class="check"></span>Chirurgia in service &nbsp; <span class="check"></span>Degenza / terapia intensiva &nbsp; <span class="check"></span>Ecocardiografia &nbsp; <span class="check"></span>Consulenze specialistiche</div>
<div class="campi" style="margin-top:3mm">${campo('Volume indicativo di casi al mese', '48%')}${campo('Software gestionale / PACS in uso', '48%')}</div>

<h2>3. Impegni della ${clinica.nome}</h2>
<ul>
  <li>Il paziente torna sempre al medico inviante: nessuna prestazione non richiesta viene proposta al proprietario senza accordo con il collega.</li>
  <li>Referto scritto entro 24–48 ore lavorative dall'esame; anticipazione verbale al termine; immagini DICOM condivise.</li>
  <li>Medico referente raggiungibile direttamente; aggiornamento giornaliero per i pazienti in degenza.</li>
  <li>Preventivo scritto al proprietario prima della prestazione; condizioni economiche riservate ai colleghi convenzionati comunicate in allegato.</li>
  <li>Trattamento dei dati del paziente e del proprietario limitato all'erogazione della prestazione e alla refertazione (GDPR).</li>
</ul>

<h2>4. Impegni della struttura richiedente</h2>
<ul>
  <li>Invio del quesito clinico con anamnesi, terapie in corso ed esami disponibili tramite il modulo online o via email.</li>
  <li>Informazione del proprietario sulla trasmissione dei dati e sulle modalità della prestazione.</li>
  <li>Preparazione del paziente secondo i protocolli concordati (digiuno, sospensioni farmacologiche).</li>
</ul>

<h2>5. Note</h2>
<div class="box"></div>

<div class="firma"><div>Luogo e data</div><div>Timbro e firma della struttura richiedente</div><div>Per ${clinica.nome}</div></div>
<p class="nota">Modulo da restituire compilato a ${email} oppure di persona in clinica. La convenzione si perfeziona con la controfirma della ${clinica.nome} e l'invio delle condizioni riservate. Versione del ${new Date().toLocaleDateString('it-IT')}.</p>
</body></html>`;

const tmp = new URL('../.astro/convenzione.html', import.meta.url);
mkdirSync(new URL('../.astro/', import.meta.url), { recursive: true });
writeFileSync(tmp, html);

// Chromium di Playwright (installazione globale dell'ambiente o locale del progetto)
const require = createRequire(import.meta.url);
const radiceGlobale = execSync('npm root -g').toString().trim();
let chromium;
try {
  ({ chromium } = require(`${radiceGlobale}/playwright`));
} catch {
  ({ chromium } = require('playwright'));
}
const browser = await chromium.launch(
  process.env['PLAYWRIGHT_CHROMIUM'] ? { executablePath: process.env['PLAYWRIGHT_CHROMIUM'] } : {},
);
const pagina = await browser.newPage();
await pagina.goto(`file://${tmp.pathname}`);
await pagina.pdf({
  path: new URL('richiesta-convenzione-clinica-del-bosco.pdf', out).pathname,
  format: 'A4',
  printBackground: true,
});
// Scheda invio caso (per email): stessa impaginazione, campi clinici
const scheda = html
  .replace(
    /<strong>Richiesta di convenzione<\/strong><br><small>[\s\S]*?<\/small>/,
    `<strong>Scheda invio caso</strong><br><small>Da inviare a ${email}<br>con referti allegati o link al PACS</small>`,
  )
  .replace(
    /<h2>1\. Struttura richiedente<\/h2>[\s\S]*?<h2>5\. Note<\/h2>/,
    `
<h2>1. Medico inviante</h2>
<div class="campi">${campo('Medico veterinario', '48%')}${campo('Struttura', '48%')}${campo('Telefono diretto', '30%')}${campo('Email per il referto', '34%')}${campo('Data invio', '32%')}</div>
<h2>2. Paziente</h2>
<div class="campi">${campo('Nome', '30%')}${campo('Specie e razza', '34%')}${campo('Età · sesso · peso', '32%')}${campo('Proprietario (nome e telefono)', '62%')}${campo('Microchip', '34%')}</div>
<h2>3. Prestazione richiesta</h2>
<div><span class="check"></span>TAC &nbsp; <span class="check"></span>Endoscopia &nbsp; <span class="check"></span>Chirurgia &nbsp; <span class="check"></span>Degenza / terapia intensiva &nbsp; <span class="check"></span>Ecocardiografia &nbsp; <span class="check"></span>Consulenza</div>
<div class="campi" style="margin-top:3mm">${campo('Urgenza: programmabile (7 gg) · prioritaria (48 h) · urgente (oggi: chiamare)', '100%')}</div>
<h2>4. Quesito clinico e anamnesi essenziale</h2>
<div class="box" style="height:40mm"></div>
<h2>5. Terapie in corso, esami già eseguiti, allergie</h2>
<div class="box" style="height:24mm"></div>
<h2>6. Note</h2>`,
  )
  .replace(
    /<div class="firma">[\s\S]*?<\/div>\s*<p class="nota">[\s\S]*?<\/p>/,
    `<div class="firma"><div>Firma del medico inviante</div><div>Per ${clinica.nome}: presa in carico (data, referente)</div></div>
<p class="nota">Il proprietario è stato informato della trasmissione dei dati per l'erogazione della prestazione. Il paziente torna al medico inviante con referto scritto entro 24–48 ore lavorative. Urgenze: ${clinica.contatti.telefono.visualizzato} (chiedere del medico di turno).</p>`,
  );
const tmp2 = new URL('../.astro/scheda-invio-caso.html', import.meta.url);
writeFileSync(tmp2, scheda);
const pagina2 = await browser.newPage();
await pagina2.goto(`file://${tmp2.pathname}`);
await pagina2.pdf({
  path: new URL('scheda-invio-caso-clinica-del-bosco.pdf', out).pathname,
  format: 'A4',
  printBackground: true,
});
await browser.close();
console.log('PDF generati in public/documenti/: richiesta-convenzione e scheda-invio-caso');
