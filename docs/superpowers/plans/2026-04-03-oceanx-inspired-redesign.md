# OceanX-Inspired Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign hero, agenti e CTA del sito The Invisible Team ispirandosi a OceanX 2025, mantenendo il single-file HTML senza dipendenze esterne.

**Architecture:** Tutte le modifiche avvengono in `index.html` (CSS inline in `<style>`, JS inline in `<script>`, HTML nel `<body>`). Il canvas per le particelle e' un elemento posizionato absolute dentro la hero section. I CTA dot e gli split agenti sono puro CSS+HTML.

**Tech Stack:** HTML, CSS, Canvas 2D vanilla, zero dipendenze esterne.

**Spec:** `docs/superpowers/specs/2026-04-03-oceanx-inspired-redesign-design.md`

---

### Task 1: Add `.btn-dot` CTA styles

**Files:**
- Modify: `index.html` — CSS section (lines ~111-119 for `.nav-cta`, lines ~175-185 for `.btn-hero`)

This task adds the new CTA button styles first since they're used by both the hero and agent sections.

- [ ] **Step 1: Add `.btn-dot` CSS rules after the existing `.btn-hero` styles (around line 185)**

Add this CSS block after the `.btn-hero:active` rule and before the `.social-proof` rule:

```css
/* ── CTA Dot (OceanX-style) ── */
.btn-dot {
    display: inline-flex; align-items: center; gap: 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0.8rem 1.8rem; border-radius: var(--radius-pill);
    font-family: 'SF Mono', 'Courier New', monospace;
    font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--white); background: transparent;
    cursor: pointer; transition: all 0.3s ease;
    text-decoration: none; min-height: 48px;
}
.btn-dot:hover { border-color: rgba(255, 255, 255, 0.4); }
.btn-dot:active { transform: scale(0.97); }
.btn-dot .dot-accent {
    width: 12px; height: 12px; border-radius: 50%;
    background: #f97316; display: inline-block;
    transition: all 0.3s ease;
    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
}
.btn-dot:hover .dot-accent {
    transform: scale(1.3);
    box-shadow: 0 0 12px rgba(249, 115, 22, 0.4);
}
.btn-dot--sm { padding: 0.6rem 1.4rem; font-size: 0.7rem; min-height: 40px; }
.btn-dot--sm .dot-accent { width: 10px; height: 10px; }
.btn-dot--nav { padding: 0.5rem 1.2rem; font-size: 0.7rem; min-height: 44px; }
.btn-dot--nav .dot-accent { width: 8px; height: 8px; }
```

- [ ] **Step 2: Replace nav CTA HTML**

In the `<nav>` section (around line 461), replace:

```html
<a href="#cta" class="nav-cta">Richiedi accesso <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></a>
```

With:

```html
<a href="#cta" class="btn-dot btn-dot--nav">Richiedi accesso <span class="dot-accent" aria-hidden="true"></span></a>
```

- [ ] **Step 3: Replace hero CTA HTML**

In the hero section (around line 472), replace:

```html
<a href="#cta" class="btn-hero">Inizia ora <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9h10M10 5l4 4-4 4"/></svg></a>
```

With:

```html
<a href="#cta" class="btn-dot">Inizia ora <span class="dot-accent" aria-hidden="true"></span></a>
```

- [ ] **Step 4: Remove old `.btn-hero` and `.nav-cta` CSS**

Remove the following CSS rules that are no longer used:

- `.nav-cta` block (lines ~111-118)
- `.nav-cta:hover` rule
- `.nav-cta svg` rule
- `.btn-hero` block (lines ~175-184)
- `.btn-hero:hover` rule
- `.btn-hero:active` rule
- `.btn-hero svg` rule

- [ ] **Step 5: Verify in browser**

Open `index.html` in a browser. Check:
- Nav button shows "Richiedi accesso" with orange dot, monospace uppercase text
- Hero button shows "INIZIA ORA" with orange dot
- Hover on both: dot expands with glow, border brightens
- Both buttons are clickable and link to `#cta`

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add OceanX-style dot CTA buttons replacing pill buttons"
```

---

### Task 2: Redesign hero with particle sphere

**Files:**
- Modify: `index.html` — CSS hero section (lines ~121-161), HTML hero section (lines ~467-478), JS section (lines ~654+)

- [ ] **Step 1: Add canvas element to hero HTML**

Inside the `<section class="hero">`, add a canvas element as the first child (before `.hero-badge`):

```html
<section class="hero" aria-labelledby="hero-heading">
    <canvas id="hero-particles" aria-hidden="true"></canvas>
    <div class="hero-badge"><span class="dot" aria-hidden="true"></span> Intelligenza artificiale per cliniche veterinarie</div>
```

- [ ] **Step 2: Update hero CSS**

Replace the existing `.hero::before` rule with canvas styling. Find and replace:

```css
.hero::before {
    content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 100%; height: 80%;
    background: radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.12) 0%, transparent 60%);
    pointer-events: none;
}
```

With:

```css
#hero-particles {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
}
.hero::before {
    content: ''; position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 500px; height: 500px;
    background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.12) 0%, rgba(124, 58, 237, 0.06) 40%, transparent 70%);
    pointer-events: none; z-index: 0;
}
```

- [ ] **Step 3: Increase hero title size**

Replace the existing `.hero h1` font-size:

```css
font-size: clamp(2.8rem, 6vw, 4.5rem);
```

With:

```css
font-size: clamp(3rem, 7vw, 5rem);
```

- [ ] **Step 4: Ensure hero content sits above canvas**

Add `position: relative; z-index: 1;` to `.hero-badge`, `.hero h1`, `.hero-sub`, `.hero-actions`. Find the `.hero-badge` rule and add:

```css
.hero-badge {
    /* ...existing styles... */
    position: relative; z-index: 1;
}
```

Do the same for `.hero h1`, `.hero-sub`, `.hero-actions` — add `position: relative; z-index: 1;` to each.

- [ ] **Step 5: Add particle sphere JavaScript**

At the end of the `<script>` block (before the closing `</script>` tag), add the particle sphere animation:

```javascript
// ── Particle Sphere ──
(function() {
    var canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 80;
    var rotationY = 0;
    var ROTATION_SPEED = 0.002;
    var colors = ['#3b82f6', '#60a5fa', '#7c3aed', '#22d3ee'];
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
        canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
        canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }

    function createParticles() {
        particles = [];
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                theta: Math.random() * Math.PI * 2,
                phi: Math.acos((Math.random() * 2) - 1),
                size: 2 + Math.random() * 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: 0.3 + Math.random() * 0.7
            });
        }
    }

    function getSphereRadius() {
        var w = canvas.offsetWidth;
        var h = canvas.offsetHeight;
        return Math.min(w, h) * 0.25;
    }

    function draw() {
        var w = canvas.offsetWidth;
        var h = canvas.offsetHeight;
        ctx.clearRect(0, 0, w, h);

        var cx = w / 2;
        var cy = h / 2;
        var radius = getSphereRadius();
        var fov = 600;

        var sorted = particles.slice().sort(function(a, b) {
            var az = Math.cos(a.phi) * Math.cos(a.theta + rotationY);
            var bz = Math.cos(b.phi) * Math.cos(b.theta + rotationY);
            return az - bz;
        });

        for (var i = 0; i < sorted.length; i++) {
            var p = sorted[i];
            var x3d = radius * Math.sin(p.phi) * Math.cos(p.theta + rotationY);
            var y3d = radius * Math.cos(p.phi);
            var z3d = radius * Math.sin(p.phi) * Math.sin(p.theta + rotationY);

            var scale = fov / (fov + z3d);
            var x2d = cx + x3d * scale;
            var y2d = cy + y3d * scale;

            var depthAlpha = 0.2 + 0.8 * ((z3d + radius) / (2 * radius));
            var drawSize = p.size * scale;

            ctx.beginPath();
            ctx.arc(x2d, y2d, drawSize, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = depthAlpha;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = drawSize * 3;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
    }

    function animate() {
        if (!reducedMotion) {
            rotationY += ROTATION_SPEED;
        }
        draw();
        requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', function() {
        resize();
    });
})();
```

- [ ] **Step 6: Verify in browser**

Open `index.html`. Check:
- Particle sphere renders centered in the hero, ~80 glowing dots orbiting slowly
- Particles behind the sphere appear smaller/dimmer (3D depth)
- Text is fully readable on top of the sphere
- On window resize, sphere scales proportionally
- CTA dot button is visible below the title

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: add particle sphere hero animation with canvas 2D"
```

---

### Task 3: Redesign agents section with split layout

**Files:**
- Modify: `index.html` — CSS agent styles (lines ~215-256), HTML agents section (lines ~484-534)

- [ ] **Step 1: Add split agent CSS**

Replace all existing `.agents-grid` and `.agent-card` styles (from `.agents-grid` through `.agent-card ul li svg`) with:

```css
/* ── Agent splits ── */
.agent-splits { display: flex; flex-direction: column; }
.agent-split {
    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;
    align-items: center; padding: 4rem 0;
    border-bottom: 1px solid var(--border);
}
.agent-split:last-child { border-bottom: none; }
.agent-split:nth-child(even) .agent-visual { order: 2; }
.agent-split:nth-child(even) .agent-content { order: 1; }

.agent-visual {
    border-radius: var(--radius); overflow: hidden;
    background: var(--bg-card); border: 1px solid var(--border);
    min-height: 300px; display: flex; align-items: center; justify-content: center;
}
.agent-visual img { width: 100%; height: auto; display: block; }
.agent-visual-placeholder {
    text-align: center; padding: 2rem; color: var(--gray-500);
}
.agent-visual-placeholder svg {
    width: 64px; height: 64px; stroke: var(--blue-light); stroke-width: 1;
    fill: none; stroke-linecap: round; stroke-linejoin: round;
    margin-bottom: 1rem; opacity: 0.4;
}
.agent-visual-placeholder span {
    display: block; font-size: 0.7rem; letter-spacing: 0.1em;
    text-transform: uppercase;
}

.agent-label {
    font-family: 'SF Mono', 'Courier New', monospace;
    font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--blue-light); display: block; margin-bottom: 0.8rem;
}
.agent-content h3 { font-size: 1.6rem; font-weight: 700; margin-bottom: 0.3rem; letter-spacing: -0.01em; }
.agent-content .agent-subtitle {
    font-size: 0.7rem; font-weight: 500; color: var(--blue-light);
    text-transform: uppercase; letter-spacing: 0.1em;
    display: block; margin-bottom: 1.2rem;
}
.agent-content p { font-size: 0.9rem; color: var(--gray-400); line-height: 1.7; margin-bottom: 1.5rem; }
.agent-content ul { list-style: none; margin-bottom: 1.5rem; }
.agent-content ul li {
    font-size: 0.85rem; color: var(--gray-300); padding: 0.45rem 0;
    display: flex; align-items: center; gap: 0.6rem;
}
.agent-content ul li svg {
    width: 16px; height: 16px; stroke: var(--blue); stroke-width: 2;
    fill: none; flex-shrink: 0;
}

@media (max-width: 900px) {
    .agent-split { grid-template-columns: 1fr; gap: 2rem; }
    .agent-split:nth-child(even) .agent-visual { order: 0; }
    .agent-split:nth-child(even) .agent-content { order: 0; }
}
```

- [ ] **Step 2: Replace agents HTML**

Replace the entire `<div class="agents-grid">...</div>` block (from the opening `<div class="agents-grid">` to its closing `</div>` that contains all 3 agent cards) with:

```html
<div class="agent-splits">
    <article class="agent-split reveal">
        <div class="agent-visual">
            <div class="agent-visual-placeholder">
                <svg viewBox="0 0 24 24"><path d="M21 21H4.6c-.6 0-.9 0-1.1-.1a1 1 0 0 1-.4-.4C3 20.3 3 20 3 19.4V3"/><path d="m7 14 4-4 4 4 6-6"/></svg>
                <span>Dashboard Controller</span>
            </div>
        </div>
        <div class="agent-content">
            <span class="agent-label">Agente 01</span>
            <h3>Il Controller</h3>
            <span class="agent-subtitle">Controller Finanziario</span>
            <p>Ogni settimana analizza i principali centri di ricavo della tua clinica e ti consegna un report strutturato, chiaro e azionabile.</p>
            <ul>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Analisi settimanale dei centri di ricavo</li>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Report strutturato con trend e variazioni</li>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Identificazione servizi piu e meno redditizi</li>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Confronto performance settimana su settimana</li>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Segnalazione anomalie e opportunita di margine</li>
            </ul>
            <a href="#cta" class="btn-dot btn-dot--sm">Scopri di piu <span class="dot-accent" aria-hidden="true"></span></a>
        </div>
    </article>

    <article class="agent-split reveal">
        <div class="agent-visual">
            <div class="agent-visual-placeholder">
                <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>Dashboard Direttore</span>
            </div>
        </div>
        <div class="agent-content">
            <span class="agent-label">Agente 02</span>
            <h3>Il Direttore</h3>
            <span class="agent-subtitle">Risorse Umane</span>
            <p>Analizza le performance di vendita dei servizi di ogni singolo veterinario, trasformando i dati di attivita in insight concreti sul team.</p>
            <ul>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Performance di vendita servizi per veterinario</li>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Ranking settimanale delle attivita svolte</li>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Analisi produttivita individuale e di team</li>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Trend di performance nel tempo</li>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Suggerimenti per bilanciare i carichi di lavoro</li>
            </ul>
            <a href="#cta" class="btn-dot btn-dot--sm">Scopri di piu <span class="dot-accent" aria-hidden="true"></span></a>
        </div>
    </article>

    <article class="agent-split reveal">
        <div class="agent-visual">
            <div class="agent-visual-placeholder">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                <span>Dashboard Analista</span>
            </div>
        </div>
        <div class="agent-content">
            <span class="agent-label">Agente 03</span>
            <h3>L'Analista</h3>
            <span class="agent-subtitle">Marketing & Segmentazione</span>
            <p>Ogni settimana analizza le tipologie di clienti serviti, li segmenta in categorie e ti mostra come evolve la composizione della tua clientela.</p>
            <ul>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Mappatura settimanale delle tipologie di clienti</li>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Segmentazione automatica in cluster comportamentali</li>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Analisi evoluzione dei segmenti nel tempo</li>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Identificazione segmenti ad alto valore</li>
                <li><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Insight per campagne mirate per segmento</li>
            </ul>
            <a href="#cta" class="btn-dot btn-dot--sm">Scopri di piu <span class="dot-accent" aria-hidden="true"></span></a>
        </div>
    </article>
</div>
```

- [ ] **Step 3: Verify in browser**

Open `index.html`. Check:
- Agent 1: visual left, text right
- Agent 2: text left, visual right (alternated)
- Agent 3: visual left, text right
- Each agent has monospace label, title, subtitle, description, bullet list, and dot CTA
- On mobile (< 900px): single column, visual always on top
- Placeholder visuals show icon + label text

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: redesign agents section with alternating split layout"
```

---

### Task 4: Clean up unused CSS and final polish

**Files:**
- Modify: `index.html` — CSS section

- [ ] **Step 1: Remove orphaned CSS rules**

Remove any CSS rules that were part of the old agent card system and are no longer referenced in HTML:
- `.agent-card` and all sub-selectors (`.agent-card:hover`, `.agent-card::after`, `.agent-card:hover::after`)
- `.agent-card-icon` and sub-selectors
- `.agent-card-badge`
- `.agent-card h3`
- `.agent-card-subtitle`
- `.agent-card p`
- `.agent-card ul`, `.agent-card ul li`, `.agent-card ul li svg`
- `.agents-grid`

Also remove old CTA rules if not already removed in Task 1:
- `.btn-hero`, `.btn-hero:hover`, `.btn-hero:active`, `.btn-hero svg`
- `.nav-cta`, `.nav-cta:hover`, `.nav-cta svg`

- [ ] **Step 2: Update responsive rule for agents**

In the `@media (max-width: 900px)` block, replace:

```css
.agents-grid { grid-template-columns: 1fr; max-width: 500px; margin: 0 auto; }
```

With:

```css
.agent-split { grid-template-columns: 1fr; gap: 2rem; }
.agent-split:nth-child(even) .agent-visual { order: 0; }
.agent-split:nth-child(even) .agent-content { order: 0; }
```

(If these rules were already added inline in Task 3, remove the duplicate.)

- [ ] **Step 3: Verify full page in browser**

Open `index.html`. Do a full scroll-through:
1. Nav: dot CTA works
2. Hero: particles animate, title is larger, dot CTA works
3. Logo strip: unchanged
4. Agents: split layout alternates correctly
5. How it works: unchanged
6. Features: unchanged
7. Dashboard mockup: unchanged
8. Stats: unchanged
9. Testimonial: unchanged
10. FAQ: unchanged, accordion works
11. CTA form: unchanged, form submits
12. Footer: unchanged

Check mobile (resize to < 600px): all sections stack correctly.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "chore: remove orphaned CSS from old agent cards and CTA buttons"
```
