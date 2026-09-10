# Template di output

## 1. Dossier trasferta (formato principale)

```markdown
# TRASFERTA — {NOME EVENTO} · {Città}
**Aula**: {gg/mm} – {gg/mm} ({n} giorni) · **Sede**: {indirizzo o ⟨assunzione: centro città⟩}
**Chi viaggia**: {Marta / Massimo / entrambi}
**Finestra**: check-in {gg/mm} · check-out {gg/mm} · **{n} notti**
**Assunzioni**: {elenco secco di ciò che ho dato per scontato}
**Rilevazione prezzi**: {data e ora}

## 🏨 Alloggio — 3 opzioni

| | Struttura | Distanza dalla sede | Notti | Totale | Colazione | Cancellazione | Fattura | Link |
|---|---|---|---|---|---|---|---|---|
| **A** Hotel evento | {nome} | {m} / {min} a piedi | {n} | € {---} | ✅/❌ | entro {data} | ✅/❌ | [vedi]({url}) |
| **B** Più vicino | {nome} | {m} / {min} a piedi | {n} | € {---} | ✅/❌ | entro {data} | ✅/❌ | [vedi]({url}) |
| **C** Appartamento | {nome} | {m} / {min} a piedi | {n} | € {---} | — | entro {data} | ✅/❌ | [vedi]({url}) |

*Tassa di soggiorno stimata: € {---} ({n} notti × {n} persone), da pagare in loco salvo diversa indicazione.*

## ✈️ Viaggio

**Andata — {gg/mm}**
| Opzione | Orari | Durata | Bagaglio | Prezzo | Link |
|---|---|---|---|---|---|
| {compagnia/treno} | {hh:mm} → {hh:mm} | {--} | {--} | € {---} | [vedi]({url}) |

**Ritorno — {gg/mm}** *(aula finisce alle {hh:mm} → partenza non prima delle {hh:mm})*
| Opzione | Orari | Durata | Bagaglio | Prezzo | Link |
|---|---|---|---|---|---|
| {compagnia/treno} | {hh:mm} → {hh:mm} | {--} | {--} | € {---} | [vedi]({url}) |

## 💰 Totale a persona
Alloggio € {---} + viaggio € {---} + transfer stimato € {---} + tassa € {---} = **€ {---}**

## 👉 La mia raccomandazione
{Opzione X + volo delle hh:mm}. Motivo in due righe: {distanza / orario / cancellazione / prezzo}.

## ⚠️ Da sapere
- {alert: fiera in città, orario di rientro stretto, conflitto a calendario, prezzo sopra soglia...}

## ⏰ Promemoria che imposto
- {gg/mm} acquisto volo · {gg/mm} conferma alloggio · {gg/mm} check-in online · {gg/mm} raccolta fatture
```

## 2. Riepilogo mensile ("cosa abbiamo il mese prossimo")

```markdown
# Trasferte {mese} — {n} eventi

| Evento | Città | Aula | Notti | Chi | Stato |
|---|---|---|---|---|---|
| {nome} | {città} | {gg/mm}–{gg/mm} | {n} | {--} | 🔴 nulla prenotato / 🟡 solo hotel / 🟢 completa |

**Urgenze** (meno di 14 giorni e niente prenotato): {elenco}
```

## 3. Email alla struttura — richiesta disponibilità e fattura

> Da **proporre** a Marta/Massimo, mai inviare senza conferma.

```
Oggetto: Richiesta disponibilità {n} camere — {check-in} / {check-out}

Buongiorno,
vi scrivo per verificare la disponibilità di {n} camera/e singola/e dal {check-in} al {check-out}
({n} notti), con arrivo previsto in serata.

Vi chiedo cortesemente di confermare:
- disponibilità e tariffa totale, colazione inclusa o esclusa;
- possibilità di check-in dopo le 20:00;
- condizioni di cancellazione;
- emissione di fattura intestata alla società (dati sotto).

Dati di fatturazione:
{ragione sociale} — {sede} — P. IVA {---} — SDI {---}

Grazie, resto in attesa di un vostro riscontro.
{firma}
```

## 4. Sollecito fattura mancante

```
Oggetto: Richiesta fattura soggiorno {date} — {cognome}

Buongiorno,
in riferimento al soggiorno del {date} (prenotazione {rif}), non risulta ancora pervenuta
la fattura intestata alla società. Vi giro nuovamente i dati:

{ragione sociale} — {sede} — P. IVA {---} — SDI {---}

Vi ringrazio per l'invio all'indirizzo {email fatture}.
{firma}
```

## 5. Messaggio breve (WhatsApp/chat interna)

```
{EVENTO} {città} {gg/mm}
Dormiamo: {struttura}, {min} a piedi dalla sede, {n} notti, € {---} tot.
Volo: A {hh:mm} · R {hh:mm} ({compagnia}), € {---}.
Totale a testa € {---}. Confermo?
```
