# MISURAZIONE — i 6 numeri da guardare ogni mese

Strumento principale: **Plausible Analytics** (senza cookie, nessun banner necessario). Accesso:
plausible.io → sito `clinicaveterinariadelbosco.it`. Google Analytics 4 è predisposto ma attivo
solo se la clinica lo vorrà (si accende scrivendo l'ID in `misurazione.ga4MeasurementId`).

Gli eventi qui sotto sono già inviati dal sito: in Plausible si trovano nella sezione
"Goal conversions" (vanno creati una volta come obiettivi con lo stesso nome).

| #   | Numero                                                                                                                                        | Dove si trova                                                                                       | Perché conta                                                                                                         | Valore atteso                                           |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | **Click sul numero di telefono** (`click_chiama`), con la posizione (hero, barra sticky, pronto soccorso…)                                    | Plausible → Goals → click_chiama, proprietà `posizione`                                             | È la conversione principale: ogni click è una probabile telefonata. Confrontare le ore notturne (22–7) con il giorno | In crescita mese su mese; quota notturna ≥ 25%          |
| 2   | **Richieste di prenotazione inviate** (`form_inviato`) e **abbandono per passo** (`form_step_1..4`)                                           | Plausible → Goals; Netlify → Forms per leggere le richieste                                         | Se molti arrivano al passo 3 e pochi al 4, il problema è nell'ultimo passo                                           | Invii ≥ 60% di chi supera il passo 1                    |
| 3   | **Click su WhatsApp e Indicazioni** (`click_whatsapp`, `click_indicazioni`)                                                                   | Plausible → Goals                                                                                   | Misurano chi sta per venire o chi preferisce scrivere                                                                | Indicazioni in crescita nelle ore notturne              |
| 4   | **Piani Salute scelti** (`piano_salute_scelto`, proprietà `piano`) e richieste con motivo "piano-salute"                                      | Plausible → Goals; Netlify Forms (campo `motivo`)                                                   | Entrate ricorrenti: quale piano attira di più                                                                        | ≥ 5 richieste/mese al lancio                            |
| 5   | **Casi inviati dai colleghi** (`caso_collega_inviato`)                                                                                        | Plausible → Goals; Netlify Forms → `caso-collega`                                                   | Canale referral: TAC ed endoscopia                                                                                   | ≥ 4/mese al lancio, poi in crescita                     |
| 6   | **Visibilità su Google e nelle AI**: impressioni e click su "pronto soccorso veterinario", "veterinario aperto ora", "TAC veterinaria Napoli" | Google Search Console → Rendimento → Query; test manuale trimestrale delle 6 domande in NOTE-GEO.md | Dice se stiamo intercettando l'urgenza notturna                                                                      | Posizione media ≤ 3 sulle query di urgenza entro 6 mesi |

Numero di controllo: **`scroll_75`** (chi legge fino a tre quarti della pagina) sugli articoli:
se è basso, gli articoli sono troppo lunghi o non rispondono alla domanda.

## Dove leggere le richieste dei form

Netlify → sito → **Forms**: `prenotazione` (richieste di appuntamento) e `caso-collega` (referral
con allegati). Impostare le **notifiche email** alla reception in Forms → Notifications, e
attivare il filtro spam (attivo di default con honeypot + Akismet).

## Strumenti da collegare (una volta)

- Google Search Console: verificare la proprietà (codice in `misurazione.googleSiteVerification`)
  e inviare `https://clinicaveterinariadelbosco.it/sitemap-index.xml`. Usare "Cambio di indirizzo"
  dal vecchio dominio.
- Bing Webmaster Tools: idem (codice in `misurazione.bingSiteVerification`); IndexNow con la
  chiave in `misurazione.indexNowKey`.
- Google Business Profile: stesso nome, indirizzo, telefono del sito; link al sito nella scheda;
  orari h24 coerenti.
