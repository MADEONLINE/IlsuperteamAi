# Clinica Veterinaria del Bosco — sito web

Sito della **Clinica Veterinaria del Bosco** (Portici, NA): pronto soccorso 24/7, TAC, chirurgia,
laboratorio interno, Piani Salute, area colleghi. Costruito con Astro e Tailwind CSS, output
statico, pronto per Netlify o Vercel.

> Questo README è scritto anche per chi non è sviluppatore. La parte "Come si aggiorna il sito"
> spiega le operazioni quotidiane; la parte "Per gli sviluppatori" spiega le scelte tecniche.

---

## Stato del progetto

| Fase | Contenuto                                                                                      | Stato         |
| ---- | ---------------------------------------------------------------------------------------------- | ------------- |
| 1    | Fondamenta: scaffold, design token, layout, header/footer, dati clinica, componenti UI, deploy | ✅ completata |
| 2    | Pagine critiche: `/pronto-soccorso`, home completa, form di prenotazione                       | ⏳            |
| 3    | Servizi ed équipe (content collections)                                                        | ⏳            |
| 4    | Conversione: Piani Salute, area colleghi, campagne                                             | ⏳            |
| 5    | Contenuti e SEO locale: magazine, articoli, pagine per zona                                    | ⏳            |
| 6    | SEO tecnica + GEO: JSON-LD completo, sitemap, llms.txt, IndexNow                               | ⏳            |
| 7    | Rifinitura: accessibilità, Lighthouse CI, Playwright, documentazione                           | ⏳            |

**Prima del go-live** vanno raccolti i dati elencati in [`TODO-DATI.md`](./TODO-DATI.md): alcuni
sono obblighi di legge (direttore sanitario, autorizzazione sanitaria) e **bloccano il deploy di
produzione** finché mancano. I contenuti clinici sono completi ma vanno riletti dai medici che li
firmano (vedi `TODO-DATI.md`, sezione "Contenuti da validare").

Anteprima: sull'account Netlify della clinica/agenzia esiste già il progetto
`anteprima-clinica-del-bosco` (vuoto): per pubblicarlo basta collegarlo a questo repository dal
pannello Netlify (Import from Git → ramo `claude/quirky-heisenberg-vvr43p` o `main`, Base
directory `clinica-del-bosco`). Da quel momento ogni push aggiorna
<https://anteprima-clinica-del-bosco.netlify.app>.

---

## Come si aggiorna il sito (per la clinica)

Tutto si fa modificando file di testo. Non serve toccare il codice.

### Cambiare telefono, indirizzo, orari, email, social

Apri `src/data/clinica.json`. È l'**unico** posto in cui questi dati esistono: header, footer,
pagine, dati strutturati per Google e sitemap si aggiornano da soli.

- **Orari dell'ambulatorio**: sezione `orari.ambulatorio.settimana`. Per ogni giorno scrivi le
  fasce, ad esempio `"lunedi": [["09:00", "13:00"], ["16:00", "20:00"]]`. Giorno chiuso: `[]`.
  Quando gli orari sono giusti imposta `"confermato": true`: da quel momento il sito mostra la
  tabella nel footer e il badge "Aperto ora" dice anche se l'ambulatorio è aperto.
- **Numero WhatsApp**: `contatti.whatsapp.e164` nel formato `+39...` senza spazi.
- **Email sul dominio**: quando `info@clinicaveterinariadelbosco.it` esiste, imposta
  `contatti.email.proposta.attiva` a `true`.
- **Direttore sanitario e autorizzazione**: sezioni `direttoreSanitario` e
  `autorizzazioneSanitaria`.

Dopo ogni modifica: salva, poi pubblica (vedi sotto). Se hai scritto qualcosa in un formato
sbagliato (es. una P. IVA con 10 cifre), il build si ferma con un messaggio che indica il campo.

### Aggiungere un articolo al magazine

1. Copia un articolo esistente da `src/content/articoli/` (per esempio
   `colpo-di-calore-nel-cane-e-nel-gatto.md`) e rinominalo come vuoi che sia l'indirizzo:
   `nome-articolo.md` diventa `/magazine/nome-articolo`. Solo minuscole e trattini, niente date.
2. In cima al file compila i campi tra le righe `---`: titolo, `descrizioneMeta` (max 160
   caratteri), `riassunto` (40–60 parole che rispondono da sole alla domanda), `autore` e
   `revisore` (nome file di un medico in `src/content/equipe/`), date, `servizioCorrelato`,
   almeno 3 domande/risposte in `faq`, almeno 2 `fonti` con link.
3. Scrivi il testo sotto, in Markdown, con titoli `##` in forma di domanda. La frase "Questa
   pagina ha finalità informative…" la aggiunge il sito da solo.
4. Pubblica. Se manca un campo obbligatorio il build si ferma indicando il file e il campo.

Le regole di scrittura (cosa si può dire, cosa è vietato dalla deontologia) sono in
`docs/LINEE-GUIDA-CONTENUTI.md`.

### Aggiungere un medico all'équipe

Crea `src/content/equipe/nome-cognome.md` copiando una scheda esistente: nome, titolo, ruolo,
numero di iscrizione all'Ordine e provincia, specializzazioni, aree (nomi file dei servizi
seguiti), biografia sotto. Imposta `daValidare: false` quando il medico ha approvato la scheda.

### Cambiare i prezzi dei Piani Salute e le tariffe

Apri `src/data/piani-salute.json` e cambia i numeri (`prezzoAnnuo`, `valoreIndicativo` delle
prestazioni). Tabella, calcolatore, home e dati strutturati si aggiornano da soli. Quando i
prezzi sono definitivi imposta `prezziConfermati: true`. Stesso principio per
`src/data/tariffe.json` (`confermato: true` rende la pagina indicizzabile).

### Aggiungere una campagna stagionale o una recensione

- Campagne: `src/content/campagne/`, un file per campagna con periodo (`meseInizio`,
  `meseFine`): la home mostra da sola quella in corso.
- Recensioni Google reali: `src/data/recensioni.json` (autore, testo, stelle, data). Mai
  testimonianze inventate.

### Cambiare gli orari

Vedi sopra, sezione "orari dell'ambulatorio" in `src/data/clinica.json`. Il pronto soccorso è
sempre indicato h24: non c'è nulla da cambiare per le urgenze.

### Pubblicare

Il sito è collegato a un servizio di hosting (Netlify o Vercel). Ogni volta che le modifiche
vengono salvate sul ramo principale del repository GitHub, il sito si ricostruisce e va online in
2–3 minuti. Se il build fallisce, il pannello di hosting mostra il motivo: quasi sempre è un dato
mancante (`{{DA_CONFERMARE}}`) o un errore di formato in `clinica.json`.

---

## Per gli sviluppatori

### Requisiti

Node.js ≥ 22.12. Il progetto vive nella cartella `clinica-del-bosco/` di questo repository (la
radice ospita un'altra landing page): su Netlify impostare **Base directory =
`clinica-del-bosco`**; `netlify.toml` lo dichiara già.

### Comandi

```bash
npm install            # dipendenze
npm run dev            # sviluppo locale
npm run build          # build statico in dist/ + controllo dati (check:data)
npm run preview        # anteprima del build
npm run check          # astro check (TypeScript strict)
npm run lint           # ESLint (regole Astro + a11y)
npm run format         # Prettier
npm run check:data     # elenca i segnaposto {{DA_CONFERMARE}}; blocca in produzione
npm run check:contrasti# verifica i rapporti di contrasto dei token (light e dark)
npm run check:budget   # budget JS per pagina (dopo il build)
npm run test:e2e       # Playwright: percorsi critici + axe (mobile e desktop, dopo il build)
npm run lighthouse     # Lighthouse CI mobile con budget fallimentare (dopo il build)
npm run indexnow       # notifica IndexNow delle URL della sitemap (serve la chiave)
npm run pdf:convenzione# rigenera il PDF del modulo convenzione dai dati della clinica
node scripts/genera-icone.mjs   # rigenera favicon e immagine OG da public/favicon.svg
node scripts/anteprima-artifact.mjs dist/index.html out.html  # pagina autonoma per anteprime
```

### Form: cosa collegare

I form (`prenotazione` e `caso-collega`) usano **Netlify Forms**: il markup ha `data-netlify`,
honeypot e, per i colleghi, upload multipart (max 8 MB per file). Al primo deploy su Netlify:

1. Netlify → Site → **Forms**: verificare che i due form siano rilevati.
2. Forms → **Notifications** → aggiungere l'email della reception (e una seconda per i casi
   dei colleghi). Da quel momento ogni invio arriva per email e resta nel pannello.
3. Il filtro spam Akismet è attivo di default; l'honeypot è già nel markup.

Su Vercel (alternativa): i form vanno collegati a una funzione (`/api/prenotazione`) che inoltra
via email, oppure a un servizio esterno; il markup non cambia (`action` e `method` restano).

### Deploy

- **Netlify** (consigliato): collegare il repository, Base directory `clinica-del-bosco`, build
  `npm run build`, publish `dist`. `netlify.toml` porta header, cache e redirect 301. In
  produzione `CHECK_DATA_STRICT=1` blocca il deploy finché restano segnaposto.
- **Vercel**: Root directory `clinica-del-bosco`; `vercel.json` porta header e redirect.
- Anteprima manuale senza collegamento git: dalla cartella del progetto,
  `npx netlify-cli deploy --dir=dist --prod --site=<id>` dopo `npm run build`.

### Decisioni tecniche

1. **Astro 7.3 invece di Astro 5.** Il brief chiedeva "Astro 5 (ultima stabile)". Al momento
   dello scaffold (settembre 2026) `npm audit` segnala su tutta la linea 5.x e 6.x advisory
   **critiche** (XSS, RCE nell'ottimizzazione AVIF) corrette solo da Astro ≥ 7.2.8. Si è scelta
   quindi l'ultima stabile, 7.3.2, con zero vulnerabilità. Tutte le API usate (content layer,
   `astro:assets`, `ClientRouter`, CSP nativa) sono stabili in 7.x.
2. **Dominio canonico `clinicaveterinariadelbosco.it`, senza www.** È il nome esatto della
   clinica; il dominio storico contiene un superlativo ("miglior") non ammesso dalla deontologia.
   Tutti gli altri domini e le vecchie URL vanno in 301 (`redirects.map` → `netlify.toml`,
   `vercel.json`).
3. **Un solo file dati** (`src/data/clinica.json`) validato con Zod a build time
   (`src/lib/clinica.ts`). Un valore in formato errato ferma il build con un messaggio chiaro.
4. **Segnaposto `{{DA_CONFERMARE}}` + `check:data`.** In sviluppo avvisa, in produzione
   (`CONTEXT=production` su Netlify, `VERCEL_ENV=production` su Vercel, o `CHECK_DATA_STRICT=1`)
   blocca il build. Così nessun dato inventato o mancante può finire online.
5. **Tailwind CSS 4 con token semantici** (`bg-sfondo`, `text-testo`, `bg-urgenza`…): i colori
   grezzi (`bosco-*`, `crema-*`, `urgenza-*`) non si usano mai nei componenti. Il tema scuro
   ridefinisce solo i token semantici. Il corallo `urgenza` è riservato alle azioni di emergenza.
6. **Font self-hosted variabili** (Fraunces + Inter, subset latin, 2 file, ~85 KB totali,
   `font-display: swap`, preload). Nessuna richiesta a Google Fonts.
7. **Zero framework client.** Le interazioni (menu, badge orari, tema, cookie) sono script
   vanilla TypeScript di pochi byte. JS totale della home: ~7 KB brotli (budget: 90 KB).
8. **CSS critico inline** (`inlineStylesheets: 'always'`): il CSS di ogni pagina è piccolo e
   inline evita una richiesta sul percorso LCP.
9. **CSP nativa di Astro** (`security.csp`): a ogni build vengono calcolati gli hash SHA-256
   degli script e degli stili inline e inseriti in un `<meta http-equiv>`. Gli header HTTP
   aggiungono `frame-ancestors`, HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
   `Permissions-Policy`. Conseguenza: **niente attributi `style=""` inline nel markup**.
10. **Badge "Aperto ora"**: la logica (`src/lib/orari.ts`) è pura e condivisa tra build e
    browser; il testo statico è sempre vero (PS h24); il pronto soccorso non può mai risultare
    "chiuso".
11. **Analytics privacy-first**: Plausible senza cookie di default; GA4 solo dopo consenso e
    solo se configurato. Se GA4 non è configurato il cookie banner non esiste.
12. **Layout della cartella**: il progetto sta in `clinica-del-bosco/` per non interferire con la
    landing già pubblicata dalla radice del repository.
13. **Contenuti come dati** (content collections con schema Zod): una sola `ServizioLayout`
    per 19 servizi, FAQ e tabelle nel frontmatter così da generare insieme HTML visibile e
    JSON-LD (`FAQPage`, `MedicalWebPage`, `Article`, `Physician`, `Service`+`Offer`), sempre
    dagli stessi dati: mai disallineati.
14. **Niente accordion chiusi**: le FAQ sono `<details open>`; il testo è nell'HTML per Google e
    per i sistemi AI. `llms.txt` e `llms-full.txt` sono endpoint generati dal contenuto reale.
15. **Immagini Open Graph generate al build** (`/og/<pagina>.png`, sharp + SVG): nessun servizio
    esterno, titolo reale della pagina.
16. **Form senza JavaScript**: un unico `<form>` HTML che Netlify Forms riceve comunque; JS aggiunge
    passi, validazione, bozza in `sessionStorage`, deviazione urgenza e WhatsApp precompilato.
17. **PDF della convenzione** generato da HTML con Chromium (`scripts/genera-pdf-convenzione.mjs`)
    dai dati di `clinica.json`: nessun dato duplicato a mano.

### Dipendenze e motivazione

| Pacchetto                                                                      | Perché                                                                                        |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `astro`                                                                        | Framework statico, zero JS di default, content collections, immagini.                         |
| `@astrojs/sitemap`                                                             | Genera `sitemap-index.xml` con priorità per le pagine critiche.                               |
| `tailwindcss` + `@tailwindcss/vite`                                            | Utility CSS con token semantici in `@theme`.                                                  |
| `sharp`                                                                        | Ottimizzazione immagini (AVIF/WebP) e generazione favicon/OG.                                 |
| `zod`                                                                          | Validazione dello schema dei dati della clinica e delle collection (già dipendenza di Astro). |
| `@astrojs/check`, `typescript`                                                 | `astro check` in modalità strictest.                                                          |
| `@fontsource-variable/fraunces`, `@fontsource-variable/inter`                  | Solo per copiare i file woff2 in `public/fonts` (non usati a runtime).                        |
| `eslint`, `eslint-plugin-astro`, `eslint-plugin-jsx-a11y`, `typescript-eslint` | Lint con regole di accessibilità sui template.                                                |
| `prettier`, `prettier-plugin-astro`                                            | Formattazione.                                                                                |

### Struttura

```
clinica-del-bosco/
  src/
    components/  ui/ (Bottone, Icona, Sezione, Badge, Briciole, Foto, Dato, Logo, Rassicurazioni)
                 sezioni/ (Header, Footer, BarraSticky, CookieBanner, BadgeApertoOra)
                 form/ (Fase 2)   seo/ (Seo, JsonLd)
    layouts/     BaseLayout (head, header, footer, sticky, JSON-LD) · PaginaLayout
    pages/       index · pronto-soccorso · prenota(+grazie) · piani-salute · per-i-colleghi(+grazie)
                 servizi/ · equipe/ · magazine/ · campagne/ · veterinario-a/ · domande-frequenti
                 contatti · la-struttura · tariffe · privacy-policy · cookie-policy · note-legali
                 accessibilita · llms.txt · llms-full.txt · og/[...].png · 404
    content/     servizi/ (19) · equipe/ (4) · articoli/ (6) · campagne/ (4) · faq/ (24) · zone/ (8) · casi/ (3)
    content.config.ts  schemi Zod delle collection
    data/        clinica.json · piani-salute.json · tariffe.json · recensioni.json
    lib/         clinica.ts · orari.ts · schema.ts · seo.ts · analytics.ts
    styles/      global.css (token, base, componenti, prosa)
  public/        fonts/ · og/ · documenti/ (PDF convenzione) · favicon · robots.txt · site.webmanifest
  scripts/       check-data · check-contrasti · check-budget · genera-icone · genera-pdf-convenzione · indexnow · anteprima-artifact
  tests/         percorsi-critici.spec.ts (Playwright + axe) · playwright.config.ts · lighthouserc.cjs
  docs/          LINEE-GUIDA-CONTENUTI.md · BENCHMARK-SITI.md (benchmark dei migliori siti del settore)
  netlify.toml · vercel.json · redirects.map
  README.md · TODO-DATI.md · NOTE-COMPLIANCE.md · NOTE-GEO.md · BRIEF-FOTO.md · MISURAZIONE.md
```

### Convenzioni

- Componenti in italiano, piccoli, con props documentate nel commento di testa.
- Nessun dato di contatto nei componenti: si importa da `@lib/clinica`.
- Nessun `style=""` inline (CSP con hash). Nessuna classe di colore grezzo nei componenti.
- Ogni pagina passa `titolo`, `descrizione` e `percorso` scritti a mano al layout.
- Eventi di misurazione: attributo `data-evento="click_chiama"` (+ `data-evento-posizione`).
