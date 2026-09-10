# Calendari BVB — lettura e parsing degli eventi aula

## 1. Calendari disponibili

| Calendario | ID | Ruolo |
|---|---|---|
| BRAVE MEDIA | `info@bravemedia.biz` | **Fonte primaria** delle aule, moduli, corsi ed eventi live |
| Calendario e-learning Brave - live | `ummb20ker2m7dhoobslol49apg@group.calendar.google.com` | Secondario: live e-learning. Verificarlo sempre, spesso è vuoto |
| madeonline.biz@gmail.com | `madeonline.biz@gmail.com` | Impegni personali che possono vincolare le date |
| Festività / Festività in Italia | `c_e5541f...@group.calendar.google.com`, `it.italian#holiday@group.v.calendar.google.com` | Contesto: ponti e festivi impattano prezzi e disponibilità |

> Nota: se in futuro le aule finiscono su un calendario dedicato (es. "Private Business"), aggiornare questa tabella — il flusso resta identico, cambia solo l'ID interrogato. Fuso di riferimento: **Europe/Rome**.

## 2. Come si presenta un evento aula

Sul calendario BRAVE MEDIA la stessa trasferta compare tipicamente **due volte**:

1. **Banner all-day** — titolo in maiuscolo con la città, `transparency: transparent`, `availability: AVAILABILITY_FREE`.
   Esempi reali: `AI REVOLUTION - PADOVA`, `AI REVOLUTION - BOLOGNA`, `GESTIONE EC. LONG - 2° MODULO - MILANO`, `SUPER MASTER AI - 2a ED. 1° Modulo`.
2. **Sessione oraria** — stesso corso con orari reali e spesso il campo `location`.
   Esempi reali: `Gestione della Clinica - Modulo 2 | Marketing` 09:00–17:00, `location: Milano`; `SUPER MASTER AI - 2a Ed. 1° Modulo` 09:00–17:00.

**Regola di deduplica**: banner all-day + sessioni orarie che si sovrappongono nelle stesse date e nella stessa città = **una sola trasferta**. Gli orari li prendo dalle sessioni, la città dal banner o dal `location`.

**Multi-giorno**: un modulo di due giorni può essere un unico evento (24→25 settembre) oppure **due eventi separati con lo stesso titolo in giorni consecutivi**. Entrambi i casi vanno accorpati in una trasferta sola.

## 3. Trabocchetto delle date — `end.date` è ESCLUSIVA

Per gli eventi **all-day** Google Calendar restituisce `end.date` come **giorno successivo** all'ultimo giorno reale.

```
"AI REVOLUTION - PADOVA"   start.date 2026-10-01   end.date 2026-10-02   → evento di 1 SOLO giorno (1 ottobre)
"GESTIONE EC. LONG - 2° M" start.date 2026-10-01   end.date 2026-10-03   → evento di 2 giorni (1 e 2 ottobre)
```

Ultimo giorno reale = `end.date − 1`. Sbagliare qui significa prenotare una notte in più e un volo il giorno sbagliato. Per gli eventi **con orario** (`start.dateTime` / `end.dateTime`) la fine è invece reale, nessuna correzione.

## 4. Cosa è una trasferta e cosa no

**Sì** — aule, moduli, corsi, convention, eventi live: titoli con `MODULO`, `MASTER`, `AI REVOLUTION`, `GESTIONE`, `CONVENTION`, `Clinic`, `Corso`, nome di città, oppure eventi all-day che bloccano una o più giornate intere.

**No** — call e videoconferenze (`conferenceUrl` valorizzato, Google Meet, Calendly), meeting interni con singole persone, promemoria personali (`Deb 10:45`, `Audible abb`), coworking e prenotazioni di postazione, festività.

Se la città non è deducibile da titolo, `location` o descrizione: **chiedo**, non tiro a indovinare. Le città ricorrenti sono Milano, Padova, Bologna, Roma, Palermo.

## 5. Chiamata tipo

```
mcp__Google_Calendar__list_events
  calendarId: info@bravemedia.biz
  startTime:  <oggi>T00:00:00+02:00
  endTime:    <oggi+60g>T23:59:59+02:00
  orderBy:    startTime
  pageSize:   50
```

Se la risposta contiene `nextPageToken`, paginare: gli eventi aula sono spesso oltre la prima pagina. Una risposta senza chiave `events` significa **nessun evento** in quella finestra, non un errore — controllare l'altro calendario prima di dire che non c'è nulla.

## 6. Incrocio con i calendari personali

Prima di proporre le date, verificare che chi viaggia non abbia già impegni nella finestra (incluso il giorno del check-in). Un conflitto va **segnalato nel dossier**, non risolto d'iniziativa.
