#!/usr/bin/env python3
"""
Sottoinsieme dei font self-hosted (Fraunces, Inter) ai soli glifi che servono all'italiano.
Parte dai file "latin" di @fontsource-variable e riduce byte sul percorso critico dell'LCP.

Uso (una tantum, richiede `pip install fonttools brotli`):
  python3 scripts/subset-font.py <sorgente.woff2> <destinazione.woff2> [wght-min:wght-max]

Il terzo argomento restringe l'asse variabile del peso ai soli valori usati dal CSS
(Fraunces 560:700, Inter 400:700): meno delta nella tabella gvar, meno byte.
Risultato: Fraunces 36,6 → 29,9 KB, Inter 48,3 → 25,0 KB (LCP simulato -150 ms).
"""
import sys
import tempfile
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

UNICODI = ",".join(
    [
        "U+0020-007E",  # ASCII stampabile
        "U+00A0-00FF",  # Latin-1: accenti italiani, ç, ü, °, ·, ², ½, ©, ®
        "U+0152-0153",  # Œ œ
        "U+2013-2014",  # – —
        "U+2018-201A,U+201C-201E",  # virgolette tipografiche
        "U+2022,U+2026,U+2030,U+20AC,U+2122",  # • … ‰ € ™
        "U+2190-2193,U+2212,U+2215",  # frecce, meno, barra di frazione
    ]
)

if __name__ == "__main__":
    src, dst = sys.argv[1:3]
    if len(sys.argv) > 3:
        lo, hi = (float(x) for x in sys.argv[3].split(":"))
        font = TTFont(src)
        instancer.instantiateVariableFont(font, {"wght": (lo, hi)}, inplace=True)
        tmp = tempfile.NamedTemporaryFile(suffix=".ttf", delete=False).name
        font.flavor = None
        font.save(tmp)
        src = tmp
    subset.main(
        [
            src,
            f"--output-file={dst}",
            f"--unicodes={UNICODI}",
            "--flavor=woff2",
            "--layout-features=kern,liga,calt,ccmp,locl,mark,mkmk",
            "--no-hinting",
            "--desubroutinize",
            "--name-IDs=1,2,3,4,6",
            "--notdef-outline",
        ]
    )
