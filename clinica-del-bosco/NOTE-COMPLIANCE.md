# NOTE-COMPLIANCE — conformità normativa del sito

Questo documento registra le scelte fatte per rispettare il Codice deontologico FNOVI, la normativa
sulla pubblicità sanitaria, il GDPR e i requisiti di accessibilità. Viene aggiornato a ogni fase.

## 1. Comunicazione sanitaria (FNOVI / pubblicità sanitaria)

**Principio applicato:** ogni testo deve essere veritiero, verificabile, non suggestivo e non comparativo.

| Tema                                                          | Scelta                                                                                                                                                                                                                                   | Dove                                    |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Superlativi e claim comparativi                               | **Vietati.** Nessun "i migliori", "n.1", "unica clinica". Il dominio storico `migliorveterinarionapoli.it` contiene un superlativo: per questo (oltre che per il brand) **non** è stato scelto come canonico e viene solo reindirizzato. | Tutto il sito, `redirects.map`          |
| Promesse di risultato                                         | Vietate. Si descrivono servizi, attrezzature e procedure, mai esiti garantiti.                                                                                                                                                           | Tutti i contenuti clinici               |
| Prova sociale numerica (clienti, animali seguiti, accessi PS) | Mostrata **solo** se `numeri.confermato = true` in `clinica.json`. Formulazione neutra ("oltre 4.000 famiglie ci hanno affidato…"), mai comparativa.                                                                                     | `src/data/clinica.json`                 |
| Recensioni                                                    | Solo recensioni Google reali importate staticamente (Fase 5). Nessuna testimonianza inventata. `AggregateRating` solo se basato su recensioni reali verificabili.                                                                        | Fase 5–6                                |
| "Aperto ora"                                                  | Il badge afferma solo ciò che è vero: pronto soccorso h24 con personale in struttura (dato confermato). Lo stato dell'ambulatorio compare solo con orari confermati.                                                                     | `BadgeApertoOra.astro`                  |
| Tariffe                                                       | Se pubblicate, presentate come "onorari indicativi", mai come offerta o sconto (Fase 4). Piani Salute descritti come prevenzione programmata, non come promozione.                                                                       | `/tariffe`, `/piani-salute`             |
| Colore "urgenza"                                              | Riservato alle sole azioni di emergenza: non è un artificio di persuasione ma un codice funzionale coerente.                                                                                                                             | `global.css` (token `--urgenza`)        |
| Disclaimer clinico                                            | Ogni contenuto clinico chiude con "Questa pagina ha finalità informative e non sostituisce la visita veterinaria." Presente anche nel footer di ogni pagina.                                                                             | `Footer.astro`, layout servizi/articoli |

## 2. Obblighi informativi della struttura

| Obbligo                                                                | Stato                                                                                              | Note                                                                            |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Direttore sanitario (nome, cognome, n. Ordine) visibile in ogni pagina | **Campo previsto nel footer**, valore da confermare → **bloccante per il go-live** (`check:data`). | Il sito attuale **non** lo indica: è una non conformità che il nuovo sito sana. |
| Autorizzazione sanitaria regionale                                     | Campo previsto nel footer e in `/note-legali`. Valore da confermare.                               |                                                                                 |
| Ragione sociale, P. IVA, sede                                          | Presenti nel footer. Ragione sociale aggiornata a S.r.l. (da verificare su visura).                |                                                                                 |
| PEC                                                                    | Campo previsto.                                                                                    |                                                                                 |
| Numeri di iscrizione all'Ordine di tutti i medici                      | Previsti nelle schede équipe (Fase 3).                                                             | Segnale E-E-A-T oltre che deontologico.                                         |

## 3. GDPR e cookie

| Requisito                         | Implementazione                                                                                                                                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Analytics senza consenso          | **Plausible** (nessun cookie, nessun identificativo persistente, dati aggregati): rientra tra gli strumenti che non richiedono consenso preventivo. Va comunque citato nella cookie policy.                                                |
| Cookie di terze parti (GA4)       | Caricato **solo dopo consenso esplicito**. Se `ga4MeasurementId` è vuoto il banner non compare affatto (nessun cookie non tecnico viene mai impostato).                                                                                    |
| Banner                            | Consenso preventivo e granulare; "Rifiuta" e "Accetta" hanno stessa dimensione ed evidenza; nessun checkbox preselezionato; preferenze modificabili dal footer; **non copre mai la CTA di emergenza** (posizionato sopra la barra sticky). |
| Form di prenotazione (Fase 2)     | Informativa specifica; due checkbox distinti: gestione della richiesta (necessario, base giuridica: misure precontrattuali) e marketing (facoltativo, mai preselezionato, base giuridica: consenso).                                       |
| Form colleghi con upload (Fase 4) | Informativa dedicata per dati di terzi (proprietario del paziente); limite dimensioni e tipi consentiti.                                                                                                                                   |
| Privacy policy e cookie policy    | Pagine dedicate (Fase 5–7). Titolare: PAN S.r.l.                                                                                                                                                                                           |
| Log e dati del form               | Netlify Forms: dati conservati nel pannello Netlify (UE/USA: verificare la regione dell'account e citare la clausola nelle policy).                                                                                                        |

## 4. Accessibilità (WCAG 2.1 AA)

| Requisito          | Implementazione Fase 1                                                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contrasti          | Testo corpo ≥ 7:1, UI ≥ 4.5:1 verificati automaticamente da `npm run check:contrasti` in entrambi i temi.                                                                                         |
| Tastiera           | Skip link, focus visibile con doppio anello (funziona su fondi chiari e scuri), menu mobile chiudibile con Esc, `aria-expanded`/`aria-controls`.                                                  |
| Senza JavaScript   | Tutto il contenuto e i contatti sono nell'HTML statico; il menu mobile ha un fallback `<noscript>` verso la navigazione completa nel footer; il badge "aperto ora" ha un testo statico veritiero. |
| Movimento          | `prefers-reduced-motion` disattiva animazioni e rivelazioni allo scroll.                                                                                                                          |
| Target touch       | Minimo 44×44 px (pulsanti 44/56 px, barra sticky 56 px).                                                                                                                                          |
| Lingua e struttura | `lang="it"`, landmark (`header`, `nav` etichettati, `main`, `footer`), un solo H1 per pagina.                                                                                                     |
| Immagini           | Slot fotografici con `alt` obbligatorio; segnaposto con `role="img"` e `aria-label` esplicito.                                                                                                    |
| Dichiarazione      | Pagina `/accessibilita` in Fase 7 con esito delle verifiche (axe, tastiera).                                                                                                                      |

## 5. Riservatezza

Nessun dato economico, di controllo di gestione o societario (fatturati, margini, valutazioni,
operazioni straordinarie) è presente nel repository: né nei contenuti, né nei commenti, né nei
file di progetto. I soli numeri ammessi sono quelli di reputazione clinica (anni di attività,
pazienti, accessi di pronto soccorso), e solo se confermati dalla clinica.
