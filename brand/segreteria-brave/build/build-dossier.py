#!/usr/bin/env python3
"""Compone i quattro documenti in un dossier unico pronto per la stampa."""
import re, pathlib, sys

SRC = pathlib.Path('/home/user/IlsuperteamAi/brand/segreteria-brave')
OUT = pathlib.Path(sys.argv[1])

PARTS = [
    ('I',   'Il marchio',            'Cinque proposte, rosa ristretta a due, e il mandato per la ricerca di anteriorit\u00e0.', '01-marchio.html'),
    ('II',  'Storytelling e posizionamento', 'Il racconto di fondazione, il manifesto, i pitch, il copione della demo, le obiezioni.', '02-storytelling.html'),
    ('III', 'Strategia di marketing', 'Quattro segmenti, offerta, il prezzo reale detto in demo, funnel, novanta giorni, rischi.', '03-strategia-marketing.html'),
    ('IV',  'La sezione sul sito',    'Il sistema di lead generation: cinque punti di contatto e l’anteprima della pagina.', '05-sezione-sito-preview.html'),
    ('V',   'Piano di comunicazione', 'Quattro fasi su quattro canali, la materia prima raccolta in demo, contenuti pronti.', '04-piano-editoriale.html'),
    ('VI',  'L\u2019ascolto delle call',   'Sedici call riascoltate: dolori, domande, prezzi, e le decisioni prese con Icarus.', '06-ascolto-call.html'),
]

styles, body = [], []

for num, title, sub, fname in PARTS:
    raw = (SRC / fname).read_text(encoding='utf-8')

    # Gli stili di ogni documento vanno raccolti a parte e messi tutti nel <head>.
    for m in re.finditer(r'<style>(.*?)</style>', raw, re.S):
        styles.append(f'/* ===== {fname} ===== */\n' + m.group(1))

    markup = re.sub(r'<style>.*?</style>', '', raw, flags=re.S)
    markup = re.sub(r'<title>.*?</title>', '', markup, flags=re.S)
    markup = re.sub(r'<link[^>]*>', '', markup)
    # Testata e piè di pagina sono del dossier, non delle singole parti.
    markup = re.sub(r'<header class="top">.*?</header>', '', markup, flags=re.S)
    markup = re.sub(r'<footer>.*?</footer>', '', markup, flags=re.S)
    markup = markup.strip()
    markup = markup.replace('src="preview/', f'src="{SRC}/preview/')

    # La Parte III è scritta senza gabbia: gliela diamo qui.
    if 'class="wrap"' not in markup:
        markup = f'<div class="wrap">\n{markup}\n</div>'

    body.append(f'''
<div class="part">
  <div class="wrap">
    <div class="parthead">
      <span class="pnum">Parte {num}</span>
      <span class="ptitle">{title}</span>
    </div>
  </div>
{markup}
</div>''')

font_css = pathlib.Path(
    '/tmp/claude-0/-home-user-IlsuperteamAi/6e01e6e4-fa9f-5cd4-b087-c88c3d704f7e/scratchpad/gf-all.css'
).read_text(encoding='utf-8')

toc_rows = '\n'.join(
    f'''      <div class="tr">
        <span class="tn">Parte {n}</span>
        <span class="tt"><b>{t}</b><span>{s}</span></span>
      </div>''' for n, t, s, _ in PARTS)

doc = f'''<!doctype html>
<html lang="it" data-theme="light">
<head>
<meta charset="utf-8">
<title>Segreteria Brave &mdash; Dossier di marca e di lancio</title>
<style>{font_css}</style>
<style>
{chr(10).join(styles)}
</style>
<style>
/* ===================== livello dossier ===================== */
:root {{ --maxw: 1140px; }}

@page {{ size: A4; margin: 0; }}
html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{ margin: 0; font-size: 15.5px; }}
.wrap {{ padding-inline: 16mm !important; max-width: none !important; }}
a {{ color: inherit; text-decoration: none; }}

/* --- copertina --- */
.cover {{
  background: var(--ink); color: var(--paper);
  min-height: 297mm; padding: 30mm 16mm 22mm;
  display: flex; flex-direction: column; justify-content: space-between;
  break-after: page;
}}
.cover .cbrand {{
  display: flex; align-items: center; gap: 11px;
  font-family: var(--f-display); font-weight: 700; font-size: .95rem; letter-spacing: .02em;
}}
.cover .cbrand i {{
  width: 11px; height: 11px; border-radius: 50% 50% 50% 2px;
  background: var(--teal); transform: rotate(35deg);
}}
.cover .cbrand span {{
  font-family: var(--f-mono); font-size: .66rem; letter-spacing: .16em;
  text-transform: uppercase; color: #8FA5A1;
}}
.cover h1 {{
  font-family: var(--f-display); font-weight: 800;
  font-size: 5.1rem !important; line-height: .98; letter-spacing: -.035em;
  color: var(--paper); margin: 0 0 18px;
}}
.cover .csub {{
  font-family: var(--f-display); font-weight: 300;
  font-size: 1.85rem; line-height: 1.22; letter-spacing: -.02em;
  color: var(--teal); max-width: 22ch; margin: 0 0 26px;
}}
.cover .cline {{
  font-family: var(--f-body); font-size: 1.05rem; line-height: 1.55;
  color: #A9BCB8; max-width: 46ch;
}}
.cover .cfoot {{
  display: flex; justify-content: space-between; align-items: flex-end;
  gap: 20px; flex-wrap: wrap;
  font-family: var(--f-mono); font-size: .66rem; letter-spacing: .13em;
  text-transform: uppercase; color: #7D918D;
  border-top: 1px solid #24352F; padding-top: 16px;
}}

/* --- indice --- */
.toc {{ padding: 26mm 0 0; break-after: page; }}
.toc h2 {{ font-size: 2.5rem !important; margin-bottom: 30px; }}
.toc .tr {{
  display: grid; grid-template-columns: 116px minmax(0,1fr);
  gap: 22px; padding-block: 20px; border-bottom: 1px solid var(--line);
  align-items: baseline;
}}
.toc .tr:first-of-type {{ border-top: 1px solid var(--ink); }}
.toc .tn {{
  font-family: var(--f-mono); font-size: .7rem; letter-spacing: .14em;
  text-transform: uppercase; color: var(--teal-deep);
}}
.toc .tt {{ display: grid; gap: 6px; }}
.toc .tt b {{
  font-family: var(--f-display); font-weight: 700; font-size: 1.45rem;
  letter-spacing: -.022em; line-height: 1.15;
}}
.toc .tt span {{ font-size: .97rem; color: var(--ink-2); line-height: 1.5; }}
.toc .tnote {{
  margin-top: 34px; border-left: 3px solid var(--teal); padding: 6px 0 6px 16px;
  font-size: .95rem; line-height: 1.6; color: var(--ink-2); max-width: 66ch;
}}

/* --- testatina di parte --- */
.part {{ break-before: page; }}
.parthead {{
  display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap;
  padding-block: 14px; border-bottom: 1px solid var(--ink); margin-top: 12mm;
}}
.parthead .pnum {{
  font-family: var(--f-mono); font-size: .66rem; letter-spacing: .18em;
  text-transform: uppercase; color: var(--teal-deep);
}}
.parthead .ptitle {{
  font-family: var(--f-display); font-weight: 700; font-size: 1.02rem;
  letter-spacing: -.01em;
}}

/* --- impaginazione --- */
.hero {{ break-after: page; padding-block: clamp(30px,5vw,54px) 0 !important; }}
section {{ break-before: page; }}
section + .concept {{ break-before: auto; }}
.concept {{ break-before: page; break-inside: avoid; }}
.concept:first-of-type {{ border-top: 0; }}

.arch, .script, .prosc, .steps, .tablewrap, .reco, .lock, .apps, .c-grid,
.payoffs, .modes, .beat, .pitch, .obj > div, .lex, .yt, .post, .rules,
.pillars, .fasi, .kpigrid, .seg, .vtable, .stage, .chan > div, .risk > div,
.metr, .phase90, .funnel, .note, .dlg, .figure, .tp > div, .qual,
.src > div, .theme > div, .verd > div, .doubt > div, .act > div, .qs > div,
.dec > div, .raw > div, .risk > div, .brief > div, .res3 > div, .q {{ break-inside: avoid; }}
.calwrap tr, .vtable tr, .tablewrap tr {{ break-inside: avoid; }}
.calwrap thead {{ display: table-header-group; }}

/* Niente animazioni in stampa: i tre archi devono essere pieni. */
.specimen--live #r1, .specimen--live #r2, .specimen--live #r3 {{
  animation: none !important; opacity: 1 !important; transform: none !important;
}}
/* In A4 la colonna è stretta: il campione va contenuto in altezza. */
.specimen {{ aspect-ratio: auto !important; height: 205px !important; }}
.specimen svg {{ width: 145px !important; }}
.wordmark-spec .wm-big {{ font-size: 2.1rem !important; }}

/* La tabella del calendario editoriale non entra in A4: va ridotta. */
.calwrap table {{ min-width: 0 !important; }}
.calwrap th, .calwrap td {{ padding: 8px 9px !important; font-size: .76rem !important; }}
.calwrap td.ch {{ font-size: .74rem !important; line-height: 1.35 !important; }}
.calwrap td.day {{ width: 62px !important; }}
.calwrap td.pil {{ width: 78px !important; }}
.calwrap thead th {{ position: static !important; }}
.vtable table {{ min-width: 0 !important; }}
.tablewrap table {{ min-width: 0 !important; }}
.filters {{ display: none !important; }}

h1 {{ font-size: 3.1rem !important; }}
h2 {{ font-size: 2rem !important; }}

/* --- chiusura --- */
.endpage {{
  break-before: page; background: var(--ink); color: var(--paper);
  min-height: 297mm; padding: 34mm 16mm; display: flex; flex-direction: column;
  justify-content: space-between;
}}
.endpage h2 {{ color: var(--paper); font-size: 2.6rem !important; letter-spacing: -.03em; }}
.endpage .eq {{ display: grid; gap: 16px; margin-top: 26px; max-width: 60ch; }}
.endpage .eq > div {{ border-top: 1px solid #24352F; padding-top: 14px; }}
.endpage .eq b {{
  font-family: var(--f-display); font-weight: 700; font-size: 1.06rem;
  display: block; margin-bottom: 5px; color: var(--paper);
}}
.endpage .eq span {{ font-size: .95rem; line-height: 1.55; color: #A9BCB8; }}
.endpage .esig {{
  font-family: var(--f-mono); font-size: .66rem; letter-spacing: .16em;
  text-transform: uppercase; color: #7D918D;
  border-top: 1px solid #24352F; padding-top: 16px;
}}
</style>
</head>
<body>

<div class="cover">
  <div class="cbrand"><i></i> BRAVE VET BUSINESS <span>&times; Icarus Technology</span></div>
  <div>
    <h1>Segreteria<br>Brave</h1>
    <p class="csub">Dossier di marca e di lancio</p>
    <p class="cline">La prima segreteria virtuale dedicata esclusivamente alla clinica veterinaria. Il prodotto si chiama <strong style="color:#E7EFED">Segreteria Brave</strong>. La voce che risponde al telefono la battezza ogni clinica.</p>
  </div>
  <div class="cfoot">
    <span>Documento di lavoro &middot; versione 2 &middot; rivista sulle call</span>
    <span>Settembre 2026</span>
  </div>
</div>

<div class="wrap toc">
  <h2>Che cosa c'&egrave; dentro.</h2>
{toc_rows}
  <p class="tnote"><strong>Che cosa &egrave; cambiato dalla versione 1:</strong> fra le due stesure sono state fatte <strong>cinque demo a veterinari veri</strong> e un allineamento in cui il team Icarus ha revisionato questi materiali riga per riga. La Parte VI, nuova, riporta tutto quello che &egrave; emerso, con i link al minuto esatto delle registrazioni. Le Parti I, III, IV e V sono state riviste di conseguenza e dichiarano ogni modifica. Due cose che qui dentro erano ipotesi adesso sono fatti, e due erano sbagliate: il modello di prezzo non &egrave; un canone, e l'argomento che converte non &egrave; sempre il fatturato.</p>
</div>

{''.join(body)}

<div class="endpage">
  <div>
    <h2>Le quattro decisioni<br>che restano aperte.</h2>
    <div class="eq">
      <div><b>1. Che cosa promette l'apertura della pagina.</b><span>Il riconoscimento del chiamante dal gestionale &mdash; che era il titolo &mdash; non &egrave; confermato dal fornitore. La pagina &egrave; gi&agrave; stata riscritta su ci&ograve; che il servizio fa oggi, ma la scelta va ratificata insieme prima di pubblicare.</span></div>
      <div><b>2. Il via libera alla ricerca di anteriorit&agrave;.</b><span>La rosa &egrave; ristretta a due segni e Icarus ha chiesto la verifica sui marchi registrati. Circa 350 euro per l'Italia, 520 per Italia e Unione Europea. Blocca tutto il resto del branding.</span></div>
      <div><b>3. Il listino ufficiale al cliente finale.</b><span>I numeri esistono e sono stati detti in demo. Mancano durata minima, comportamento al superamento di un pacchetto minuti e ripartizione economica tra BVB e Icarus.</span></div>
      <div><b>4. Il rapporto con la landing emergenze.</b><span>Due strumenti nostri rispondono allo stesso dolore e nessun materiale li tiene insieme. O si compongono in un'offerta sola, o si fanno concorrenza dentro la stessa clinica.</span></div>
    </div>
  </div>
  <div class="esig">Segreteria Brave &middot; powered by Icarus &middot; pilota attivo, cinque demo fatte, due kickoff a calendario</div>
</div>

</body>
</html>'''

OUT.write_text(doc, encoding='utf-8')
print(f'OK -> {OUT}  ({len(doc)//1024} KB)')
