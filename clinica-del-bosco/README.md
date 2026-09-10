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
produzione** finché mancano.

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

### Aggiungere un articolo al magazine (da Fase 5)

1. Crea un file in `src/content/articoli/` chiamato come vuoi che sia l'indirizzo, ad esempio
   `colpo-di-calore-nel-cane.md` → `/magazine/colpo-di-calore-nel-cane`.
2. In cima al file compila i campi (titolo, descrizione, autore, data, servizio collegato).
3. Scrivi il testo sotto, in Markdown. Chiudi con la frase informativa obbligatoria.
4. Pubblica.

### Cambiare i prezzi dei Piani Salute (da Fase 4)

Apri `src/data/piani-salute.json` e cambia i numeri. Tabella, calcolatore e dati strutturati si
aggiornano da soli.

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
node scripts/check-budget.mjs   # budget JS per pagina (dopo il build)
node scripts/genera-icone.mjs   # rigenera favicon e immagine OG da public/favicon.svg
```

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
    pages/       index · 404 (le altre nelle fasi successive)
    content/     servizi/ equipe/ articoli/ campagne/ faq/ zone/ casi/ (Fase 3+)
    data/        clinica.json (+ piani-salute.json, tariffe.json in Fase 4)
    lib/         clinica.ts · orari.ts · schema.ts · seo.ts · analytics.ts
    styles/      global.css (token, base, componenti)
  public/        fonts/ · og/ · favicon · robots.txt · site.webmanifest (llms.txt in Fase 6)
  scripts/       check-data · check-contrasti · check-budget · genera-icone
  netlify.toml · vercel.json · redirects.map
  README.md · TODO-DATI.md · NOTE-COMPLIANCE.md (NOTE-GEO, BRIEF-FOTO, MISURAZIONE in Fase 7)
```

### Convenzioni

- Componenti in italiano, piccoli, con props documentate nel commento di testa.
- Nessun dato di contatto nei componenti: si importa da `@lib/clinica`.
- Nessun `style=""` inline (CSP con hash). Nessuna classe di colore grezzo nei componenti.
- Ogni pagina passa `titolo`, `descrizione` e `percorso` scritti a mano al layout.
- Eventi di misurazione: attributo `data-evento="click_chiama"` (+ `data-evento-posizione`).
