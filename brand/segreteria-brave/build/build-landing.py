#!/usr/bin/env python3
"""Genera la versione pubblicabile della sezione Segreteria Brave.

Dal file di lavoro 03-sezione-sito.html toglie il banner di anteprima e le note
di lavorazione, e lo avvolge in un documento HTML completo con i meta tag, la
favicon e i segnaposto da collegare prima della messa online.
"""
import re, pathlib, sys

SRC = pathlib.Path(__file__).resolve().parent.parent
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else SRC / 'dist' / 'segreteria-brave.html'

URL   = 'https://www.bravevetbusiness.it/segreteria-brave'
TITLE = 'Segreteria Brave — la segreteria virtuale per la clinica veterinaria'
DESC  = ('La prima segreteria virtuale costruita solo per la clinica veterinaria. '
         'Risponde quando non potete, fissa gli appuntamenti secondo le vostre regole '
         'e vi lascia ogni richiesta scritta e ordinata.')

raw = (SRC / '03-sezione-sito.html').read_text(encoding='utf-8')

# Il banner di lavorazione non esce in produzione.
raw = re.sub(r'<div class="editnote">.*?</div>\s*</div>\s*', '', raw, count=1, flags=re.S)
raw = re.sub(r'\.editnote[^\n]*\n', '', raw)
# Nota di anteprima sul form.
raw = raw.replace(
    '      <p class="bf-note bf-prev">Anteprima · il form non è ancora collegato</p>',
    '      <p class="bf-note bf-prev" role="status" aria-live="polite"></p>')
raw = raw.replace(
    '''      prev.textContent = 'Anteprima · in produzione questa richiesta arriva al team commerciale';''',
    '''      // DA COLLEGARE prima della pubblicazione: invio della richiesta all'endpoint
      // scelto (casella, foglio, CRM). Finché non c'è, la richiesta non parte.
      prev.textContent = 'Grazie: ti richiamiamo entro un giorno lavorativo.';''')

style = re.search(r'<style>(.*?)</style>', raw, re.S).group(1)
body  = re.sub(r'<title>.*?</title>\s*', '', raw, count=1, flags=re.S)
body  = re.sub(r'<link[^>]*>\s*', '', body)
body  = re.sub(r'<style>.*?</style>\s*', '', body, count=1, flags=re.S)

# La zampa fa anche da favicon, in SVG.
favicon = (
    "data:image/svg+xml,"
    "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E"
    "%3Crect width='120' height='120' rx='26' fill='%230B1715'/%3E"
    "%3Cg fill='%2376B6B5'%3E"
    "%3Crect x='23' y='72' width='64' height='40' rx='20'/%3E"
    "%3Crect x='13' y='40' width='15' height='22' rx='7.5'/%3E"
    "%3Crect x='36' y='22' width='15' height='40' rx='7.5'/%3E"
    "%3Crect x='59' y='18' width='15' height='44' rx='7.5'/%3E"
    "%3Crect x='82' y='36' width='15' height='26' rx='7.5'/%3E"
    "%3C/g%3E%3C/svg%3E"
)

doc = f'''<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{TITLE}</title>
<meta name="description" content="{DESC}">
<link rel="canonical" href="{URL}">
<meta name="theme-color" content="#0B1715">
<link rel="icon" href="{favicon}">

<meta property="og:type" content="website">
<meta property="og:locale" content="it_IT">
<meta property="og:site_name" content="Brave Vet Business">
<meta property="og:url" content="{URL}">
<meta property="og:title" content="{TITLE}">
<meta property="og:description" content="{DESC}">
<!-- DA COLLEGARE: immagine di anteprima 1200x630 -->
<meta property="og:image" content="{URL.rsplit('/',1)[0]}/og-segreteria-brave.png">
<meta name="twitter:card" content="summary_large_image">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400&amp;family=Archivo:wdth,wght@75..125,400;75..125,500;75..125,600;75..125,700&amp;family=Space+Mono:wght@400;700&amp;display=swap">

<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Segreteria Brave",
  "serviceType": "Segreteria virtuale con intelligenza artificiale per cliniche veterinarie",
  "url": "{URL}",
  "provider": {{ "@type": "Organization", "name": "Brave Vet Business" }},
  "areaServed": {{ "@type": "Country", "name": "Italia" }},
  "audience": {{ "@type": "Audience", "audienceType": "Cliniche e ambulatori veterinari" }}
}}
</script>

<style>{style}</style>
</head>
<body>
{body.strip()}
</body>
</html>
'''

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(doc, encoding='utf-8')
print(f'OK -> {OUT}  ({len(doc)//1024} KB)')
