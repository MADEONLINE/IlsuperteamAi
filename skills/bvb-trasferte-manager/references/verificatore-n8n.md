# Verificatore dati — workflow n8n

Le sessioni Claude possono girare dietro un proxy che blocca Booking, i siti delle compagnie e i comparatori (verificato: 18 host su 18 irraggiungibili). Il verificatore sposta la raccolta dati **su n8n**, che ha rete libera e tiene le chiavi API. Claude lo interroga via MCP, quindi funziona da qualunque superficie.

## 1. Coordinate

- **Workflow**: `BVB · Verifica Trasferte` — id `tgiIXUKT2NWEbHip`
- **Editor**: https://bravevetbusiness.app.n8n.cloud/workflow/tgiIXUKT2NWEbHip
- **Progetto**: personale `Marta Dessena <info@bravemedia.biz>`
- **Motore dati**: SerpApi (`google_hotels`, `google_flights`)
- **Chiamata**: tool MCP `Chiama_Webhook_n8n`, che invia una **POST all'URL**; i parametri viaggiano in **query string**.

## 2. Endpoint hotel

```
POST https://bravevetbusiness.app.n8n.cloud/webhook/bvb/trasferte/hotel
     ?q=<ricerca>&checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&adulti=N
     &sede_lat=<lat>&sede_lng=<lng>
```

`sede_lat`/`sede_lng` sono le coordinate della **sede dell'aula**: il workflow calcola la distanza reale di ogni struttura, scarta tutto oltre 2,5 km e **ordina per vicinanza**, non per prezzo. È il criterio n.1 della policy applicato dal codice, non a occhio.

Risposta: `fonte`, `rilevato_il`, `ricerca`, `trovati`, `risultati[]` con `nome`, `prezzo_notte`, `prezzo_totale`, `stelle`, `voto`, `recensioni`, `distanza_m`, `minuti_a_piedi`, `colazione`, `link`.

Coordinate delle sedi ricorrenti:

| Sede | Città | lat, lng |
|---|---|---|
| Copernico, Via Copernico 34 | Milano | 45.4880, 9.2012 |

## 3. Endpoint voli

```
POST https://bravevetbusiness.app.n8n.cloud/webhook/bvb/trasferte/voli
     ?da=OLB&a=LIN&andata=YYYY-MM-DD&ritorno=YYYY-MM-DD&adulti=N
```

Risposta: `opzioni[]` con `prezzo_pubblico`, `durata_totale_min`, `scali`, `tratte[]` (compagnia, numero volo, orari reali).

⚠️ **Limite strutturale, da riportare sempre nel dossier**: Google Flights espone la **tariffa pubblica**. La tariffa residenti in continuità territoriale **non compare**. Per le tratte sarde questi dati valgono per **orari e disponibilità**; il prezzo è quello del tariffario amministrato e si acquista sul sito della compagnia dichiarando la residenza.

## 4. Stato e manutenzione

| Componente | Stato |
|---|---|
| Webhook, parsing parametri, calcolo distanze, risposta JSON | ✅ verificato end-to-end su n8n |
| Credenziale SerpApi | ❌ `SerpAPI account`, `account 2` e `account 3` restituiscono **401 Invalid API key**; `account 4` non testata |

**Come si ripara** (2 minuti): aprire il workflow → nodo `SerpApi Google Hotels` → credenziale → incollare una chiave valida da https://serpapi.com/manage-api-key → salvare → ripetere sul nodo `SerpApi Google Flights` (o selezionare la stessa credenziale) → pubblicare.

Il piano free SerpApi copre 100 ricerche/mese; una trasferta ne consuma 2-3.

## 5. Automazione dell'avviso a 3 settimane

**Workflow `BVB · Alert Trasferte T-21`** — id `c0k5ToWoKtR7kCzr` — schedulato ogni lunedì 07:00, invia a `info@bravemedia.biz`.

Catena: Schedule → Google Calendar (BRAVE MEDIA, `fields=*`) → selezione eventi a 21-28 giorni → SerpApi hotel + voli → composizione HTML → Gmail.

| Componente | Stato |
|---|---|
| Selezione eventi, finestra, deduplica banner+sessioni, esclusione del rumore | ✅ verificato con dati reali di ottobre |
| Composizione e invio email | ✅ verificato (email generata correttamente in test) |
| Lettura calendario | ❌ la credenziale `Google Calendar MADEONLINE` ha **solo accesso libero/occupato**: Google restituisce gli eventi senza titolo né luogo e il filtro scarta tutto |
| Prezzi hotel e voli | ❌ chiave SerpApi non valida (vedi §4) |

**Come si ripara la lettura del calendario** — una delle due:
1. In Google Calendar → calendario **BRAVE MEDIA** → Impostazioni → Condividi con persone → `madeonline.biz@gmail.com` → permesso **"Vedi tutti i dettagli dell'evento"** (oggi è su libero/occupato).
2. Oppure creare in n8n, nel progetto personale, una credenziale Google Calendar autenticata come `info@bravemedia.biz` e assegnarla al nodo `Leggi aule BRAVE MEDIA`.

I nodi SerpApi sono impostati su `continueRegularOutput`: se la fonte prezzi cade, l'email parte comunque. L'unico blocco che ferma l'avviso è la lettura del calendario.

## 6. Richiesta della sede mancante

**Workflow `BVB · Richiesta Sede`** — id `AYfD7zjVa7PzLYem` — lunedì 07:05, invia a `info@bravemedia.biz`.

Seleziona gli eventi fra **21 e 45 giorni** per cui non esiste un indirizzo utilizzabile e ne chiede uno. Regola di validità: il campo `Luogo` conta come sede solo se contiene un indirizzo vero — almeno 8 caratteri e una parola fra via/viale/piazza/corso/largo/strada/hotel/centro/palazzo, oppure un numero. Il solo nome della città viene rifiutato.

Precedenza applicata anche dal workflow dei consigli: **`Luogo` dell'evento → mappa delle sedi note → "da confermare"**. Quando la sede arriva dal campo `Luogo` non abbiamo le sue coordinate, quindi gli hotel vengono cercati per indirizzo e la colonna della distanza riporta `da verificare` invece di un numero inventato.

Per aggiungere una sede ricorrente alla mappa (con coordinate, e quindi con l'ordinamento per distanza attivo) si modifica l'oggetto `SEDI` nei nodi `Seleziona trasferte a 3 settimane` e `Eventi senza sede`.

| Componente | Stato |
|---|---|
| Selezione eventi senza sede, testo della richiesta | ✅ verificato: su dati realistici seleziona Padova e Bologna (città nota, indirizzo assente) e il Super Master (città non deducibile), scarta Milano (sede nota) e Roma (indirizzo completo) |
| Invio email | condivide credenziale e limiti con l'alert T-21 |

## 7. Match con gli eventi del sito

Il calendario dice **quando**, il sito dice **dove**. Prima di consigliare o di chiedere una sede, ogni trasferta viene incrociata col catalogo eventi pubblicato sul sito, letto via **WooCommerce** (credenziale `WooCommerce account`, nodo `Catalogo sito` in entrambi i workflow, `executeOnce`).

### Com'è fatto il catalogo

- Le **date e le città** stanno negli attributi di prodotto: `Città = "Padova — 1 ottobre 2026 | Bologna — 2 ottobre 2026 | …"`, `Edizione = "2ª Edizione · 8-9 ott · 5-6 nov · 3-4 dic 2026"`.
- Le **sedi** stanno nel testo della scheda, in tre forme: la tabella `Data | Città | Sede` del tour, la riga in linea `Milano, 1 e 2 ottobre 2026 (HUB Copernico, Via Zuretti 34)`, o il blocco `SedeCDVet AcademyRoma`.

### Regole che evitano di sbagliare sede

1. **Una sede per tappa.** L'indirizzo viene legato alla sua data e città. Prendere il primo indirizzo della pagina è l'errore da non fare: sul tour AI Revolution significherebbe mandare a Padova l'hotel di Bologna.
2. **Un indirizzo generico vale solo per i corsi mono-città.** Su un prodotto multi-tappa non viene mai applicato a tutte.
3. **"Sede da confermare" è una sede assente**, non una sede. Bari e Torino del tour 2026 sono in questo stato e fanno scattare la richiesta.
4. **Precedenza**: campo `Luogo` del calendario → sede della tappa dal sito → mappa delle sedi note. L'email dichiara sempre da quale delle tre viene.
5. **Discordanze**: se calendario e sito indicano città diverse per le stesse date, l'email lo segnala in rosso invece di sceglierne una.

### Sedi note al 11/09/2026, dal sito

| Tappa | Sede |
|---|---|
| Milano (Super Master, Marketing AI, AI Revolution 11 dic) | **Hub Copernico, Via Zuretti 34** |
| Padova, 1 ott | Best Western Plus Net Tower Hotel |
| Bologna, 2 ott | Admiral Park Hotel, Via Fontanella 3, Zola Predosa (BO) |
| Roma (AI Revolution 29 ott, Marketing AI 15-16 ott) | Hotel Villa Eur, P.le Marcellino Champagnat 2 |
| Firenze, 30 ott | NH Firenze |
| Napoli, 20 nov | Starhotels Terminus, Piazza Garibaldi 91 |
| Roma, 17 ott (Lab Business) | CDVet Academy |
| Bari 19 nov, Torino 10 dic | ⚠️ sede da confermare |

> Nota: la sede di Milano è **Via Zuretti 34**, non Via Copernico 34 come indicato in una prima versione di questa skill. Fa fede il sito.

## 8. Scala di ripiego

Quando il verificatore non risponde o la chiave è scaduta, **si dichiara e si scende di un gradino**, senza mai inventare numeri:

1. **Verificatore n8n** — prezzi, distanze, orari reali. Sempre da preferire.
2. **WebSearch** — struttura, indirizzo, valutazione, fiere in città, tariffe amministrate da fonti istituzionali. Niente prezzi puntuali.
3. **Link precompilati** — Google Flights e Booking già filtrati per date e raggio: la verifica passa a chi viaggia, in due click, e il dossier lo dichiara in testa.

Un dossier costruito al gradino 2 o 3 riporta `⚠️ prezzi non verificati` accanto a ogni importo. Questa riga non è opzionale.
