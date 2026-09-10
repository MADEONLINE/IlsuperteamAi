# BENCHMARK — i migliori siti di cliniche e catene veterinarie, e cosa ne abbiamo preso

Ricerca svolta a settembre 2026 su catene e ospedali veterinari USA, UK, Europa e Italia, più le
fonti di settore sulla conversione dei siti veterinari. Le pagine dei concorrenti non sono
raggiungibili direttamente dall'ambiente di lavoro (proxy aziendale), quindi l'analisi combina i
risultati di ricerca, le rassegne di settore e la conoscenza diretta di questi siti. Ogni pattern
è seguito da ciò che abbiamo applicato al sito Del Bosco.

## 1. I numeri che guidano le scelte

| Dato                                                                                                                               | Fonte                                         | Conseguenza per Del Bosco                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 72% del traffico dei siti veterinari è da mobile; il 67% delle ricerche mobile porta a un'azione lo stesso giorno                  | Web Tonic, Vet Digital Marketing Stats 2026   | Mobile first reale: CTA chiama sopra la piega, barra sticky su ogni pagina                |
| Il tap-to-call sopra la piega converte al 18,3%: è l'azione più efficace su mobile                                                 | Web Tonic, Veterinary Landing Page Statistics | Pulsante chiama 56 px a piena larghezza in hero e nella barra sticky                      |
| 58% dei proprietari preferisce prenotare online (72% sotto i 40 anni); il 30% delle prenotazioni self-service avviene fuori orario | IDEXX Software; studio Mayo Clinic citato     | Form di prenotazione sempre disponibile, 4 passi, funziona anche di notte                 |
| Le pagine servizio con prenotazione integrata convertono 2,3× rispetto a un'unica pagina "prenota"                                 | Web Tonic                                     | Ogni pagina servizio ha CTA "Prenota" precompilata con il motivo                          |
| Landing con una sola offerta convertono meglio; più offerte riducono la conversione                                                | Unbounce / PetDesk                            | Pagina Piani Salute con un solo obiettivo (attiva il piano), calcolatore, "il più scelto" |

## 2. Pattern osservati, catena per catena

### Veterinary Emergency Group (VEG, USA) — solo urgenze, 24/7

- Messaggio unico e ripetuto: **"Open now", "call and speak with a veterinarian 24/7", "no appointment needed, walk in"**.
- "Il paziente viene visitato prima ancora della registrazione"; "possiamo venirti incontro in auto"; "puoi restare con il tuo animale tutto il tempo".
- **Applicato**: nella pagina pronto soccorso e in home ora si dice esplicitamente che non serve appuntamento, che al telefono risponde un medico e cosa succede all'arrivo. Le promesse "ti veniamo incontro in auto" e "puoi restare accanto a lui" sono predisposte in `clinica.json` (`prontoSoccorso.aiutoAllArrivo`, `prontoSoccorso.proprietarioAccanto`) e compaiono solo se la clinica le conferma.

### BluePearl (Mars, USA) — ospedali specialistici e d'urgenza

- Pagina **"Your emergency visit"**: prima di arrivare (chiama, porta cartella e farmaci), all'arrivo (aiuto dall'auto, triage), stabilizzazione (fluidi, ossigeno, trasfusioni), **costi** (stima scritta, deposito), dopo la visita (referto al veterinario curante).
- Doppio pubblico esplicito: **pet owners / veterinarians**, con portale referral.
- **Applicato**: la pagina pronto soccorso ha ora anche il blocco "Costi e pagamento in urgenza" e la promessa di referto al veterinario curante; l'area colleghi resta separata con registro tecnico.

### Banfield (Mars, USA) — 1.000+ ospedali, Optimum Wellness Plans

- Piani a tre livelli (Early Care, Active Care, Active Care Plus, Special Care) presentati con **prezzo mensile in evidenza**, "cosa include" per esteso, confronto in tabella, FAQ sulle differenze con l'assicurazione.
- Sulle pagine sede: orari, "open now", e un banner che dirotta le vere emergenze verso un ospedale d'urgenza.
- **Applicato**: tabella comparativa a tre livelli con rata mensile in evidenza e "il più scelto"; aggiunta la FAQ "Piano Salute o assicurazione?" e il selettore "quale piano per la sua età".

### VCA (Mars, USA) — CareClub, myVCA

- Portale e app con prenotazione, promemoria, chat 24/7. Il sito spinge la **relazione continua** (promemoria vaccini, ricette).
- **Applicato**: micro-conversione "promemoria di prevenzione" (consenso separato nel form) e Piani Salute con calendario ricordato dalla reception. La chat 24/7 non è replicabile: il sostituto onesto è il telefono con un medico che risponde.

### Bond Vet + Small Door (USA) — cliniche premium urbane, membership

- Hero pulito, **"Book now" ovunque**, urgent care con "same-day", membership con "prima visita coperta, 20% sulle visite, teletriage prioritario".
- Copy caldo ma essenziale, foto vere di team e cliniche, design che riduce lo stress (luce, colori naturali).
- **Applicato**: tono di voce e palette; barra di fiducia sotto l'hero (h24, medici in struttura, TAC, sale chirurgiche); rassicurazioni accanto a ogni CTA.

### Modern Animal (USA)

- Membership con prezzo annuo chiaro, "visite illimitate", "come funziona" in tre passi, pagina prezzi pubblica.
- **Applicato**: pagina tariffe indicative (in attesa di conferma) e Piani con prezzo annuo e mensile entrambi visibili.

### Medivet, Vets4Pets / Pet Health Club, IVC Evidensia (UK)

- **Prenotazione online per le routine, "le urgenze non si prenotano: chiama"** scritto chiaramente.
- Pet Health Club: prezzo mensile, "cosa include", risparmio dichiarato con nota, 4,7/5 su Trustpilot con 14.000 recensioni come prova sociale.
- Pagine di registrazione nuovo cliente e "la tua prima visita".
- **Applicato**: deviazione urgenza dentro il form; nuova pagina **"La prima visita"** (cosa portare, quanto dura, come funziona, costi, parcheggio); recensioni reali con conteggio quando importate.

### AniCura (Mars, Italia/Europa) e Ca' Zampa (Italia)

- AniCura Portoni Rossi: pronto soccorso H24 con **codici di priorità** spiegati, "ecco come va una visita", reparti con schede separate.
- Ca' Zampa: **Piano Salute** per cane, gatto e coniglio "secondo linee guida internazionali", rete di ospedali H24, pagina urgenze con elenco strutture.
- Nessuno dei due pubblica listini o numeri di attività; pochi indicano il direttore sanitario in modo evidente.
- **Applicato**: triage a tre codici colore (rosso/ambra/verde) in linguaggio da proprietario; Piano Salute esteso ai conigli come calendario personalizzato (FAQ); direttore sanitario e autorizzazione nel footer di ogni pagina (obbligo di legge, spesso disatteso).

### Rassegne 2026 (Colorlib, iMatrix, iVET360)

- Elementi ricorrenti nei siti premiati: foto vere di team e pazienti, telefono e indirizzo su ogni pagina, form che funzionano da telefono, pagine servizio con fasce di prezzo, "chi siamo" narrativo, video brevi della struttura, palette verdi/terrose invece del blu generico.
- **Applicato**: tutto già previsto; il video breve della struttura è aggiunto al brief fotografico come scatto 40.

## 3. Cosa fanno male anche i grandi (e noi evitiamo)

- Popup e banner cookie che coprono il pulsante di chiamata su mobile.
- Mappe incorporate (iframe Google Maps) che pesano 300–500 KB e rallentano la pagina di urgenza.
- Accordion chiusi con il testo delle FAQ non leggibile dai motori e dai sistemi AI.
- Superlativi ("i migliori", "leader") vietati dalla deontologia italiana.
- Nessuna firma medica e data di revisione sugli articoli.

## 4. Miglioramenti implementati dopo il benchmark

1. **Triage rapido "È un'urgenza o può aspettare?"** in home e nella pagina pronto soccorso: 12 situazioni frequenti classificate in rosso (vieni subito), ambra (chiama, ti diciamo noi) e verde (prenota una visita), con link alle risposte dettagliate. Statico, senza JavaScript, citabile dai sistemi AI.
2. **Promesse operative del pronto soccorso** (non serve appuntamento, risponde un medico, cosa succede all'arrivo, costi e pagamento in urgenza) con campi in `clinica.json` per le promesse da confermare.
3. **Barra di fiducia** sotto l'hero della home.
4. **Pagina "La prima visita"** (`/prima-visita`) collegata da prenotazione, ringraziamento, footer e home.
5. **Selettore "quale piano per la sua età"** e FAQ "Piano Salute o assicurazione?" nella pagina Piani Salute.
6. **Area colleghi**: "tre modi per inviare un caso" e scheda invio caso in PDF, oltre al modulo convenzione.
7. **Brief fotografico**: aggiunto il video breve della struttura (30–45 s, senza audio, sottotitolato).

## 5. Cosa non abbiamo copiato, e perché

- Chat o teletriage 24/7 in app: richiede personale dedicato e un fornitore; il telefono con medico che risponde è già il canale reale della clinica.
- Portale cliente con cartella clinica: dipende dal gestionale; da valutare in una fase successiva.
- Prenotazione a calendario in tempo reale: senza integrazione con l'agenda della clinica genererebbe doppie prenotazioni; il richiamo entro 24 ore è più affidabile oggi.
- Elenchi di strutture e "trova la clinica": la clinica ha una sola sede.

## Fonti

- [Colorlib — 20 Best Veterinary Website Design Examples 2026](https://colorlib.com/wp/veterinary-websites/)
- [iMatrix — Veterinary Website Design in 2026: 24 Best Examples and Must-Have Features](https://imatrix.com/blog/best-veterinary-website-designs/)
- [iVET360 — The 10 Best Veterinary Hospital Websites in 2026](https://ivet360.com/10-best-veterinary-hospital-websites/)
- [Web Tonic — Veterinary Landing Page Statistics](https://www.webtonic.io/blog/veterinary-landing-page-statistics)
- [Web Tonic — Vet Digital Marketing Stats 2026](https://www.webtonic.io/blog/veterinary-digital-marketing-statistics)
- [IDEXX Software — Conversion Optimization Strategies That Work](https://software.idexx.com/resources/blog/is-your-veterinary-website-losing-you-clients-conversion-optimization-strategies)
- [Transference Studio — Veterinary Website Design: 9 Features Every Clinic Site Needs](https://transference.studio/blog/veterinary-website-design/)
- [VEG ER for Pets](https://www.veg.com/) · [BluePearl — Your Emergency Visit](https://bluepearlvet.com/your-emergency-visit/)
- [Banfield Optimum Wellness Plan Review — Forbes Advisor](https://www.forbes.com/advisor/pet-insurance/banfield-wellness-plan-review/) · [Pawlicy — Banfield Wellness Plan Guide](https://www.pawlicy.com/blog/banfield-pet-wellness/)
- [VCA — myVCA Patient Portal](https://vcahospitals.com/press-center/vca-news/myvca) · [VCA CareClub](https://vcahospitals.com/careclub)
- [Bond Vet](https://bondvet.com/) · [Small Door Veterinary](https://www.smalldoorvet.com/) · [Bond Vet membership (Morningstar)](https://www.morningstar.com/news/business-wire/20260413151631/bond-vet-launches-membership-program-aimed-at-expanding-access-and-improving-pet-health-outcomes)
- [Modern Animal — Pricing](https://www.modernanimal.com/pricing) · [U.S. News — Modern Animal overview 2026](https://www.usnews.com/insurance/pet-insurance/modern-animal)
- [Medivet — Online Appointment Booking](https://www.medivetgroup.com/vet-practice-services/online-appointment-booking/) · [Vets4Pets — Pet insurance and health plans](https://www.vets4pets.com/pet-health-advice/pet-insurance-and-health-plans/)
- [AniCura Portoni Rossi — Pronto Soccorso H24/7](https://www.anicura.it/cliniche/ospedale-veterinario-portoni-rossi/formazione/pronto-soccorso/) · [AniCura — Ecco come va una visita](https://www.anicura.it/i-nostri-pazienti/ecco-come-va-una-visita-dal-veterinario/)
- [Ca' Zampa — Piano Salute](https://www.cazampa.it/servizi/salute-e-benessere/piano-salute/) · [Ca' Zampa — Pronto soccorso H24/7](https://www.cazampa.it/servizi/medicina-durgenza/pronto-soccorso-veterinario-h24-7/)
- [Digitail — Veterinary Wellness Plans: How to Launch, Sell, and Scale](https://digitail.com/blog/the-veterinary-wellness-plan-implementation-guide/)
- [PupPilot — Dog Symptom Checker (triage ACVECC)](https://www.puppilot.co/resources/tools/dog-symptom-checker) · [Petriage symptom checker](https://maccormickvet.com/telemedicine-pet-triage-tool/)
- [Care Animal Hospital — Plan Your First Visit](https://careanimalhospital.org/resources/plan-your-first-visit/)
