# Pagine Tools e Segreteria Brave — importazione

## Cosa c'è in questa cartella

| File | Cos'è |
|---|---|
| `segreteria-brave-pagine.xml` | il file da importare: crea le due pagine, già annidate |
| `tools.html` | la sola pagina Tools, se preferite incollarla a mano |
| `segreteria-brave.html` | la sola sottopagina, se preferite incollarla a mano |

## Importazione (la via breve)

1. **Bacheca → Strumenti → Importa → WordPress.** Se lo strumento non è
   ancora installato, WordPress propone di installarlo: sono due clic.
2. Caricate `segreteria-brave-pagine.xml`.
3. Alla richiesta di assegnare gli autori, scegliete un utente esistente.
   **Non spuntate «Scarica e importa gli allegati»**: non ce ne sono, e la
   spunta farebbe solo perdere tempo.
4. Trovate due pagine **in bozza**: *Tools* e, annidata sotto, *Segreteria Brave*.
5. Apritele, controllate l'anteprima, e pubblicate quando siete d'accordo.

## Cosa tocca, e cosa no

Il file contiene **due sole pagine**. Verificato: dentro non ci sono voci di
menu, opzioni del sito, categorie, tag, articoli, allegati, widget né
impostazioni del tema. L'importazione non può quindi modificare nient'altro
del sito.

Sul lato visivo vale lo stesso. Le pagine nascevano come documenti autonomi
e sono state adattate in tre punti:

- **Tolti barra di navigazione e piè di pagina** propri: li mette il tema,
  altrimenti se ne vedrebbero due.
- **Tutto il CSS è circoscritto** sotto un solo id (`#tools-page`,
  `#sb-page`). Senza questo, regole come `body`, `h1`, `a` e `section`
  riscriverebbero il tema dell'intero sito. Verificato con una prova
  automatica: il tema attorno alla pagina resta identico, proprietà per
  proprietà.
- **Tolto il tema scuro automatico.** Su un sito chiaro, una sezione che
  diventa nera perché il visitatore ha il sistema in modalità scura sembra
  un errore. Le pagine restano chiare in ogni condizione.

Il menu **non** viene toccato: la voce «Tools» va aggiunta a mano in
*Aspetto → Menu*, quando decidete di renderla visibile. È voluto: così
potete pubblicare e controllare le pagine prima che compaiano nel menu.

## Da sistemare prima di pubblicare

1. **Il modulo di richiesta demo non invia ancora nulla.** Oggi chi lo
   compila legge «il modulo non è ancora collegato: la richiesta non parte».
   È scritto così di proposito: finché non c'è una destinazione, è meglio
   dirlo che far credere a un prospect di essere stato preso in carico.
   Per attivarlo basta scrivere l'indirizzo di destinazione nella riga
   `var ENDPOINT = '';` dentro la pagina. In alternativa il modulo si
   sostituisce con quello del plugin che già usate.
2. **L'immagine di anteprima social** va caricata in `wp-content/uploads/`
   con il nome `og-segreteria-brave.png`: il codice della pagina la cerca
   già lì.
3. **Il collegamento all'informativa privacy** punta a `/privacy-policy/`.
   Se l'indirizzo reale è diverso, va corretto.

## Se il calcolatore non reagisce

Alcuni plugin di sicurezza rimuovono il codice dalle pagine. In quel caso il
calcolatore mostra comunque numeri sensati, ma smette di aggiornarsi quando
si cambiano i valori. Si risolve consentendo il codice su queste due pagine.
