# Vet Evidence · Lunedì Mattina · Reel 01 — pipeline di produzione

Master 1080×1920, 30 fps, H.264 CRF 18, AAC 128 kbps, 48.000 s, sottotitoli bruciati.
Sorgente: registrazione Zoom del 10 settembre 2026 («Rec Vet Evidence | 1°app», 56 min,
`shared_screen_with_speaker_view.mp4`, 2498×1472, 25 fps).

## File

- `zoom-pull.py` — scarica MP4, M4A e trascrizione VTT via Server-to-Server OAuth
  (`ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`, `ZOOM_USER`).
- `cards.py` — genera con Pillow le card intro, endframe e il velo con il «2» (Manrope ExtraBold,
  IBM Plex Mono, Figtree; inchiostro #1A1A1A, carta #F8F7F4, verde acqua #76B6B5).
- `build.py` — taglia i segmenti con ffmpeg, concatena, brucia i sottotitoli ASS, estrae i fotogrammi di controllo.
- `reel-01-sottotitoli.srt` / `.ass` — sottotitoli ritimati sul montaggio reale (PlayRes 1080×1920,
  Figtree SemiBold 58 px, box nero 55 %, margine basso 340 px = sopra la safe zone di 320 px).

## Montaggio (timecode del girato)

| Reel | Girato | Contenuto |
|---|---|---|
| 0:00–0:02 | — | Intro, fondo inchiostro, domanda su tre righe (muto) |
| 0:02–0:10.8 | 02:19.80 → 02:28.62 | Marta, crop 9:16 sul volto (FACE_X 0.58) |
| 0:10.8–0:19.4 | 02:41.33 → 02:44.42 · 02:48.68 → 02:51.05 · 02:51.52 → 02:54.60 | Liliane in tre battute (jump cut interni), FACE_X 0.665 |
| 0:19.4–0:28.6 | 03:35.25 → 03:44.45 | Agenda: crop del pannello, cornice blu, zoom 100→112 % |
| 0:28.6–0:37.6 | 04:26.74 → 04:35.75 | Passaggio agenda → menu → flowboard tenuto visibile; etichetta AGENDA→FLOWBOARD a 04:31.2 |
| 0:37.6–0:44.3 | 05:05.05 → 05:11.40 (audio) | Freeze sull'ultimo fotogramma della flowboard; il «2» entra su «due» (05:07.30) |
| 0:44.3–0:48 | — | Endframe con CTA e firma (durata calcolata per chiudere a 48.00) |

## Per rigenerare

```bash
python3 zoom-pull.py --from 2026-09-10 --to 2026-09-10 --download --out ./zoom
python3 cards.py && python3 build.py     # output in ./out/
```

Richiede ffmpeg con libass e i font Figtree, Manrope, IBM Plex Mono installati in `~/.fonts`.
