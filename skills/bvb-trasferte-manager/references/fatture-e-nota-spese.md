# Fatture e nota spese di trasferta

Obiettivo: nessuna trasferta si chiude senza documento fiscale valido, intestato correttamente e archiviato.

## 1. Dati di fatturazione ⟨da confermare⟩

Da richiedere una volta sola a Marta/Massimo e poi tenere qui, così l'agente può compilare i moduli delle strutture senza chiedere ogni volta:

```
Ragione sociale : ⟨da confermare⟩
Sede legale     : ⟨da confermare⟩
P. IVA          : ⟨da confermare⟩
Codice SDI / PEC: ⟨da confermare⟩
Email fatture   : ⟨da confermare⟩
```

L'agente **non deduce e non ricostruisce** questi dati da fatture o email trovate in giro: o sono confermati qui, o li chiede.

## 2. Documenti attesi per ogni trasferta

| Voce | Documento corretto | Trappola frequente |
|---|---|---|
| Hotel | Fattura elettronica intestata all'azienda | La struttura emette **ricevuta**: va chiesta la fattura **al check-out**, dopo è molto più difficile |
| Appartamento | Fattura del gestore o del portale | Host privati spesso non fatturano → verificare **prima** di prenotare (§3 policy) |
| Volo | Fattura richiesta sul sito della compagnia | Ryanair/easyJet: la fattura si scarica dall'area prenotazione, di norma **entro pochi giorni** dal volo. Scaduta la finestra si perde |
| Treno | Fattura Trenitalia/Italo dall'area riservata | Va richiesta con P. IVA **al momento dell'acquisto** |
| Taxi / NCC | Ricevuta fiscale o fattura | Il taxi "senza scontrino" è una spesa persa: chiederlo sempre |
| Parcheggio aeroporto | Fattura del gestore | Da richiedere online dopo l'uscita |
| Pasti | Scontrino parlante / fattura | Regole di deducibilità: **verificare con il commercialista**, non decidere qui |

## 3. Ciclo di raccolta

1. **Al momento della prenotazione**: inserire i dati di fatturazione nel campo dedicato del portale. Se il campo non c'è, scrivere alla struttura via email (template in `template-output.md`).
2. **T+3 giorni dall'evento**: promemoria automatico. L'agente cerca in Gmail le fatture della trasferta (nome struttura, compagnia, date) e riporta cosa c'è e cosa manca.
3. **T+10 giorni**: sollecito per il mancante, con testo pronto da inviare.
4. **Chiusura**: riepilogo delle voci con importi e link/allegato, pronto per la nota spese e per il commercialista.

## 4. Riepilogo nota spese

```
TRASFERTA — {Evento} · {Città} · {date}
Persona: {Marta | Massimo}

Voce            Fornitore              Importo    Fattura
Alloggio        {struttura}            € {---}    ✅ / ❌ sollecitata il {data}
Volo A/R        {compagnia}            € {---}    ✅ / ❌
Transfer        {taxi/navetta}         € {---}    ✅ / ❌
Tassa soggiorno {struttura}            € {---}    (in fattura / pagata a parte)
Pasti           {---}                  € {---}    ⚠️ deducibilità da verificare
                                       ─────────
TOTALE                                 € {---}
```

L'agente non calcola percentuali di deducibilità e non dà consulenza fiscale: prepara i documenti e li passa a chi di dovere.
