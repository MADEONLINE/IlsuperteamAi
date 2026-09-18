# Kit marchio — Segreteria Brave

Tutti i file sono generati dalla stessa sorgente della landing page: stessa
zampa, stessa palette, stesso carattere display (Fraunces). Non sono
ridisegnati a mano, quindi non possono divergere dalla pagina.

## Palette

| Token | Valore | Dove si usa |
|---|---|---|
| `--night` | `#07120F` | fondi scuri (hero, chiusura, icona) |
| `--night-ink` | `#E7EFED` | testo sui fondi scuri |
| `--paper` | `#F2F5F4` | fondo chiaro |
| `--ink` | `#0B1715` | testo sui fondi chiari |
| `--teal` | `#76B6B5` | marchio sui fondi scuri, accenti |
| `--teal-deep` | `#26706E` | marchio sui fondi chiari (contrasto AA) |

## File

| File | Formato | A cosa serve |
|---|---|---|
| `og-segreteria-brave.png` | 2400×1260 (2:1 @2x) | anteprima social della pagina. **Va caricata sul sito** in `wp-content/uploads/` con questo nome esatto: il `<meta property="og:image">` della pagina la cerca lì. |
| `lockup-chiaro.png` | PNG trasparente | marchio + nome + firma, per fondi chiari |
| `lockup-scuro.png` | PNG trasparente | marchio + nome + firma, per fondi scuri |
| `marchio-icona-1024.png` | 1024×1024 | avatar dei profili social, favicon ad alta risoluzione |
| `marchio-zampa.svg` | SVG `currentColor` | la zampa da ricolorare via CSS |
| `marchio-zampa-teal.svg` | SVG `#76B6B5` | zampa su fondo scuro |
| `marchio-zampa-deep.svg` | SVG `#26706E` | zampa su fondo chiaro |
| `marchio-zampa-night.svg` | SVG `#07120F` | zampa in negativo su fondo chiarissimo |
| `marchio-zampa-chiaro.svg` | SVG `#E7EFED` | zampa in negativo su fondo scuro |

## Regole d'uso

- Sul chiaro la zampa va in `--teal-deep`, non in `--teal`: il teal chiaro
  su fondo paper non raggiunge il contrasto AA.
- La firma è **powered by Icarus**, sempre per esteso e sempre sotto il nome.
- Il marchio non si ruota, non si deforma e non cambia colore fuori da
  questa palette. Lo spazio libero minimo attorno è pari all'altezza della
  zampa stessa.
- La zampa non è ancora depositata: la ricerca di anteriorità è aperta.
  Finché non è conclusa, evitare usi difficili da ritirare (insegne,
  stampati in tiratura, merchandising).

## Per Canva

Il collegamento Canva non può caricare file dal disco: la prima volta il
kit va caricato a mano in **Uploads**, e da lì resta disponibile a tutto il
team. Quando invece questi file saranno online sul sito, si possono
importare in Canva dal loro indirizzo senza passaggi manuali.
