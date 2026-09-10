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

## 5. Scala di ripiego

Quando il verificatore non risponde o la chiave è scaduta, **si dichiara e si scende di un gradino**, senza mai inventare numeri:

1. **Verificatore n8n** — prezzi, distanze, orari reali. Sempre da preferire.
2. **WebSearch** — struttura, indirizzo, valutazione, fiere in città, tariffe amministrate da fonti istituzionali. Niente prezzi puntuali.
3. **Link precompilati** — Google Flights e Booking già filtrati per date e raggio: la verifica passa a chi viaggia, in due click, e il dossier lo dichiara in testa.

Un dossier costruito al gradino 2 o 3 riporta `⚠️ prezzi non verificati` accanto a ogni importo. Questa riga non è opzionale.
