# Installazione — bvb-trasferte-manager

## 1. Cosa contiene

```
bvb-trasferte-manager/
├── SKILL.md                          ← flusso operativo in 6 fasi + regole di ingaggio
├── INSTALL.md
├── references/
│   ├── calendari-e-parsing.md        ← ID calendari, pattern eventi, trappola end.date
│   ├── policy-trasferte.md           ← criteri di scelta, soglie budget, tratte per città
│   ├── fatture-e-nota-spese.md       ← documenti attesi, ciclo di raccolta, nota spese
│   ├── promemoria-e-routine.md       ← cadenze T-21/T-14/T-2/T+3/T+10 e come crearle
│   └── template-output.md            ← dossier, riepilogo mensile, email a struttura
└── scripts/
    └── finestra-trasferta.mjs        ← calcolo notti, check-in/out, finestre volo
```

## 2. Installazione

**Su claude.ai (skill sincronizzata, consigliata)** — caricare la cartella `bvb-trasferte-manager/` tra le skill dell'account, come per le altre skill BVB. Da quel momento si attiva su "trasferta", "hotel per il modulo", "volo per Bologna", "fattura hotel", ecc.

**In locale (Claude Code)** — copiare la cartella in `~/.claude/skills/` (o in `.claude/skills/` del progetto) e riavviare la sessione.

## 3. Prerequisiti

| Requisito | Perché | Stato |
|---|---|---|
| Connettore **Google Calendar** | Leggere le aule dal calendario BRAVE MEDIA | necessario |
| **WebSearch / WebFetch** | Verificare hotel, appartamenti e voli in tempo reale | necessario |
| Connettore **Gmail** | Cercare le fatture di hotel e voli | consigliato |
| **Routine / scheduled task** | Materializzare i promemoria | consigliato |
| **Node.js** ≥ 18 | Eseguire `scripts/finestra-trasferta.mjs` | opzionale (le regole sono anche in SKILL.md) |

## 4. Configurazione alla prima trasferta

Tre blocchi `⟨da confermare⟩` vanno compilati una volta sola, poi la skill lavora senza chiedere:

1. `references/policy-trasferte.md` §1 — **chi viaggia**: base di partenza di Marta e Massimo, preferenze.
2. `references/policy-trasferte.md` §2 — **soglie di budget** (i valori attuali sono default proposti, non policy approvata).
3. `references/fatture-e-nota-spese.md` §1 — **dati di fatturazione**: ragione sociale, sede, P. IVA, SDI/PEC, email fatture.

Se le aule si spostano su un calendario dedicato diverso da BRAVE MEDIA, aggiornare la tabella in `references/calendari-e-parsing.md` §1: il flusso non cambia.

## 5. Prova di funzionamento

```
Cosa abbiamo in trasferta nei prossimi 60 giorni?
```

Attesa: elenco eventi con città, giorni d'aula, check-in/check-out, numero notti e stato prenotazione — senza alcuna prenotazione effettuata.

```
Organizzami la trasferta di AI REVOLUTION Padova
```

Attesa: dossier completo con tre opzioni di alloggio confrontate, voli andata/ritorno, totale a persona, raccomandazione e promemoria proposti.

## 6. Verifica dello script

```bash
node scripts/finestra-trasferta.mjs eventi.json          # JSON da list_events
node scripts/finestra-trasferta.mjs --date 2026-10-01 --days 2 --end 17:00 --citta Milano
```

Testato sugli eventi reali del calendario BRAVE MEDIA di ottobre 2026: gestisce correttamente la data di fine esclusiva degli all-day, accorpa banner e sessioni orarie dello stesso corso, e prende l'orario di rientro dall'**ultimo** giorno d'aula.
