#!/usr/bin/env python3
"""Vet Evidence — Lunedì Mattina · Reel 01. Montaggio del master 1080x1920 dalla registrazione Zoom del 10/09/2026."""
import glob, os, subprocess, sys, shlex
IN = glob.glob("zoom/*/shared_screen_with_speaker_view.mp4")[0]
OUT = "out"; SEG = f"{OUT}/seg"; os.makedirs(SEG, exist_ok=True)
W,H,FPS = 1080,1920,30
INK="0x1A1A1A"; BLUE="0x2B7BE4"
MONO="/root/.fonts/PlexMono-1.ttf"
ENC = "-c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30 -c:a aac -b:a 128k -ar 48000 -ac 2"
AF  = "aresample=48000,loudnorm=I=-16:TP=-1.5:LRA=11"

def run(cmd):
    print("→", cmd if len(cmd)<160 else cmd[:157]+"...", flush=True)
    r = subprocess.run(cmd, shell=True); 
    if r.returncode: sys.exit(f"ffmpeg fallito: {cmd}")

def face(fx): return f"crop=w=ih*9/16:h=ih:x=(iw-ih*9/16)*{fx}:y=0,scale={W}:{H}:flags=lanczos,fps={FPS}"

def panel(cx,cy,cw,ch,label,zoom_dur=None,switch=None):
    """Crop del pannello attivo, cornice blu, fondo inchiostro sopra e sotto, etichette mono."""
    ph = round(ch*1068/cw); ph -= ph%2
    top = (H-(ph+12))//2
    vf = [f"crop={cw}:{ch}:{cx}:{cy}"]
    if zoom_dur:  # zoom lento 100→112% sulla griglia
        vf += [f"scale=w='{cw}*(1+0.12*min(t,{zoom_dur})/{zoom_dur})':h='{ch}*(1+0.12*min(t,{zoom_dur})/{zoom_dur})':eval=frame:flags=bicubic",
               f"crop={cw}:{ch}:(iw-{cw})/2:(ih-{ch})/2"]
    vf += [f"scale=1068:{ph}:flags=lanczos", f"pad={W}:{ph+12}:6:6:color={BLUE}",
           f"pad={W}:{H}:0:{top-6}:color={INK}",
           f"drawtext=fontfile={MONO}:text='LO SCHERMO · LILIANE':fontsize=26:fontcolor=0xA9B0B8:x=96:y={top-62}",
           (f"drawtext=fontfile={MONO}:text='{label}':fontsize=26:fontcolor={BLUE}:x=w-96-tw:y={top-62}" if not switch else
            f"drawtext=fontfile={MONO}:text='{switch[0]}':fontsize=26:fontcolor={BLUE}:x=w-96-tw:y={top-62}:enable='lt(t,{switch[2]})',"
            f"drawtext=fontfile={MONO}:text='{switch[1]}':fontsize=26:fontcolor={BLUE}:x=w-96-tw:y={top-62}:enable='gte(t,{switch[2]})'"),
           f"fps={FPS}"]
    return ",".join(vf), top, ph+12

# ---- segmenti: (nome, in, durata, vf)
AGENDA = dict(cx=440,cy=205,cw=2058,ch=1267)
FLOW   = dict(cx=65, cy=222,cw=1938,ch=1250)
vf_ag, ag_top, ag_h = panel(**AGENDA, label="AGENDA", zoom_dur=9.2)
vf_fl, fl_top, fl_h = panel(**FLOW,   label="FLOWBOARD", switch=("AGENDA","FLOWBOARD",4.5))   # il cambio pagina è a 04:31.2
vf_fz, _, _         = panel(**FLOW,   label="FLOWBOARD")   # freeze finale, etichetta fissa
segs = [
  ("01-marta-domanda",      "00:02:19.80", 8.82, face(0.58)),
  ("02a-liliane-due",       "00:02:41.33", 3.09, face(0.665)),
  ("02b-liliane-agenda",    "00:02:48.68", 2.37, face(0.665)),
  ("02c-liliane-collegati", "00:02:51.52", 3.08, face(0.665)),
  ("03-agenda",             "00:03:35.25", 9.20, vf_ag),
  ("04-flowboard",          "00:04:26.74", 9.01, vf_fl),
]
for name,tin,dur,vf in segs:
    run(f"ffmpeg -y -loglevel error -ss {tin} -t {dur} -i {shlex.quote(IN)} -vf \"{vf}\" -af \"{AF}\" {ENC} {SEG}/{name}.mp4")

# ---- 00 intro (2s, muto) e 06 endframe (4.08s, muto): fondi pieni dalle card
def card(png, dur, dest):
    run(f"ffmpeg -y -loglevel error -loop 1 -framerate {FPS} -i {png} -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 -t {dur} {ENC} {dest}")
card("cards/00-intro.png", 2.00, f"{SEG}/00-intro.mp4")
# (endframe più sotto: la sua durata chiude il master a 48.00)

# ---- 05 esito: freeze sull'ultimo fotogramma della flowboard + voce di Marta; il 2 entra sulla parola «due»
run(f"ffmpeg -y -loglevel error -ss 00:04:35.72 -i {shlex.quote(IN)} -frames:v 1 -vf \"{vf_fz}\" {SEG}/freeze-flowboard.png")
DUE = 2.25   # 05:07.30 − 05:05.05
run(f"ffmpeg -y -loglevel error -loop 1 -framerate {FPS} -i {SEG}/freeze-flowboard.png -loop 1 -framerate {FPS} -i cards/05-esito-overlay.png "
    f"-ss 00:05:05.05 -t 6.35 -i {shlex.quote(IN)} "
    f"-filter_complex \"[0][1]overlay=enable='gte(t,{DUE})':format=auto,fps={FPS}[v]\" -map \"[v]\" -map 2:a -af \"{AF}\" -t 6.35 {ENC} {SEG}/05-esito.mp4")

# ---- endframe: quanto resta fino a 48.00
def dur(p): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())
rest = sum(dur(f"{SEG}/{n}.mp4") for n in ["00-intro","01-marta-domanda","02a-liliane-due","02b-liliane-agenda","02c-liliane-collegati","03-agenda","04-flowboard","05-esito"])
END = round(48.0 - rest, 3); print(f"endframe = {END}s (resto {rest:.3f}s)")
card("cards/06-endframe.png", END, f"{SEG}/06-endframe.mp4")

# ---- concatenazione
order = ["00-intro","01-marta-domanda","02a-liliane-due","02b-liliane-agenda","02c-liliane-collegati","03-agenda","04-flowboard","05-esito","06-endframe"]
with open(f"{SEG}/lista.txt","w") as f:
    for n in order: f.write(f"file '{n}.mp4'\n")
run(f"ffmpeg -y -loglevel error -f concat -safe 0 -i {SEG}/lista.txt -c copy {OUT}/reel-01-senza-sottotitoli.mp4")

# ---- sottotitoli: ASS in pixel reali 1080x1920, Figtree, safe zone 320 px
cues = [
 (2.00, 4.90,"La prima cosa che faccio la mattina"),
 (4.90, 7.00,"è aprire il gestionale"),
 (7.00, 8.80,"e capire qual è la giornata:"),
 (8.80,10.82,"agende, ricoveri, e cosa devo fare."),
 (10.82,13.91,"Ci sono due schermate dedicate:"),
 (13.91,16.28,"l'agenda e la flowboard."),
 (16.28,19.36,"Due utilizzi diversi, ma sempre collegati."),
 (19.36,21.20,"Mi trovo sull'agenda,"),
 (21.20,24.63,"la prima schermata su cui mi ritrovo ogni volta."),
 (25.30,28.56,"Qui gli appuntamenti previsti per la giornata."),
 (28.56,31.30,"Mi sposto sulla flowboard,"),
 (31.30,33.60,"la funzionalità di Snoots"),
 (33.60,37.57,"che gestisce il flusso di lavoro in clinica."),
 (37.57,41.20,"Quindi mi basta aprire due schermate"),
 (41.20,43.92,"e avere subito tutto sotto controllo."),
]
def ts(s): h=int(s//3600); m=int(s%3600//60); return f"{h}:{m:02d}:{s%60:05.2f}"
ass = ["[Script Info]","ScriptType: v4.00+",f"PlayResX: {W}",f"PlayResY: {H}","WrapStyle: 0","ScaledBorderAndShadow: yes","",
 "[V4+ Styles]","Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
 "Style: Sub,Figtree SemiBold,58,&H00F4F7F8,&H00F4F7F8,&H73000000,&H73000000,0,0,0,0,100,100,0,0,4,14,0,2,90,90,340,1","",
 "[Events]","Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
for a,b,t in cues: ass.append(f"Dialogue: 0,{ts(a)},{ts(b)},Sub,,0,0,0,,{t}")
open(f"{OUT}/reel-01-sottotitoli.ass","w").write("\n".join(ass)+"\n")
with open(f"{OUT}/reel-01-sottotitoli.srt","w") as f:
    for i,(a,b,t) in enumerate(cues,1):
        srt=lambda s: f"{int(s//3600):02d}:{int(s%3600//60):02d}:{int(s%60):02d},{int(round((s%1)*1000)):03d}"
        f.write(f"{i}\n{srt(a)} --> {srt(b)}\n{t}\n\n")
run(f"ffmpeg -y -loglevel error -i {OUT}/reel-01-senza-sottotitoli.mp4 -vf \"ass={OUT}/reel-01-sottotitoli.ass\" -t 48 -c:a copy -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30 {OUT}/reel-01-lunedi-mattina.mp4")

# ---- fotogrammi di controllo, uno per segmento
frames = [("00-intro",1.0),("01-marta-domanda",6.4),("02-liliane-due-schermate",15.0),("03-agenda",26.5),("04-flowboard",33.0),("05-esito",41.5),("06-endframe",46.0)]
os.makedirs(f"{OUT}/controllo", exist_ok=True)
for n,t in frames:
    run(f"ffmpeg -y -loglevel error -ss {t} -i {OUT}/reel-01-lunedi-mattina.mp4 -frames:v 1 -q:v 2 {OUT}/controllo/{n}.jpg")
print("FATTO")
