# Linee guida per i contenuti — Clinica Veterinaria del Bosco

Valgono per chiunque scriva testi per il sito (redazione, medici, agenzia, agenti AI).

## 1. Fatti sulla clinica che si possono usare (tutto il resto NON va inventato)

- Nome: **Clinica Veterinaria del Bosco**, Corso Umberto I 12, 80055 Portici (NA). Telefono unico h24: **081 7763859**.
- Pronto soccorso **24 ore su 24, 7 giorni su 7, festivi inclusi**, con personale **in struttura** (non reperibilità).
- Degenza e **terapia intensiva** con ossigenoterapia e monitoraggio continuo.
- **Due sale chirurgiche**. Chirurgia di base e specialistica: oncologica, ricostruttiva, laser, ortopedica, laparoscopia.
- **TAC in sede** (immagini tridimensionali, oncologia, pianificazione chirurgica, total body). **Endoscopia**, radiologia digitale, ecografia addominale e cardiologica.
- **Laboratorio analisi interno** con risposta in giornata: emocromo, biochimico, coagulativo, elettroliti, emogasanalisi, test malattie infettive e metaboliche. Citologia.
- Specialistiche: ortopedia, oncologia con chemioterapia, dermatologia, oftalmologia, neurologia, gastroenterologia, nutrizione clinica, odontostomatologia, riproduzione assistita (inseminazione artificiale canina), terapia del dolore (farmacologica, agopuntura, elettroagopuntura, laser, impianti d'oro).
- **Animali esotici e conigli**: piccoli e grandi mammiferi, rettili, uccelli, pesci (medicina interna, laser terapia, chirurgia).
- Bacino: Portici, Ercolano, San Giorgio a Cremano, Torre del Greco, Napoli sud-est (Barra, San Giovanni a Teduccio, Ponticelli), Cercola, Volla, Pollena Trocchia.
- Medici (soci fondatori): Dott. Dario Ferrari (anestesia, agopuntura), Dott.ssa Isabella Rosapane (animali esotici), Dott.ssa Antonella Sergio (cardiologia, ecografia), Dott. Alessandro Sica (chirurgia, direttore sanitario). Le aree di ogni medico e degli specialisti in collaborazione sono in `src/content/equipe/*.md` (campo `aree`) e nel campo `referenti` dei servizi: **non citare i nomi nel corpo dei testi**, li mostra il layout nel blocco "Chi se ne occupa".
- Specialisti in collaborazione con giornate programmate: dermatologia (mensile), oculistica, neurologia (lunedì), ortopedia e neurologia (mercoledì), endoscopia e gastroenterologia (sedute programmate), ecografia, chirurgia. Anestesia: servizio interno **asservito alla chirurgia**, mai presentato come servizio a sé.
- Servizi di punta indicati dalla direzione: chirurgia specialistica, cardiologia, ecografia, medicina interna ed endocrinologia, animali esotici. Agopuntura come proposta "alternativa" complementare. Pronto soccorso h24: presente e reale, ma senza toni enfatici (alcune notti possono avere copertura ridotta: mai promettere "sempre lo stesso medico" o "nessuna attesa").
- Numeri (usabili solo in forma generica finché non confermati): "oltre mille accessi di pronto soccorso nell'ultimo anno"; NON citare 4.500 clienti o 20.000 animali nei testi (li gestisce il layout quando confermati).

**Vietato**: orari dell'ambulatorio (non noti), prezzi in cifre, nomi di attrezzature con marca/modello, anno di fondazione, numero di dipendenti, parcheggio riservato, qualsiasi dato economico o societario.

## 1b. Palette del marchio (dal logo, settembre 2026)

| Colore            | Valore    | Dove si usa                                                                           |
| ----------------- | --------- | ------------------------------------------------------------------------------------- |
| Verde bosco       | `#2a6b42` | Colore primario: pulsanti di prenotazione, link, icone, titoli di sezione             |
| Verde scuro       | `#215636` | Link su fondo chiaro, stati premuti                                                   |
| Petrolio          | `#0f4c5c` | Colore istituzionale: lettering del marchio, aree tecniche, dati legali               |
| Petrolio profondo | `#0a2f3a` | Superfici scure: apertura, striscia di servizio, piede pagina                         |
| Oro               | `#c9a26b` | Solo decorazione: rombi, filetti, pillola del piano consigliato. Mai testo di lettura |
| Crema             | `#f8f6f0` | Fondo delle pagine                                                                    |
| Corallo           | `#b93a0b` | **Riservato all'urgenza.** Mai decorativo, mai su elementi non di emergenza           |

I valori vivono in `src/styles/global.css` come token: non scrivere mai un colore direttamente
nelle pagine, usa le utility (`bg-primario`, `text-istituzionale`, `bg-oro`, `bg-urgenza`).

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

## 3b. Pronto soccorso h24: dove si comunica e dove no (decisione della direzione, settembre 2026)

- **Sul sito resta in primo piano**: home, barra fissa, pagina `/pronto-soccorso`, riquadro "È un'urgenza?" e sezione "Quando venire subito" di ogni servizio. Non ridimensionare.
- **Non è il tema delle campagne né dei contenuti social in questa fase**: le campagne stagionali (`src/content/campagne/`) hanno come `servizioCorrelato` un servizio di prevenzione o specialistico, mai `pronto-soccorso-h24`, e la CTA porta a una visita programmata. I post social promuovono prevenzione, specialisti con giornate fisse, Piani Salute e articoli del magazine.
- Nei testi il pronto soccorso compare come **istruzione di sicurezza** ("se succede X, chiama subito 081 7763859"), non come argomento promozionale ("aperti sempre, vieni quando vuoi"). Mai promettere lo stesso medico ogni notte o l'assenza di attese.

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
