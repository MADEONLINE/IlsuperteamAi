# Marchio e palette

Fonte unica: il **kit ufficiale di identità visiva** (Prosperity for VET, settembre 2026),
archiviato senza modifiche in [`docs/marchio-kit/`](marchio-kit/). Il `README.md` del kit
è il manuale d'uso: spazio di rispetto, dimensioni minime, usi vietati.

## Come è applicato al sito

| Cosa                  | Dove                                                                 |
| --------------------- | -------------------------------------------------------------------- |
| Tracciati del marchio | `src/lib/marchio.js` — unica fonte di verità, importata da tutto     |
| Sprite SVG            | `src/components/ui/Marchio.astro`, incluso una volta in `BaseLayout` |
| Logo                  | `src/components/ui/Logo.astro` (`<use>` sullo sprite)                |
| Colori                | `src/styles/global.css`, blocco `@theme`                             |
| Favicon e manifest    | `public/` — file presi dal kit, non rigenerati                       |
| Immagini social       | `src/pages/og/[...slug].png.ts` e `scripts/genera-og.mjs`            |

Il logo è **SVG inline**, non un `<img>`: nessuna richiesta di rete sul percorso critico,
e i colori seguono il tema. Costa circa 5 KB brotli per pagina.

## Colori

| Ruolo                             | Kit       | Token                    |
| --------------------------------- | --------- | ------------------------ |
| Primario (dominante)              | `#24603C` | `--color-bosco-600`      |
| Secondario                        | `#0C4E58` | `--color-petrolio-700`   |
| Fondi scuri                       | `#063C46` | `--color-petrolio-900`   |
| Accento (solo filetti e dettagli) | `#C9A87E` | `--color-oro-500`        |
| Testi                             | `#182F2A` | `--color-inchiostro-900` |
| Fondi chiari                      | `#F5F7F4` | `--color-crema-100`      |

Gli esadecimali del kit sono **ancoraggi esatti**; gli altri gradini delle rampe sono
interpolati in OKLCH. Ogni modifica va riverificata con `npm run check:contrasti`
(corpo del testo ≥ 7:1, elementi di interfaccia ≥ 4.5:1).

## Due scelte tecniche, e perché

**Il lettering del lockup è convertito in tracciati.** Nei file del kit
"CLINICA VETERINARIA" e "del Bosco" sono testo vero in Poppins 500 e Playfair Display 600.
Caricati come immagine, quei font non si applicano e il nome ripiega su Georgia/Arial:
il logo cambierebbe faccia. Vettorializzandolo il marchio resta fedele senza scaricare
due font in più — è la stessa ragione per cui il kit chiede di convertire i testi per la stampa.

**Sui fondi scuri si passa alla versione reverse**, monocromatica off-white, come prescrive
il kit. Succede da solo: tema scuro (preferenza di sistema o selettore) e classe
`.marchio--inverso` ribaltano le variabili `--marchio-*`.

## Cosa non è stato toccato

`docs/marchio-kit/logo/foglia-cane.svg` e `foglia-gatto.svg` non sono marchi: il kit li
destina alle sezioni e ai materiali dei Piani Salute. Non sono stati inseriti nelle pagine
per non alterare i layout: restano disponibili quando si vorrà usarli.

## Tipografia

Il kit indica **Playfair Display** (titoli) e **Poppins** (testo). Il sito usa oggi
**Fraunces** e **Inter**, self-hosted e ridotti ai soli pesi usati (2 file, ~55 KB in tutto).
Il lockup conserva comunque i font del marchio perché è vettorializzato. Allineare anche i
testi di pagina al kit è una scelta aperta: va decisa con la clinica, perché cambia l'aspetto
di tutte le pagine e il peso dei font.

---

## Assistente del sito

`src/components/sezioni/Assistente.astro` + `src/pages/assistente.json.ts`.

Accompagna il visitatore tra le aree del sito e risponde pescando **solo** dai
contenuti già pubblicati (24 domande frequenti, 19 servizi, 12 pagine
principali), indicizzati a build time in `/assistente.json` e scaricati alla
prima apertura: le pagine non ne pagano il peso.

Due limiti sono voluti e non vanno rimossi senza parlarne con la clinica:

- **Non è un modello linguistico.** Non chiama servizi esterni — la CSP del sito
  non lo consentirebbe — e quindi non può inventare una risposta. Su un sito
  sanitario è una garanzia, non una rinuncia.
- **Non fa triage e non dà consigli clinici.** Se la domanda contiene parole che
  fanno pensare a una situazione urgente non valuta la gravità: mette in cima il
  numero e invita a parlare con un medico. Il numero delle urgenze è sempre
  visibile nel pannello, con il richiamo a usarlo solo per le vere emergenze.

Senza JavaScript il pulsante resta un link alle domande frequenti.
