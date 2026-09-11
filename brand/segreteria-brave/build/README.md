# Come si rigenera il PDF

Il dossier PDF è composto dai quattro documenti HTML della cartella superiore.

```
python3 build-dossier.py dossier.html          # compone le quattro parti
node render-pdf.mjs "$PWD/dossier.html" out.pdf # stampa in A4
```

`build-dossier.py` raccoglie gli stili dei singoli documenti nel `<head>`,
rimuove testate e piè di pagina di ciascuno, aggiunge copertina, indice,
testatine di parte e pagina di chiusura, e applica le regole di impaginazione.

**Font.** Chromium in questo ambiente non raggiunge Google Fonts: lo script
legge `gf.css` con i font scaricati in locale. Per rigenerarlo:

```
curl -A "Mozilla/5.0 ... Chrome/131.0.0.0 ..." "<url css2 del documento>" -o gf.css
for u in $(grep -o 'https://fonts.gstatic.com[^)]*' gf.css | sort -u); do
  # scarica in fonts/ e riscrivi l'url nel css
done
```

Senza questo passaggio il PDF esce con i font di sistema.
