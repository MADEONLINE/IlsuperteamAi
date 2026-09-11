# Set Favicon — Clinica Veterinaria del Bosco

Generato dal marchio **Radura** · 11 settembre 2026 · Prosperity for VET

---

## ⚠️ Perché due versioni del marchio

La Radura è fatta di **linee verticali sottili**: sotto i 48 px si impastano e diventano una macchia grigia. È un limite fisico della griglia di pixel, non un difetto del logo.

Per questo il set usa **due esecuzioni**:

| Misura | Esecuzione | Motivo |
|---|---|---|
| **16 · 32 px** | Variante **semplificata** (chioma + stelo, 2 fessure) | Conserva la gestalt della Radura restando leggibile |
| **48 px e oltre** | Marchio **completo** (tutte le linee) | A questa dimensione il dettaglio si legge |

È la prassi dei brand con marchi dettagliati (logo "responsive"). La variante semplificata **deriva** dal marchio approvato: stessa chioma tonda, stesso stelo, stessi colori.

---

## File

### Favicon browser
| File | Uso |
|---|---|
| `favicon.ico` | Fallback classico (contiene 16/32/48) — va nella **root** del sito |
| `favicon-16.png` · `favicon-32.png` | Misure minime — variante semplificata |
| `favicon-48/64/96/128/192/512.png` | Misure medio-grandi — marchio completo |

### Varianti tile (massimo contrasto)
| File | Uso |
|---|---|
| `favicon-16-tile.png` · `favicon-32-tile.png` | Marchio bianco su tile petrolio — utile su temi scuri o dove serve stacco |

### Mobile / PWA
| File | Uso |
|---|---|
| `apple-touch-icon.png` (180) | iOS — reverse su petrolio **(consigliato)** |
| `apple-touch-icon-light.png` (180) | iOS — alternativa chiara |
| `maskable-512.png` | Android/PWA, icona adattiva (safe zone rispettata) |
| `icon-512-light.png` | Icona 512 su fondo chiaro |
| `site.webmanifest` | Manifest PWA — `theme_color` `#0C4E58` |

> iOS e Android **non gestiscono la trasparenza** nelle icone app: per questo hanno fondo pieno.

---

## Come installarlo

1. Copia la cartella `favicon/` nella root del sito.
2. Sposta `favicon.ico` nella **root** (`/favicon.ico`) — alcuni browser lo cercano lì a prescindere.
3. Incolla nel `<head>` di ogni pagina il contenuto di **`snippet.html`**.
4. Verifica con una **ricarica forzata** (i browser tengono le favicon in cache in modo aggressivo).

---

## Colori usati

Verde foresta `#24603C` · Blu petrolio `#0C4E58` · Off-white `#F5F7F4`
