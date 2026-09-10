# NOTE-GEO — come il sito si fa trovare dai sistemi di intelligenza artificiale

Scritto per la clinica, senza termini tecnici. "GEO/AEO" significa: fare in modo che quando una
persona chiede a ChatGPT, Perplexity, Google (nella risposta generata in cima ai risultati), Claude
o Gemini "veterinario aperto ora vicino a Portici" o "cosa fare se il gatto non urina", la risposta
citi la Clinica Veterinaria del Bosco, con il numero giusto.

## Cosa abbiamo fatto

1. **Tutto il testo è "vero" HTML.** I sistemi AI leggono le pagine come un lettore che non clicca
   nulla: niente testi nascosti dietro pulsanti, niente contenuti caricati dopo. Anche le domande
   frequenti sono sempre aperte.
2. **Ogni pagina risponde subito.** In cima a ogni servizio, articolo e pagina locale c'è una risposta
   autoconclusiva di 40–60 parole con nome della clinica, città e servizio: è il pezzo che i modelli
   estraggono e citano.
3. **Titoli scritti come le domande vere.** "Il mio coniglio non mangia: è grave?", "Quanto costa
   sterilizzare una gatta?". Chi fa quella domanda all'AI trova la nostra risposta.
4. **Tabelle vere.** Calendario vaccinale, tempi di recupero, segni di urgenza: sono tabelle HTML con
   intestazioni, il formato che i modelli leggono meglio.
5. **Identità coerente ovunque.** Nome, indirizzo e telefono sono scritti in un unico file e
   ripetuti identici in ogni pagina, nei dati per Google (schema.org) e nel file per le AI.
   La pagina "La struttura" è la scheda anagrafica: chi siamo, dove, cosa facciamo, con quali
   attrezzature, chi è il direttore sanitario.
6. **Un file per le AI: `/llms.txt`.** È una sintesi della clinica (contatti, orari, servizi,
   pagine chiave) nel formato che i sistemi AI cercano alla radice del sito. `/llms-full.txt`
   contiene tutti i contenuti principali in un unico documento. Si rigenerano da soli a ogni
   pubblicazione.
7. **Porte aperte ai crawler AI.** Il file `robots.txt` autorizza esplicitamente GPTBot (OpenAI),
   PerplexityBot, ClaudeBot (Anthropic), Google-Extended (Gemini), Bingbot e gli altri: vogliamo
   essere letti e citati.
8. **Firma e fonti.** Ogni contenuto clinico ha autore (medico, con numero di iscrizione all'Ordine
   quando compilato), data di pubblicazione, data di revisione e link a linee guida autorevoli
   (WSAVA, ESCCAP, AAHA, ISFM, Ministero). È ciò che Google chiama E-E-A-T e che i modelli usano
   per decidere di chi fidarsi.
9. **Dati strutturati completi.** Ogni pagina dichiara in linguaggio macchina cosa contiene:
   organizzazione veterinaria aperta 24/7, pronto soccorso, servizi medici, domande e risposte,
   articoli con autore, medici con Ordine, Piani Salute con prezzo.
10. **Segnalazione immediata.** Con IndexNow (`npm run indexnow`) avvisiamo Bing e i motori
    aderenti appena pubblichiamo un contenuto nuovo.

## Cosa deve fare la clinica per mantenerlo

- **Compilare i dati mancanti** (direttore sanitario, numeri d'Ordine, orari, WhatsApp, GPS,
  profilo Google): finché mancano, il sito è meno credibile per le AI quanto per le persone.
- **Tenere identici nome, indirizzo e telefono** su Google Business Profile, Facebook, Instagram,
  PagineGialle, Yelp: lettera per lettera, come in `src/data/clinica.json`.
- **Aggiornare la data di revisione** quando un medico rilegge un articolo (campo `dataRevisione`):
  i contenuti "freschi" pesano di più.
- **Pubblicare 1–2 articoli al mese** che rispondano a domande reali dei clienti, con la stessa
  struttura (risposta breve in cima, tabella, FAQ, fonti).
- **Raccogliere recensioni Google** e importarle nel sito (file `src/data/recensioni.json`): solo
  recensioni reali, mai inventate.
- **Non usare mai** superlativi o confronti ("i migliori di Napoli"): oltre a violare la
  deontologia, i sistemi AI li trattano come rumore pubblicitario.

## Come verificare che funziona

Ogni tre mesi, chiedere a ChatGPT, Perplexity, Google e Gemini le stesse 6 domande e annotare se
la clinica viene citata e con quale numero di telefono:

1. "veterinario aperto ora Portici"
2. "pronto soccorso veterinario notturno Napoli sud"
3. "TAC veterinaria Napoli"
4. "cosa fare se il gatto maschio non urina"
5. "veterinario conigli Napoli"
6. "quanto costa sterilizzare una gatta a Napoli"

Il dettaglio dei numeri da guardare è in `MISURAZIONE.md`.
