#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Prepara le due pagine per WordPress.

Il sito ha gia' il suo tema: intestazione, menu e pie' di pagina li mette
lui. Queste pagine nascono invece come documenti completi e autonomi, quindi
vanno adattate, non incollate. Tre cose che il build fa e che a mano si
sbagliano facilmente:

1. Toglie la barra di navigazione e il pie' di pagina della pagina, che
   altrimenti si sommerebbero a quelli del tema.
2. Circoscrive TUTTO il CSS sotto un id. Senza questo passaggio le regole
   su body, h1, a e section riscriverebbero il tema dell'intero sito.
3. Elimina il tema scuro automatico. Su una pagina WordPress chiara, una
   sezione che diventa nera perche' il visitatore ha il sistema in scuro
   sembra un errore, non una scelta.

Produce i frammenti da incollare e un file di importazione WXR che crea
le due pagine gia' annidate: Tools, e Segreteria Brave sotto Tools.
"""
import io, re, os, html, datetime

QUI   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST  = os.path.join(QUI, 'dist')
SITO  = 'https://www.bravevetbusiness.it'
FONTS = ('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK'
         '@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400'
         '&family=Archivo:wdth,wght@75..125,400;75..125,500;75..125,600;75..125,700'
         '&family=Space+Mono:wght@400;700&display=swap')


# ---------------------------------------------------------------- CSS

def blocchi(css):
    """Spezza il CSS in blocchi di primo livello, contando le graffe."""
    out, buf, prof = [], '', 0
    for ch in css:
        buf += ch
        if ch == '{': prof += 1
        elif ch == '}':
            prof -= 1
            if prof == 0:
                out.append(buf); buf = ''
    if buf.strip(): out.append(buf)
    return out


def dividi_selettori(sel):
    """Divide sulle virgole, ignorando quelle dentro le parentesi."""
    parti, buf, prof = [], '', 0
    for ch in sel:
        if ch == '(': prof += 1
        elif ch == ')': prof -= 1
        if ch == ',' and prof == 0:
            parti.append(buf); buf = ''
        else:
            buf += ch
    parti.append(buf)
    return [p.strip() for p in parti if p.strip()]


def circoscrivi(sel, scope):
    fuori = []
    for p in dividi_selettori(sel):
        if p in (':root', 'html', 'body'):
            fuori.append(scope)
        elif p == '*':
            fuori.append(scope); fuori.append(scope + ' *')
        elif p.startswith(':root'):
            fuori.append(scope + p[len(':root'):])
        elif p.startswith('html') or p.startswith('body'):
            fuori.append(scope + p[4:])
        else:
            fuori.append(scope + ' ' + p)
    return ','.join(fuori)


SCURO = re.compile(r'prefers-color-scheme\s*:\s*dark', re.I)

def trasforma(css, scope):
    fuori = []
    for b in blocchi(css):
        b = b.strip()
        if not b: continue
        testa, _, corpo = b.partition('{')
        testa = testa.strip()

        if testa.startswith('@'):
            nome = testa.split()[0].lower()
            if nome in ('@keyframes', '@-webkit-keyframes', '@font-face', '@import',
                        '@charset', '@page'):
                fuori.append(b)                       # non contengono selettori
                continue
            if nome == '@media' and SCURO.search(testa):
                continue                              # via il tema scuro automatico
            interno = corpo.rsplit('}', 1)[0]
            fuori.append(testa + '{' + trasforma(interno, scope) + '}')
            continue

        if 'data-theme="dark"' in testa or "data-theme='dark'" in testa:
            continue
        if testa in ('html', 'html,body'):
            continue                                  # niente regole sul documento

        fuori.append(circoscrivi(testa, scope) + '{' + corpo)
    return '\n'.join(fuori)


# ---------------------------------------------------------------- pagina

def estrai(percorso):
    s = io.open(percorso, encoding='utf-8').read()
    css  = re.search(r'<style>(.*?)</style>', s, re.S).group(1)
    body = re.search(r'<body>(.*?)</body>',  s, re.S).group(1)
    return css, body


def ripulisci(body):
    body = re.sub(r'<nav\b.*?</nav>',       '', body, flags=re.S)
    body = re.sub(r'<footer\b.*?</footer>', '', body, flags=re.S)
    return body.strip()


CORAZZA = """
/* Corazza contro il tema del sito.
   Il tema colpisce gli elementi per nome (h2, a, p) e una regola
   diretta batte sempre un valore ereditato: senza questo blocco i titoli di
   sezione prenderebbero il colore del tema invece del nostro. Sta PRIMA del
   CSS della pagina, quindi tutte le nostre regole continuano a vincere su
   di esso. Non tocca font-weight ne' sfondi: quelli la pagina se li imposta
   da sola, e sovrascriverli qui sarebbe rischioso senza guadagno. */
{s} h1,{s} h2,{s} h3,{s} h4,{s} h5,{s} h6,{s} p,{s} a,{s} li,{s} dt,{s} dd,
{s} span,{s} small,{s} label,{s} th,{s} td,{s} blockquote,{s} figcaption,
{s} strong,{s} b,{s} em,{s} i,{s} code{{color:inherit;font-family:inherit}}
{s} input,{s} select,{s} textarea,{s} button{{color:inherit;font-family:inherit;font-size:inherit;line-height:inherit}}
{s} h1,{s} h2,{s} h3,{s} h4,{s} h5,{s} h6,{s} p,{s} ul,{s} ol,{s} li,
{s} figure,{s} blockquote{{margin:0;padding:0}}
{s} ul,{s} ol{{list-style:none}}
{s} a{{text-decoration:none}}
"""


def frammento(percorso, scope, titolo):
    css, body = estrai(percorso)
    css  = trasforma(css, '#' + scope)
    body = ripulisci(body)
    return (
        '<!-- {t} · generata da build/build-wordpress.py, non modificare a mano -->\n'
        '<style>\n@import url("{f}");\n'
        '#{s}{{color-scheme:light}}\n'
        '{z}\n'
        '{c}\n</style>\n'
        '<div id="{s}">\n{b}\n</div>\n'
    ).format(t=titolo, f=FONTS, s=scope, c=css, b=body,
             z=CORAZZA.format(s='#' + scope))


# ---------------------------------------------------------------- WXR

def cdata(testo):
    return '<![CDATA[' + testo.replace(']]>', ']]]]><![CDATA[>') + ']]>'


def voce(pid, parent, slug, titolo, contenuto, ordine):
    oggi = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    return '''  <item>
    <title>{tit}</title>
    <link>{sito}/{slug}/</link>
    <pubDate>{rfc}</pubDate>
    <dc:creator>{aut}</dc:creator>
    <guid isPermaLink="false">{sito}/?page_id={pid}</guid>
    <description></description>
    <content:encoded>{cnt}</content:encoded>
    <excerpt:encoded>{vuo}</excerpt:encoded>
    <wp:post_id>{pid}</wp:post_id>
    <wp:post_date>{ora}</wp:post_date>
    <wp:post_date_gmt>{ora}</wp:post_date_gmt>
    <wp:comment_status>closed</wp:comment_status>
    <wp:ping_status>closed</wp:ping_status>
    <wp:post_name>{slug}</wp:post_name>
    <wp:status>draft</wp:status>
    <wp:post_parent>{par}</wp:post_parent>
    <wp:menu_order>{ord}</wp:menu_order>
    <wp:post_type>page</wp:post_type>
    <wp:post_password></wp:post_password>
    <wp:is_sticky>0</wp:is_sticky>
  </item>
'''.format(tit=html.escape(titolo), sito=SITO, slug=slug, pid=pid, par=parent,
           ord=ordine, ora=oggi, rfc=datetime.datetime.now().strftime('%a, %d %b %Y %H:%M:%S +0000'),
           aut=cdata('admin'), cnt=cdata(contenuto), vuo=cdata(''))


def wxr(voci):
    return '''<?xml version="1.0" encoding="UTF-8" ?>
<!-- Importazione pagine Segreteria Brave — Brave Vet Business -->
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
  <title>Brave Vet Business</title>
  <link>{sito}</link>
  <description>Pagine Tools e Segreteria Brave</description>
  <language>it-IT</language>
  <wp:wxr_version>1.2</wp:wxr_version>
  <wp:base_site_url>{sito}</wp:base_site_url>
  <wp:base_blog_url>{sito}</wp:base_blog_url>
  <wp:author><wp:author_id>1</wp:author_id><wp:author_login>{log}</wp:author_login>
    <wp:author_email>{mail}</wp:author_email><wp:author_display_name>{nom}</wp:author_display_name>
    <wp:author_first_name>{vuo}</wp:author_first_name><wp:author_last_name>{vuo}</wp:author_last_name></wp:author>
{voci}</channel>
</rss>
'''.format(sito=SITO, voci=''.join(voci), log=cdata('admin'), mail=cdata(''),
           nom=cdata('Brave Vet Business'), vuo=cdata(''))


# ---------------------------------------------------------------- main

def main():
    os.makedirs(os.path.join(DIST, 'wordpress'), exist_ok=True)
    pagine = [
        (9101, 0,    'tools',            'Tools',            'tools-index.html',      'tools-page',  0),
        (9102, 9101, 'segreteria-brave', 'Segreteria Brave', 'segreteria-brave.html', 'sb-page',     1),
    ]
    voci = []
    for pid, par, slug, titolo, sorgente, scope, ordine in pagine:
        f = frammento(os.path.join(DIST, sorgente), scope, titolo)
        dest = os.path.join(DIST, 'wordpress', slug + '.html')
        io.open(dest, 'w', encoding='utf-8').write(f)
        print('  %-22s %6.1f KB  -> %s' % (titolo, len(f.encode())/1024, os.path.relpath(dest, QUI)))
        voci.append(voce(pid, par, slug, titolo, f, ordine))

    x = os.path.join(DIST, 'wordpress', 'segreteria-brave-pagine.xml')
    io.open(x, 'w', encoding='utf-8').write(wxr(voci))
    print('  %-22s %6.1f KB  -> %s' % ('file di importazione', os.path.getsize(x)/1024,
                                       os.path.relpath(x, QUI)))

if __name__ == '__main__':
    main()
