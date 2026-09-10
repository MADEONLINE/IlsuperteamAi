# Linee guida per i contenuti — Clinica Veterinaria del Bosco

Valgono per chiunque scriva testi per il sito (redazione, medici, agenzia, agenti AI).

## 1. Fatti sulla clinica che si possono usare (tutto il resto NON va inventato)

- Nome: **Clinica Veterinaria del Bosco**, Corso Umberto I 10, 80055 Portici (NA). Telefono unico h24: **081 7763859**.
- Pronto soccorso **24 ore su 24, 7 giorni su 7, festivi inclusi**, con personale **in struttura** (non reperibilità).
- Degenza e **terapia intensiva** con ossigenoterapia e monitoraggio continuo.
- **Due sale chirurgiche**. Chirurgia di base e specialistica: oncologica, ricostruttiva, laser, ortopedica, laparoscopia.
- **TAC in sede** (immagini tridimensionali, oncologia, pianificazione chirurgica, total body). **Endoscopia**, radiologia digitale, ecografia addominale e cardiologica.
- **Laboratorio analisi interno** con risposta in giornata: emocromo, biochimico, coagulativo, elettroliti, emogasanalisi, test malattie infettive e metaboliche. Citologia.
- Specialistiche: ortopedia, oncologia con chemioterapia, dermatologia, oftalmologia, neurologia, gastroenterologia, nutrizione clinica, odontostomatologia, riproduzione assistita (inseminazione artificiale canina), terapia del dolore (farmacologica, agopuntura, elettroagopuntura, laser, impianti d'oro).
- **Animali esotici e conigli**: piccoli e grandi mammiferi, rettili, uccelli, pesci (medicina interna, laser terapia, chirurgia).
- Bacino: Portici, Ercolano, San Giorgio a Cremano, Torre del Greco, Napoli sud-est (Barra, San Giovanni a Teduccio, Ponticelli), Cercola, Volla, Pollena Trocchia.
- Medici (soci fondatori): Dott. Dario Ferrari, Dott.ssa Isabella Rosapane, Dott.ssa Antonella Sergio, Dott. Alessandro Sica. Le loro specializzazioni NON sono ancora note: non attribuire competenze specifiche a una persona.
- Numeri (usabili solo in forma generica finché non confermati): "oltre mille accessi di pronto soccorso nell'ultimo anno"; NON citare 4.500 clienti o 20.000 animali nei testi (li gestisce il layout quando confermati).

**Vietato**: orari dell'ambulatorio (non noti), prezzi in cifre, nomi di attrezzature con marca/modello, anno di fondazione, numero di dipendenti, parcheggio riservato, qualsiasi dato economico o societario.

## 2. Regole deontologiche (FNOVI, pubblicità sanitaria) — non negoziabili

- Veritiero, verificabile, **non suggestivo, non comparativo**. Mai: "i migliori", "n. 1", "unici", "leader", "eccellenza", confronti con altre strutture, "garantiamo", promesse di guarigione, "risultati straordinari".
- Niente prima/dopo emotivi, niente sconti o linguaggio promozionale. I Piani Salute sono "prevenzione programmata", non un'offerta.
- Tariffe: mai cifre nei testi. Al massimo "onorario indicativo comunicato prima della prestazione".
- Ogni contenuto clinico chiude con: _"Questa pagina ha finalità informative e non sostituisce la visita veterinaria."_ (il layout la aggiunge automaticamente: NON scriverla nel corpo).

## 3. Tono di voce

- Ti rivolgi al **proprietario**: "il tuo cane", "la tua gatta", mai "il paziente canino" (tranne nell'area colleghi, dove il registro è tecnico).
- Frasi brevi. **Prima la risposta, poi la spiegazione.**
- Termini tecnici spiegati nella stessa frase: "la piometra, cioè un'infezione dell'utero".
- Empatia asciutta: rassicurare e indirizzare, mai commuovere.
- Italiano corretto, niente anglicismi inutili, niente emoji, niente punti esclamativi.

## 4. Struttura "answer-first" (per Google e per i sistemi AI)

- Il campo `risposta` del frontmatter è una risposta autoconclusiva di **40–60 parole** che cita il nome della clinica, la città (Portici) e il servizio.
- Ogni sezione H2 apre con 1–2 frasi che rispondono da sole, poi approfondisce.
- Almeno 3 H2/H3 formulati come **domande reali** ("Quanto dura il ricovero dopo una sterilizzazione?", "Il mio cane zoppica da due giorni: devo preoccuparmi?").
- Dove ci sono dati confrontabili (tempi di recupero, calendario vaccinale, età, frequenze), usare il campo `tabella` del frontmatter: le tabelle HTML sono ciò che i modelli estraggono meglio.
- Ogni pagina servizio ha una sezione **"Quando venire subito"** che rimanda a `/pronto-soccorso` e menziona il numero 081 7763859.
- Link interni in Markdown con percorsi assoluti: `/pronto-soccorso`, `/prenota`, `/piani-salute`, `/servizi/<slug>`, `/magazine/<slug>`, `/per-i-colleghi`.
- Fonti: solo enti autorevoli con URL reali e stabili (WSAVA, ESCCAP, AAHA, ISFM/iCatCare, AAFP, ACVIM, Ministero della Salute, Istituti Zooprofilattici, FNOVI, EFSA, MSD Veterinary Manual). Mai URL inventati: se non si è certi dell'URL esatto, usare la home dell'ente.

## 5. Formato dei file

- Markdown con frontmatter YAML, un file per contenuto in `src/content/<collection>/<slug>.md`. Lo slug è il nome del file, in italiano, minuscolo, con trattini, senza date.
- Le stringhe YAML con due punti, apostrofi o virgolette vanno tra virgolette doppie. Apostrofi italiani: usare `'` semplice dentro stringhe con virgolette doppie.
- Date in formato `2026-09-10`.
- Lo schema completo è in `src/content.config.ts`. Un esempio completo di pagina servizio: `src/content/servizi/pronto-soccorso-h24.md`.
- Corpo Markdown: usare solo `##` e `###` (l'H1 lo genera il layout). Niente HTML nel Markdown. Niente immagini nel corpo (gli slot fotografici sono gestiti dal layout tramite `scattoBrief`).
