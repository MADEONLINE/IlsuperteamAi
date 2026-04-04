# The Invisible Team — OceanX-Inspired Redesign

**Date:** 2026-04-03
**Status:** Draft
**Reference:** 2025.oceanx.org (OceanX 2025 Annual Review)

## Overview

Redesign di 3 sezioni chiave del sito The Invisible Team (single-page, `index.html`) ispirato agli elementi premium del sito OceanX 2025. Il sito resta un single-file HTML. Nessuna libreria esterna aggiunta (no Three.js, no GSAP). Solo CSS + Canvas 2D vanilla.

## Scope

Le modifiche riguardano esclusivamente:

1. **Hero section** — nuova sfera di particelle canvas + testo oversize
2. **Sezione Agenti AI** — da griglia 3-colonne a split alternato
3. **Bottoni CTA** — nuovo stile con dot arancione animato

Tutto il resto del sito (nav, how-it-works, features, dashboard mockup, stats, testimonial, FAQ, footer) resta invariato.

---

## 1. Hero — Sfera di particelle

### Cosa cambia

L'hero attuale ha un gradiente radiale statico come sfondo e testo centrato. Viene sostituito da una sfera di particelle animata su canvas 2D che occupa il centro del viewport, con testo oversize sovrapposto.

### Specifiche tecniche

- **Canvas**: elemento `<canvas>` posizionato `absolute` dietro il contenuto hero, copre l'intero viewport
- **Particelle**: ~80 punti che orbitano su una sfera invisibile (raggio ~150px al centro del canvas)
  - Ogni particella ha: posizione 3D (theta, phi su sfera), dimensione (2-5px), colore (dal palette brand: `#3b82f6`, `#60a5fa`, `#7c3aed`, `#22d3ee`), opacita' variabile
  - Rotazione lenta della sfera sull'asse Y (~0.002 rad/frame)
  - Proiezione 3D→2D semplice (prospettiva) per dare profondita': particelle "dietro" la sfera sono piu' piccole e opache
  - Glow: ogni particella ha `shadowBlur` proporzionale alla dimensione
- **Glow di sfondo**: gradiente radiale CSS sotto il canvas, centrato, colori `rgba(59,130,246,0.12)` → `transparent`
- **Performance**: `requestAnimationFrame`, rispetta `prefers-reduced-motion` (particelle ferme, solo glow statico)
- **Responsive**: raggio sfera scala con `min(vw, vh) * 0.25`

### Testo hero

- Badge: invariato (pill con dot pulsante)
- Titolo: `font-size: clamp(3rem, 7vw, 5rem)` — piu' grande dell'attuale
- Sottotitolo: invariato
- CTA: sostituito con nuovo stile dot arancione (vedi sezione 3)
- Social proof: resta sotto il CTA

### Rimozioni

- Il `::before` pseudo-element con gradiente radiale viene rimosso (sostituito dal canvas + glow CSS)

---

## 2. Sezione Agenti — Split alternato

### Cosa cambia

Le 3 card in griglia `grid-template-columns: repeat(3, 1fr)` vengono sostituite da 3 righe full-width con layout split (50/50) che alterna il lato del visual.

### Layout

```
Agente 01: [VISUAL]  [TESTO]
Agente 02: [TESTO]   [VISUAL]
Agente 03: [VISUAL]  [TESTO]
```

### Struttura HTML per ogni agente

```html
<article class="agent-split">
  <div class="agent-visual">
    <!-- Placeholder: immagine o mockup CSS dashboard -->
    <img src="images/agent-controller.png" alt="..." loading="lazy" />
  </div>
  <div class="agent-content">
    <span class="agent-label">AGENTE 01</span>
    <h3>Il Controller</h3>
    <span class="agent-subtitle">Controller Finanziario</span>
    <p>Descrizione...</p>
    <ul>...</ul>
    <a href="#cta" class="btn-dot">SCOPRI DI PIU' <span class="dot-accent"></span></a>
  </div>
</article>
```

### Specifiche CSS

- `.agent-split`: `display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; padding: 4rem 0; border-bottom: 1px solid var(--border);`
- `.agent-split:nth-child(even) .agent-visual`: `order: 2;` — sposta il visual a destra per alternare i lati (evita `direction: rtl` che rompe l'allineamento testo)
- `.agent-visual`: contenitore con `border-radius: var(--radius); overflow: hidden;` — accoglie immagini o mockup CSS
- `.agent-visual img`: `width: 100%; height: auto; display: block;`
- `.agent-label`: `font-family: 'SF Mono', 'Courier New', monospace; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--blue-light);`
- **Mobile** (`max-width: 900px`): `grid-template-columns: 1fr;` — visual sopra, testo sotto, sempre nello stesso ordine

### Visual placeholder

Finche' l'utente non fornisce le immagini, ogni `.agent-visual` contiene un mockup CSS stilizzato (sfondo `var(--bg-card)` con icona grande e label). Le immagini verranno create separatamente dall'utente.

### Rimozioni

- `.agents-grid` (griglia 3 colonne)
- `.agent-card` e tutti i suoi sotto-stili (`.agent-card-icon`, `.agent-card-badge`, `.agent-card::after`, ecc.)

---

## 3. Bottoni CTA — Dot accent arancione

### Cosa cambia

Tutti i CTA principali del sito passano dal bottone pill blu pieno a un bottone con bordo sottile, testo monospace uppercase e dot arancione animato.

### Varianti

| Variante | Uso | Padding | Font size | Dot size |
|----------|-----|---------|-----------|----------|
| Primary | Hero, CTA finale | `0.8rem 1.8rem` | `0.8rem` | 12px |
| Secondary | Sezione agenti | `0.6rem 1.4rem` | `0.7rem` | 10px |
| Nav | Navbar | `0.5rem 1.2rem` | `0.7rem` | 8px |

### Specifiche CSS

```css
.btn-dot {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.8rem 1.8rem;
  border-radius: var(--radius-pill);
  font-family: 'SF Mono', 'Courier New', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--white);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-dot .dot-accent {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #f97316;
  display: inline-block;
  transition: all 0.3s ease;
  box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
}

.btn-dot:hover {
  border-color: rgba(255, 255, 255, 0.4);
}

.btn-dot:hover .dot-accent {
  transform: scale(1.3);
  box-shadow: 0 0 12px rgba(249, 115, 22, 0.4);
}
```

### Elementi che cambiano CTA

- **Hero**: `.btn-hero` → `.btn-dot` primary
- **Nav**: `.nav-cta` → `.btn-dot.btn-dot--nav` (variante nav)
- **Agenti**: nuovo `.btn-dot.btn-dot--sm` (variante secondary) per ogni split
- **CTA finale**: il form con input+button resta invariato (non usa il dot style, e' un form di raccolta email)

### Colore dot

Arancione `#f97316` — scelto per contrasto con il palette blu/viola del sito. Coerente con OceanX.

---

## Fuori scope

- Sezioni how-it-works, features, dashboard mockup, stats, testimonial, FAQ, footer: nessuna modifica
- Logo strip: nessuna modifica (miglioramento opzionale futuro)
- Navigazione sidebar/chapters stile OceanX: non inclusa (il sito non e' abbastanza lungo da giustificarla)
- Scroll orizzontale: non incluso
- Immagini degli agenti: create separatamente dall'utente, la spec definisce solo il contenitore

---

## Compatibilita'

- Nessuna dipendenza aggiunta (no librerie JS/CSS esterne)
- Canvas 2D supportato da tutti i browser moderni
- `prefers-reduced-motion` rispettato per la sfera di particelle
- Mobile: la sfera si ridimensiona, gli split diventano singola colonna
- Il sito resta un singolo file `index.html`
