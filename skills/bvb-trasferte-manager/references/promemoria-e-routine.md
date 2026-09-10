# Promemoria e routine

L'agente non "si ricorda" da solo: i promemoria vanno **materializzati** come Routine/scheduled task, altrimenti non esistono.

## 0. L'avviso che conta: T-21 via email

Il presidio principale **non è un promemoria a Claude**, è l'email automatica a `info@bravemedia.biz` inviata dal workflow n8n `BVB · Alert Trasferte T-21` ogni lunedì, per le trasferte a 21-28 giorni. Gira senza sessioni aperte e senza che nessuno se ne ricordi.

Le cadenze qui sotto sono il presidio ravvicinato, utile una volta che la trasferta è entrata in lavorazione.

## 1. Cadenza standard per trasferta

| Sigla | Quando | Contenuto del promemoria |
|---|---|---|
| `VOLO` | T‑21 giorni | Acquistare il volo/treno per {evento}. Opzione raccomandata nel dossier del {data} |
| `ALLOGGIO` | T‑14 giorni | Confermare {struttura} per {n} notti; verificare che sia arrivata la conferma e che i dati di fatturazione siano stati inseriti |
| `PRE-PARTENZA` | T‑2 giorni | Check-in online, orari aula {hh:mm}, indirizzo sede, meteo, cancellazione ancora gratuita fino a {data} |
| `FATTURE` | T+3 giorni | Raccogliere hotel, volo, transfer, parcheggio. Cercare in Gmail: {struttura}, {compagnia}, {date} |
| `SOLLECITO` | T+10 giorni | Sollecitare le fatture mancanti (testo pronto in `template-output.md`) |

Le soglie T‑21 / T‑14 si comprimono se la trasferta è più vicina: con meno di 21 giorni, `VOLO` scatta **subito**.

## 2. Come si crea il promemoria

**Una tantum, per singola trasferta** — `send_later` (o `create_trigger` con `run_once_at`), fissato alla data della tabella, con un prompt che si spiega da solo:

```
Promemoria trasferta AI REVOLUTION PADOVA (1 ottobre).
Oggi è il giorno dell'acquisto volo. Opzione raccomandata nel dossier: {compagnia} {hh:mm}, € {---}.
Verifica che il prezzo tenga ancora, poi chiedi conferma a Marta e Massimo prima di procedere.
```

**Ricorrente, di presidio** — `create_trigger` con cron settimanale (es. lunedì mattina):

```
Nome: Presidio trasferte BVB
Cron: 0 6 * * 1        (07:00/08:00 italiane secondo l'ora legale — il cron è in UTC)
Prompt: Usa la skill bvb-trasferte-manager. Leggi il calendario BRAVE MEDIA per i prossimi 45 giorni,
elenca le trasferte con la finestra di pernottamento, segnala in cima quelle a meno di 14 giorni
senza prenotazione e quelle con fatture ancora da raccogliere. Non prenotare nulla.
```

## 3. Regole

- Ogni promemoria contiene **i dati per agire**, non solo "ricordati dell'hotel": struttura, prezzo, link, scadenza cancellazione.
- Un promemoria che scatta e non trova nulla da fare **non manda messaggi**: si richiude in silenzio.
- Quando una trasferta è chiusa (fatture raccolte), i promemoria residui vanno cancellati (`delete_trigger`).
- I promemoria di acquisto **non autorizzano l'acquisto**: chiedono conferma.
