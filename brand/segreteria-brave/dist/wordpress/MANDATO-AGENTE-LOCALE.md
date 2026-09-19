# Mandato per l'agente che lavora in locale

Da usare **solo** se l'importazione manuale non è praticabile. Se il file
`segreteria-brave-pagine.xml` si può caricare da *Strumenti → Importa*,
quella via è più breve e non richiede nessun agente.

## Contesto

Sito: `https://bravevetbusiness.it` — WordPress self-hosted con Jetpack.
Vanno create **due pagine nuove**, nient'altro.

I contenuti sono già pronti e collaudati. **Non vanno riscritti, rigenerati
né "migliorati".** Sono due frammenti HTML autonomi, con il CSS già
circoscritto sotto un id per non interferire con il tema del sito.

## File da usare

| File | Diventa |
|---|---|
| `tools.html` | il contenuto della pagina **Tools** |
| `segreteria-brave.html` | il contenuto della pagina **Segreteria Brave** |

Sono nel repository `MADEONLINE/IlsuperteamAi`, ramo
`claude/vigilant-allen-qsqtrv`, cartella
`brand/segreteria-brave/dist/wordpress/`. Se l'agente può clonare il
repository, quella è la fonte da preferire: è sempre aggiornata.

## Cosa fare

Due chiamate alla REST API di WordPress, autenticate con una Application
Password dell'utente amministratore.

**1 — pagina madre**

```
POST https://bravevetbusiness.it/wp-json/wp/v2/pages
{
  "title":   "Tools",
  "slug":    "tools",
  "status":  "draft",
  "parent":  0,
  "content": "<contenuto integrale di tools.html>"
}
```

Annotare l'`id` restituito.

**2 — sottopagina**

```
POST https://bravevetbusiness.it/wp-json/wp/v2/pages
{
  "title":   "Segreteria Brave",
  "slug":    "segreteria-brave",
  "status":  "draft",
  "parent":  <id della pagina Tools>,
  "content": "<contenuto integrale di segreteria-brave.html>"
}
```

L'indirizzo finale deve risultare `/tools/segreteria-brave/`: la pagina
Tools contiene un collegamento a quell'indirizzo esatto.

## Vincoli — da rispettare alla lettera

1. **Creare solo queste due pagine.** Nessuna modifica ad altre pagine,
   articoli, menu, widget, impostazioni del tema o opzioni del sito.
2. **Non toccare il menu di navigazione.** La voce «Tools» verrà aggiunta a
   mano quando la proprietaria deciderà di renderla visibile.
3. **Lasciarle in bozza.** La pubblicazione è una decisione sua.
4. **Non modificare il contenuto dei due file.** In particolare: non
   togliere il blocco `<style>`, non riformattare l'HTML, non convertire in
   blocchi Gutenberg. Il CSS è circoscritto di proposito, e riscriverlo
   romperebbe l'isolamento dal tema.
5. **Se una pagina con slug `tools` esiste già**, fermarsi e chiedere.
   Non sovrascriverla.
6. **Non creare Application Password nuove** se ne esiste già una valida,
   e non scriverne mai il valore in chat o in un file del repository.

## Verifiche dopo la creazione

1. Aprire l'anteprima di entrambe le pagine.
2. Controllare che l'intestazione e il piè di pagina siano **quelli del
   tema** e compaiano **una volta sola**. I frammenti non ne contengono:
   se se ne vedono due, è stato incollato il file sbagliato.
3. Controllare che il resto del sito sia invariato: aprire la home e
   un'altra pagina qualsiasi e verificare che titoli, colori e menu siano
   come prima.
4. Sulla pagina Segreteria Brave, muovere i valori del calcolatore e
   verificare che i numeri si aggiornino. Se restano fermi, un plugin di
   sicurezza sta rimuovendo il codice: va consentito su questa pagina.
5. Caricare `og-segreteria-brave.png` in `wp-content/uploads/` con quel
   nome esatto (è nella cartella `assets/` del repository).

## Cosa riferire

L'`id` e l'indirizzo di anteprima delle due pagine, l'esito delle cinque
verifiche, e qualunque cosa sia stata trovata diversa dal previsto.
