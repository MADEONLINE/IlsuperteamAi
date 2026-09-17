# TODO-DATI — dati da raccogliere in clinica prima del go-live

Tutti i valori sotto sono oggi impostati a `{{DA_CONFERMARE}}` (o marcati "da verificare")
in `src/data/clinica.json`. Il comando `npm run check:data` li elenca; **in produzione il build
si blocca** finché un segnaposto compare in una pagina pubblica.

Come compilare: aprire `src/data/clinica.json`, sostituire il segnaposto con il valore reale,
salvare, eseguire `npm run build`. Nessun altro file va toccato.

## Stato al 17 settembre 2026

Applicate le risposte di Dario Ferrari (documento _info sito clinica.docx_ del
16/09) e le decisioni della direzione del 17/09.

**Nessun segnaposto resta nelle pagine pubblicate: il controllo che blocca il
build di produzione ora passa.** Il sito è tecnicamente pubblicabile.

Chiusi in questo giro: civico 12, PEC, Ordine del direttore sanitario, Instagram,
partita IVA, anno di apertura, parcheggio e punto di riferimento, numeri d'Ordine
di nove medici, titoli e aree cliniche, orari delle visite (tutti i giorni,
09:00–13:30 e 15:00–19:30). L'autorizzazione sanitaria regionale è stata tolta dal
sito: la direzione ha verificato che non è richiesta per il sito web. WhatsApp è
stato sostituito da un assistente che accompagna tra le pagine.

**Cosa manca ancora** — niente di bloccante:

1. 🟡 **Fotografie** della struttura e dei 21 medici (oggi immagini generate).
2. 🟡 **Numeri di prova sociale** (4.500 clienti, 20.000 animali, 1.015 accessi di
   pronto soccorso) e **prezzi dei Piani Salute**: domande rimaste senza risposta,
   quindi non pubblicati.
3. 🟡 **Rilettura dei testi** clinici da parte del medico che li firma, e
   **consenso scritto** alla pubblicazione per i medici non soci (voce 5b).
4. 🟡 **Coordinate GPS** dell'ingresso e **URL della scheda Google Business**.
5. 🟡 **Numeri d'Ordine** dei restanti 12 medici e conferma che la provincia degli
   altri otto sia Napoli (dedotta). Non è un obbligo di legge: lo è solo per il
   direttore sanitario, già inserito.
6. 🟡 **Dominio e caselle email**: pubblicazione su clinicaveterinariadelbosco.it,
   redirect dei due domini alternativi, attivazione di info@ e urgenze@.

## 🔴 Bloccanti per il go-live (obblighi di legge)

| #     | Dato                                                                                                                                                | Dove va                                               | Chiave in `clinica.json`                                                                   | Chi lo fornisce             |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------- |
| ~~1~~ | ~~Direttore sanitario: nome e cognome~~ → ✅ **Dott. Alessandro Sica**, confermato (Dario Ferrari, 16/09/2026)                                      | Footer di ogni pagina, `/la-struttura`, JSON-LD       | `direttoreSanitario.nome` (inserito)                                                       | Direzione                   |
| ~~2~~ | ~~N. iscrizione all'Ordine del direttore sanitario~~ → ✅ **Ordine di Napoli n. 1080** (Dario Ferrari, 16/09/2026)                                  | Footer, `/la-struttura`                               | inserito                                                                                   | Fatto                       |
| 3     | **Autorizzazione sanitaria regionale**: numero, ente e data                                                                                         | Footer, `/note-legali`                                | `autorizzazioneSanitaria.numero`, `autorizzazioneSanitaria.ente`                           | Direzione / amministrazione |
| ~~4~~ | ~~PEC della società~~ → ✅ **clinicadelbosco@pec.it** (Dario Ferrari, 16/09/2026)                                                                   | Footer, `/note-legali`                                | inserito                                                                                   | Fatto                       |
| 5b    | **Consenso scritto alla pubblicazione** di nome, ruolo, titoli e (in futuro) foto per ogni medico non socio e per gli specialisti in collaborazione | Schede équipe, blocchi "Chi se ne occupa" nei servizi | Modulo di consenso (GDPR) da far firmare; finché manca, la scheda resta `daValidare: true` | Direzione + ogni medico     |

> **Iscrizione all'Ordine dei singoli medici.** Non è un obbligo di legge:
> lo è quella del **direttore sanitario** (voci 1 e 2, entrambe risolte). I campi
> `numeroOrdine` e `provinciaOrdine` nelle schede sono quindi **facoltativi** —
> dove il dato manca la riga non viene mostrata e non blocca la pubblicazione.
>
> Pubblicati i nove numeri forniti da Dario Ferrari il 16/09/2026: Sica 1080,
> Ferrari 1174, Sergio 1803, Rosapane 1607, Cardaropoli 1532, Cavazzino 1708,
> Casciello 1824, Esposito 1962, Carpentieri 1042. Gli altri dodici medici si
> potranno aggiungere quando comodo, come elemento di fiducia in più.
>
> Per gli otto medici diversi dal direttore sanitario la **provincia** è stata
> dedotta (Napoli): vale una conferma, ma non è bloccante.

## 🟠 Necessari per funzionare bene (conversione e SEO locale)

| #      | Dato                                                                                                                                                                                                                                                                                 | Perché serve                                                                                                                                                                                                        | Chiave                                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 6      | **Orari dell'ambulatorio**: ⚠️ ricevute le fasce **09:00–13:30** e **15:00–19:30** (Dario Ferrari, 16/09/2026) ma **senza i giorni della settimana**. Non pubblicati: serve sapere quali giorni (lun–ven? sabato? domenica?)                                                         | Badge "aperto ora" con stato ambulatorio, `openingHoursSpecification`, tabella orari nel footer, Google Business Profile completo. Finché non confermati il sito mostra solo "pronto soccorso 24/7" (mai "chiuso"). | `orari.ambulatorio.settimana` + `orari.ambulatorio.confermato = true`                          |
| ~~7~~  | ~~Numero WhatsApp Business dedicato~~ → ✅ **Scelta superata**: WhatsApp è stato rimosso dal sito e sostituito da un assistente che guida tra le pagine (17/09/2026)                                                                                                                 | Barra sticky mobile, fallback del form di prenotazione. Finché manca, il pulsante WhatsApp è sostituito da "Prenota".                                                                                               | `contatti.whatsapp.e164` (es. `+393401234567`) e `contatti.whatsapp.visualizzato`              |
| 8      | **Coordinate GPS dell'ingresso** (non del centroide)                                                                                                                                                                                                                                 | JSON-LD `geo`, deep link mappe più precisi. Rilevarle da Google Maps con un clic destro sull'ingresso.                                                                                                              | `geo.lat`, `geo.lng` (numeri con il punto, es. `40.8151`)                                      |
| 9      | **URL del profilo Google Business**                                                                                                                                                                                                                                                  | `sameAs` in JSON-LD, coerenza NAP, link "recensioni"                                                                                                                                                                | `social.googleBusiness`                                                                        |
| ~~10~~ | ~~Anno di fondazione~~ → ✅ **2010**, confermato (Dario Ferrari, 16/09/2026)                                                                                                                                                                                                         | Prova di solidità in home, `/la-struttura`, `foundingDate`                                                                                                                                                          | inserito                                                                                       |
| ~~11~~ | ~~Parcheggio~~ → ✅ posto riservato alle soste brevi per emergenze, garage non convenzionato e strisce blu nei pressi (Dario Ferrari, 16/09/2026)                                                                                                                                    | Rassicurazione accanto alle CTA, pagine locali, `/contatti`                                                                                                                                                         | inserito                                                                                       |
| 12     | **Riferimenti per arrivare** (punto di riferimento vicino, ingresso)                                                                                                                                                                                                                 | `/contatti`, `/pronto-soccorso`, pagine locali                                                                                                                                                                      | `indirizzo.riferimenti`                                                                        |
| 13     | **Validazione delle schede équipe** compilate dalla call del 2 luglio e dal file staff su Drive: aree seguite, titoli (PhD, master, GPCert, "in corso"), giorni di presenza degli specialisti, anzianità, forma corretta dei cognomi (es. Albanese, Mamonova), titolo Dott./Dott.ssa | Schede équipe, blocchi "Chi se ne occupa", autore degli articoli (E-E-A-T)                                                                                                                                          | `src/content/equipe/*.md` → mettere `daValidare: false` dopo la rilettura del medico           |
| 13c    | **Sigle formative non sciolte**: "CECEV" e "FSA" (Dott.ssa Sergio), "residency Novara" (Dott.ssa Cavazzino), "lettore CeLeMaSChe" (Dott. Ferrari, Dott. Testa)                                                                                                                       | Voce "Formazione" delle schede                                                                                                                                                                                      | `src/content/equipe/*.md` → campo `formazione`                                                 |
| 13d    | **Servizi non citati nella call né nel tariffario**: riproduzione assistita, odontostomatologia, oncologia con chemioterapia, nutrizione clinica, citologia come servizio a sé. Confermare che esistono e chi li segue                                                               | Pagine `/servizi/*` (oggi senza referente)                                                                                                                                                                          | `src/content/servizi/*.md` → campo `referenti` (o rimozione della pagina)                      |
| 13b    | **Promesse del pronto soccorso**: il personale può venire incontro in auto se avvisato? Il proprietario può restare accanto all'animale durante il triage?                                                                                                                           | Frasi mostrate nella pagina pronto soccorso solo se confermate                                                                                                                                                      | `orari.prontoSoccorso.aiutoAllArrivo`, `orari.prontoSoccorso.proprietarioAccanto` (true/false) |

| ~~13e~~ | ~~**File vettoriale del logo**~~ | — | ✅ **Ricevuto** l'11 settembre 2026: kit completo (lockup orizzontale e verticale, solo marchio, sigillo, versioni reverse, set favicon, palette). Archiviato in `docs/marchio-kit/`, applicato al sito. | Fatto |

## 🟡 Da verificare (dati esistenti ma incerti)

| #      | Dato                                                                                                           | Stato attuale                                                                                                                                                 | Azione                                                                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~14~~ | ~~Civico: 10 o 12?~~                                                                                           | ✅ **Civico 12**, confermato (Dario Ferrari, 16/09/2026). Applicato in `clinica.json` e nei 5 file che lo riportavano a mano.                                 | Resta da allineare TUTTE le directory esterne (Google Business, Yelp, PagineGialle, Facebook) al civico 12.                                     |
| ~~15~~ | ~~Partita IVA 04669140651~~                                                                                    | ✅ **Confermata** (Dario Ferrari, 16/09/2026). `partitaIvaDaVerificare = false`.                                                                              | Fatto                                                                                                                                           |
| ~~16~~ | ~~Ragione sociale~~                                                                                            | ✅ **PAN S.r.l.**, confermata (Dario Ferrari, 16/09/2026).                                                                                                    | Fatto                                                                                                                                           |
| 17     | **Formato del numero di telefono**                                                                             | Sito: "081 7763859".                                                                                                                                          | Verificare come è scritto su Google Business Profile e usare **lo stesso identico formato** in `contatti.telefono.visualizzato` (coerenza NAP). |
| 18     | **Numeri di prova sociale**: ~4.500 clienti attivi, >20.000 animali seguiti, 1.015 accessi PS nell'ultimo anno | ⚠️ La domanda è stata posta il 11/09 ma **è rimasta senza risposta** nel documento del 16/09: restano `numeri.confermato = false` e **non vengono mostrati**. | Serve un sì/no esplicito, con l'eventuale formulazione preferita.                                                                               |
| ~~19~~ | ~~Handle Instagram~~                                                                                           | ✅ Il profilo corretto è **@clinicaveterinariadelbosconew** (Dario Ferrari, 16/09/2026), non quello indicato prima. Aggiornati handle e URL.                  | Fatto                                                                                                                                           |

## 🟢 Contenuti da validare (scritti, pubblicabili dopo rilettura)

| #   | Cosa                                                                      | Stato                                                                                             | Azione                                                                                                   |
| --- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 27  | **Prezzi dei Piani Salute** (`src/data/piani-salute.json`)                | Importi realistici ma indicativi; `prezziConfermati = false` mostra "importi in fase di conferma" | La clinica conferma prezzi, prestazioni incluse e valori indicativi; impostare `prezziConfermati = true` |
| 28  | **Onorari indicativi** (`src/data/tariffe.json`)                          | Valori indicativi; `confermato = false` tiene la pagina `/tariffe` in noindex con avviso          | Confermare o modificare gli importi; impostare `confermato = true`                                       |
| 29  | **Recensioni Google** (`src/data/recensioni.json`)                        | Vuoto: la sezione recensioni non compare finché non si importano recensioni reali                 | Copiare 6–10 recensioni reali (autore, testo, stelle, data) e URL del profilo                            |
| 30  | **Rilettura clinica di servizi, articoli, campagne, FAQ e pagine locali** | Testi completi, scritti secondo linee guida WSAVA/ESCCAP/AAHA, con autore e revisore indicati     | Ogni medico rilegge i contenuti che firma e aggiorna `dataRevisione`                                     |
| 31  | **Storie cliniche** (`src/content/casi/`)                                 | 3 casi anonimizzati con `validato: false` (non pubblicati)                                        | Validare i casi o sostituirli con casi reali anonimizzati                                                |
| 32  | **Riferimenti geografici delle pagine locali** (quartieri, percorsi)      | Verosimili, da confermare da chi conosce il territorio                                            | Rileggere `src/content/zone/*.md`                                                                        |
| 33  | **Fotografie**                                                            | Segnaposto numerati secondo `BRIEF-FOTO.md`                                                       | Servizio fotografico; sostituire i segnaposto                                                            |

## 🔵 Infrastruttura digitale

| #   | Cosa                                                                      | Perché                                                                                                                                                                                                                                | Dove                                                                     |
| --- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 20  | **Email sul dominio** (`info@` e `urgenze@clinicaveterinariadelbosco.it`) | Un indirizzo @alice.it su un sito sanitario abbassa la fiducia. Il sito è già predisposto: quando le caselle esistono, impostare `contatti.email.proposta.attiva = true`.                                                             | Provider email (es. Google Workspace) + record MX/SPF/DKIM/DMARC sul DNS |
| 21  | **DNS dei tre domini**                                                    | `clinicaveterinariadelbosco.it` deve diventare il dominio principale; `migliorveterinarionapoli.it` e `clinicadelbosco.com` vanno puntati allo stesso hosting per i redirect 301 (già configurati in `netlify.toml` / `vercel.json`). | Registrar dei domini                                                     |
| 22  | **Google Search Console + Bing Webmaster**: codici di verifica            | Monitoraggio indicizzazione, invio sitemap, "cambio di indirizzo" dal vecchio dominio                                                                                                                                                 | `misurazione.googleSiteVerification`, `misurazione.bingSiteVerification` |
| 23  | **Plausible** (o Umami): attivazione account                              | Analytics senza cookie (default). Il dominio è già impostato.                                                                                                                                                                         | plausible.io → aggiungere il sito                                        |
| 24  | **GA4** (opzionale)                                                       | Attivato solo dopo consenso. Lasciare vuoto se non serve.                                                                                                                                                                             | `misurazione.ga4MeasurementId`                                           |
| 25  | **IndexNow key**                                                          | Notifica immediata a Bing/Yandex dei nuovi contenuti (Fase 6)                                                                                                                                                                         | `misurazione.indexNowKey`                                                |
| 26  | **Notifica email del form**                                               | Netlify Forms: impostare l'indirizzo della reception nelle notifiche (Fase 2)                                                                                                                                                         | Pannello Netlify → Forms → Notifications                                 |

## Come sapere se manca ancora qualcosa

```bash
npm run check:data
```

Elenca ogni segnaposto ancora presente nei dati e nelle pagine pubblicate. Con
`CHECK_DATA_STRICT=1 npm run build` si simula il comportamento di produzione (build bloccato).
