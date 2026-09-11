# Anteprima provvisoria — pronta da pubblicare

Cartella autonoma con la sezione Segreteria Brave. Un solo file HTML, nessuna
dipendenza da build: i font arrivano da Google Fonts, tutto il resto è inline.

## Pubblicazione

Progetto Netlify già creato e intestato all'account BVB:
https://app.netlify.com/projects/segreteria-brave-anteprima
URL che assumerà: https://segreteria-brave-anteprima.netlify.app

Per pubblicare basta trascinare **questa cartella** nell'area di deploy del
progetto. Il deploy da questa sessione non è possibile: l'egress proxy
dell'ambiente nega la connessione a api.netlify.com per policy.

## Cosa contiene

- `index.html` — la pagina, documento completo e autonomo
- `robots.txt` — `Disallow: /`
- `_headers` — `X-Robots-Tag: noindex, nofollow, noarchive`
- `netlify.toml` — publish sulla cartella, nessun build

Le tre righe su robots e headers servono a tenere fuori dai motori di ricerca
un'anteprima di un prodotto non ancora lanciato. Vanno rimosse quando la
sezione viene pubblicata sul sito vero.

## Da fare prima della pubblicazione definitiva

- collegare il form a una destinazione reale (oggi il submit è intercettato)
- applicare il marchio, una volta scelto
- inserire la citazione dal pilota, quando è autorizzata
- togliere la fascia "Anteprima" in cima alla pagina
