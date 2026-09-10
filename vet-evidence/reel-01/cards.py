from PIL import Image, ImageDraw, ImageFont
W,H=1080,1920
INK=(26,26,26); CARTA=(248,247,244); ACQUA=(118,182,181); GREY=(169,176,184)
F={"mono":"/root/.fonts/PlexMono-1.ttf","display":"/root/.fonts/Manrope-2.ttf","bold":"/root/.fonts/Manrope-1.ttf","body":"/root/.fonts/Figtree-2.ttf","tri":"/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"}
def font(k,s): return ImageFont.truetype(F[k],s)
def spaced(d,xy,text,fnt,fill,spacing):
    x,y=xy
    for ch in text:
        d.text((x,y),ch,font=fnt,fill=fill)
        x+=d.textlength(ch,font=fnt)+spacing
    return x
def spaced_width(d,text,fnt,spacing):
    return sum(d.textlength(ch,font=fnt)+spacing for ch in text)-spacing
def lines(d,xy,ls,fnt,fill,lh):
    x,y=xy
    for l in ls:
        d.text((x,y),l,font=fnt,fill=fill); y+=lh
    return y
def sigla(d,y,text="LUNEDÌ MATTINA · 01"):
    spaced(d,(96,y),text,font("mono",30),GREY,6)
def firma(d,y):
    fm=font("mono",26); sp=4
    a="VET EVIDENCE "; b=" BVB × SNOOTS"
    x=spaced(d,(96,y),a,fm,GREY,sp)
    # marcatore: triangolo verde acqua
    tri=font("tri",26); d.text((x,y-2),"▲",font=tri,fill=ACQUA); x+=d.textlength("▲",font=tri)+sp
    spaced(d,(x,y),b,fm,GREY,sp)
def big2(d,top=640,size=380):
    fd=font("display",size); d.text((90,top),"2",font=fd,fill=ACQUA)
    bb=d.textbbox((90,top),"2",font=fd)
    d.text((96,bb[3]+22),"schermate, tutto sotto controllo",font=font("bold",42),fill=CARTA)
    return bb

# ---- intro 0:00–0:02
im=Image.new("RGB",(W,H),INK); d=ImageDraw.Draw(im)
sigla(d,300)
fd=font("display",100); lh=106
ls=["Apro il gestionale:","come capisco","qual è la giornata?"]
y0=(H-lh*len(ls))//2-40
lines(d,(96,y0),ls,fd,CARTA,lh)
d.text((96,y0+lh*len(ls)+36),"Marta · front office manager",font=font("body",36),fill=GREY)
im.save("cards/00-intro.png")

# ---- esito overlay 0:37–0:43 (RGBA: velo inchiostro + numero)
ov=Image.new("RGBA",(W,H),(26,26,26,184)); d=ImageDraw.Draw(ov)
big2(d)
ov.save("cards/05-esito-overlay.png")

# ---- endframe 0:43–0:48
im=Image.new("RGB",(W,H),INK); d=ImageDraw.Draw(im)
sigla(d,300)
lines(d,(96,400),["Il lunedì comincia","da due schermate."],font("display",76),CARTA,84)
bb=big2(d)
# CTA box
bx,by,bw,bh=96,1270,888,124
d.rectangle([bx,by,bx+bw,by+bh],outline=ACQUA,width=3)
fb=font("bold",40); t="È adatto alla tua clinica? 30 minuti →"
tw=d.textlength(t,font=fb); d.text((bx+(bw-tw)/2,by+(bh-40)/2-6),t,font=fb,fill=CARTA)
firma(d,1500)
im.save("cards/06-endframe.png")
print("ok")
