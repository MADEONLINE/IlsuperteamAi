"""Impacchetta la pagina Piani Salute in un unico index.html autosufficiente (CSS, JS, font inline).

Uso, dopo `npm run build` in clinica-del-bosco/:
    python3 piani-salute-bozza/impacchetta.py clinica-del-bosco/dist piani-salute-bozza/index.html
Il file risultante si pubblica su un progetto Netlify separato, senza collegamenti al sito.
"""
import base64
import re
import sys

dist, uscita = sys.argv[1], sys.argv[2]
h = open(f'{dist}/piani-salute.html').read()
b64 = lambda p: base64.b64encode(open(dist + p, 'rb').read()).decode()


def css(m):
    c = open(dist + m.group(1)).read()
    return '<style>' + re.sub(
        r'url\((/fonts/[^)]+)\)', lambda f: f'url(data:font/woff2;base64,{b64(f.group(1))})', c
    ) + '</style>'


def js(percorso):
    c = open(dist + percorso).read()
    return re.sub(
        r'(from\s*|import\s*)"\./([^"]+)"',
        lambda m: m.group(1)
        + '"data:text/javascript;base64,'
        + base64.b64encode(js('/_astro/' + m.group(2)).encode()).decode()
        + '"',
        c,
    )


# La CSP di Astro elenca gli hash dei file esterni: con tutto inline non vale più.
h = re.sub(r'<meta http-equiv="content-security-policy"[^>]*>', '', h)
h = re.sub(r'<link rel="stylesheet" href="(/_astro/[^"]+\.css)"[^>]*>', css, h)
h = re.sub(r'<link rel="preload" href="/fonts/[^"]+"[^>]*>', '', h)
h = re.sub(r'<link rel="icon" href="/favicon.ico"[^>]*>', '', h)
h = h.replace('href="/favicon.svg"', f'href="data:image/svg+xml;base64,{b64("/favicon.svg")}"')
h = re.sub(
    r'<script type="module" src="(/_astro/[^"]+)"></script>',
    lambda m: '<script type="module">' + js(m.group(1)) + '</script>',
    h,
)
# Chi ospita il file (anteprima Claude, import su Netlify) può avvolgerlo in un proprio <body>
# con font e sfondo fissi: questa regola fuori dai layer di Tailwind ripristina quelli della clinica.
h = h.replace(
    '</head>',
    '<style>html body{margin:0;background-color:var(--sfondo);color:var(--testo);'
    'font-family:var(--font-sans);font-size:var(--text-base);'
    'line-height:var(--text-base--line-height)}</style></head>',
    1,
)
assert not re.search(r'(?:href|src)="/', h), 'restano riferimenti a file esterni'
open(uscita, 'w').write(h)
