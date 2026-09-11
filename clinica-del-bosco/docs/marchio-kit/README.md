# Kit identità visiva — Clinica Veterinaria del Bosco
**Per il team di sviluppo del sito web** · settembre 2026 · a cura di Prosperity for VET

Tutti i loghi in questa cartella sono **SVG vettoriali veri** (tracciati, non immagini incorporate): scalano a qualunque dimensione senza perdita e pesano pochi KB.

---

## 1. Quale logo usare, e dove

| File | Usare per |
|---|---|
| **`logo/lockup-orizzontale.svg`** | **È il logo di default.** Header del sito, footer, firme email, documenti |
| `logo/lockup-orizzontale-reverse.svg` | Lo stesso, su fondi scuri (petrolio o verde) |
| `logo/lockup-verticale.svg` | Spazi stretti e verticali |
| `logo/radura.svg` | Solo marchio, dove il nome è già presente: favicon, avatar, watermark |
| `logo/radura-reverse.svg` | Solo marchio su fondo scuro |
| `logo/sigillo.svg` | Usi istituzionali: timbro su referti, carta ufficiale, footer "ufficiale". **Non nell'header** (il nome comparirebbe due volte) |
| `logo/sigillo-reverse.svg` | Sigillo su fondo scuro |

### Le due foglie — non sono il logo
`logo/foglia-cane.svg` e `logo/foglia-gatto.svg` sono **elementi grafici di servizio**, non marchi. Si usano nelle sezioni e nei materiali dei **Piani di Salute** (cane / gatto), come icone di sezione o illustrazioni. **Non sostituiscono mai il logo** e non vanno messi nell'header.

---

## 2. Regole d'uso

- **Spazio di rispetto:** attorno al logo lasciare uno spazio libero pari ad **almeno metà della sua altezza**.
- **Dimensione minima:** lockup orizzontale non sotto i **140 px** di larghezza; marchio da solo non sotto i **24 px**. Sotto i 48 px usare la variante semplificata (vedi favicon).
- **Fondi:** bianco, off-white `#F5F7F4`, oppure petrolio/verde con la versione *reverse*. Mai su fotografie cariche senza un velo di contrasto.
- **Da non fare:** stirare o ruotare, ricolorare fuori palette, aggiungere ombre o effetti, racchiudere in riquadri non previsti.

---

## 3. Colori

Sono già pronti in **`brand/brand.css`** come variabili CSS.

| Ruolo | Nome | HEX |
|---|---|---|
| Primario (dominante) | Verde foresta | `#24603C` |
| Secondario | Blu petrolio | `#0C4E58` |
| Fondi scuri | Petrolio cupo | `#063C46` |
| Accento caldo | Sabbia | `#C9A87E` |
| Testi | Verde notte | `#182F2A` |
| Fondi chiari | Off-white | `#F5F7F4` |

Il **verde è il colore dominante**; il petrolio dà profondità e autorevolezza; la sabbia va usata **solo come accento**, mai come colore di superficie estesa.

---

## 4. Tipografia

| Uso | Font | Pesi |
|---|---|---|
| Titoli e nome | **Playfair Display** | 500 / 600 |
| Testo, interfaccia, etichette | **Poppins** | 400 / 500 / 600 |

Entrambi da **Google Fonts** (licenza SIL Open Font License). L'import è già in `brand/brand.css`.

> ⚠️ **Importante:** nei file `lockup-*.svg` e `sigillo*.svg` il testo è **testo vero**, non tracciati. Se i font non sono caricati nella pagina, il testo ripiega su Georgia/Arial. Per l'uso web va benissimo (i font sono caricati da Google Fonts); **per la stampa** i testi vanno convertiti in tracciati.

---

## 5. Favicon

La cartella **`favicon/`** contiene il set completo già pronto, con le istruzioni in `favicon/README.md`.

In breve:
1. Copiare `favicon/` nella root del sito.
2. Spostare `favicon.ico` nella **root** (`/favicon.ico`).
3. Incollare nel `<head>` il contenuto di **`favicon/snippet.html`**.

> Da **16 a 32 px** il set usa una **variante semplificata** del marchio (`favicon/radura-semplificata.svg`): le linee sottili della Radura, a quelle dimensioni, si impasterebbero. Da 48 px in su si usa il marchio completo. È voluto, non è un errore.

---

## 6. Esempio di integrazione

```html
<link rel="stylesheet" href="/brand/brand.css">

<header class="bosco-logo-area">
  <a href="/">
    <img src="/logo/lockup-orizzontale.svg"
         alt="Clinica Veterinaria del Bosco"
         class="bosco-logo">
  </a>
</header>

<footer style="background:var(--bosco-petrolio-cupo)">
  <img src="/logo/lockup-orizzontale-reverse.svg" alt="Clinica Veterinaria del Bosco" height="48">
</footer>
```

---

## 7. Contenuto della cartella

```
logo/       loghi vettoriali (SVG) + PNG trasparenti di riserva
favicon/    set completo favicon, manifest, snippet HTML, istruzioni
brand/      brand.css con colori, font e componenti di base
```

I PNG in `logo/` (`radura.png`, `cane.png`, `gatto.png`) servono solo come **riserva** per contesti che non accettano SVG (alcuni client email, certe piattaforme social). Per il sito usare sempre gli SVG.

---

*Per dubbi sull'uso del marchio o per formati aggiuntivi: Prosperity for VET — BVB.*
