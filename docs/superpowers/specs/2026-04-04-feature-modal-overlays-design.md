# Feature Modal Overlays — Design Spec

## Overview

Each of the 6 feature cards in the "Dare impulso al futuro della tua clinica" section becomes clickable. On click, the card morphs into a full-screen modal overlay containing a mini-dashboard that shows the depth of what the AI agent actually does for that feature. The goal is to make the veterinarian immediately understand the value — not through text, but through a realistic visual preview of the data they would receive.

## Context

- Single-file landing page (`index.html`) — all HTML/CSS/JS inline
- Dark theme with blue/violet accent palette
- Same data context as the main dashboard mockup: clinic ~€24k/week, 4-5 vets, services like surgery, internal medicine, diagnostics, vaccinations, dermatology

## Interaction Design

### Trigger
- Click on any `.feature-item` card
- Each card has a `data-feature` attribute identifying which modal to open (e.g., `data-feature="centri-ricavo"`)
- Cursor changes to `pointer` on feature cards to signal clickability

### Morph Animation (Open — ~500ms total)
1. **Capture** — JS reads `getBoundingClientRect()` of clicked card
2. **Clone & Expand** — A `div.feature-modal` is positioned exactly over the card (same position, size, border-radius). Via CSS transition it expands to center screen (~90vw × 85vh, max 1100px wide), border-radius reduces from 20px to 16px
3. **Content Reveal** — Once expanded, inner content fades in (opacity 0→1, 200ms delay)

### Close Animation (Reverse — ~400ms)
1. Content fades out (100ms)
2. Modal shrinks back to original card position
3. Modal disappears

### Backdrop
- `div.feature-modal-backdrop` — `rgba(0,0,0,0.7)` with `backdrop-filter: blur(8px)`
- Click on backdrop closes modal
- Fade in/out 300ms

### Scroll Lock
- `body` gets `overflow: hidden` when modal is open
- Restored on close

### Close Button
- X button top-right inside modal
- ESC key also closes

## Modal Layout (shared template)

```
┌──────────────────────────────────────────────────┐
│ [icon] Title                              [X]    │
│ Subtitle — what the agent does                   │
├──────────────────────────────────────────────────┤
│ [Stat 1]  [Stat 2]  [Stat 3]  [Stat 4]          │
├───────────────────────────┬──────────────────────┤
│                           │                      │
│   Main visualization      │   Side panel         │
│   (chart/graph/feed)      │   (ranking/list/     │
│                           │    breakdown)         │
│                           │                      │
├───────────────────────────┴──────────────────────┤
│ 💡 Agent Insight: "Natural language summary..."  │
│                           [Attiva questo agente] │
└──────────────────────────────────────────────────┘
```

### Header
- Feature icon (same as card, same color)
- Title (e.g., "Centri di Ricavo")
- Subtitle explaining what the agent does in one line
- X close button

### Stats Row
- 3-4 stat cards with KPI, big number, and % variation badge

### Main Area (grid: 1.6fr 1fr)
- Left: primary visualization (unique per feature)
- Right: secondary panel (ranking, list, table)

### Footer
- Agent insight — a realistic sentence simulating actual agent output
- CTA button linking to `#cta` section

## Per-Feature Content

### 1. Centri di Ricavo (`data-feature="centri-ricavo"`)
- **Color accent:** Blue (#3b82f6)
- **Stats:** Ricavo totale €24.580, Centri attivi 6, Centro top: Chirurgia, Margine medio 34%
- **Main viz:** Horizontal bar chart — each revenue center with revenue bar + margin % overlay
- **Side panel:** Table with center name, revenue, var% vs previous week
- **Insight:** "La Diagnostica per immagini ha perso il 18% questa settimana. Il centro Vaccinazioni è in crescita costante da 3 settimane: valuta una campagna mirata."

### 2. Performance Individuali (`data-feature="performance"`)
- **Color accent:** Violet (#a78bfa)
- **Stats:** Veterinari attivi 5, Fatturato medio €4.916, Top: Dr. Rossi, Visite medie/giorno 12
- **Main viz:** Grouped vertical bar chart — each vet with bars for revenue, visits, avg ticket
- **Side panel:** Ranking 1-5 with avatar, name, value, trend arrow
- **Insight:** "Dr. Rossi ha aumentato il ticket medio del 12% grazie a un incremento di chirurgie ortopediche. Dr. Verdi è sotto media per il terzo mese: suggerisci un confronto."

### 3. Report Automatici (`data-feature="report"`)
- **Color accent:** Green (#4ade80)
- **Stats:** Report generati 16, Anomalie rilevate 7, Raccomandazioni attive 12, Tempo risparmiato 4.2h
- **Main viz:** Vertical timeline — last 4 weekly reports with date, title, 2-3 highlights each
- **Side panel:** Report preview with sections (Ricavi, Team, Alert) — document effect
- **Insight:** "Nelle ultime 4 settimane hai ricevuto 12 raccomandazioni operative. 8 erano su ottimizzazione slot, 3 su margini, 1 su personale."

### 4. Segmentazione Clienti (`data-feature="segmentazione"`)
- **Color accent:** Orange (#fb923c)
- **Stats:** Clienti totali 1.247, Abituali 38%, Nuovi del mese 47, A rischio abbandono 23
- **Main viz:** Large donut chart with center number + 4 segments (Abituali, Nuovi, Occasionali, Dormienti)
- **Side panel:** Mini-list of at-risk clients with last visit + frequency, high-value clients to cultivate
- **Insight:** "Hai 47 clienti dormienti che non tornano da oltre 90 giorni. Una campagna di richiamo sui vaccini potrebbe riattivarne il 30%."

### 5. Trend in Tempo Reale (`data-feature="trend"`)
- **Color accent:** Pink (#f472b6)
- **Stats:** Trend positivi 4, Trend negativi 2, Settimana migliore: Sett. 12, Variazione media +6.3%
- **Main viz:** Area chart with 2 overlapping lines — current week vs previous — highlighted difference zone
- **Side panel:** List of detected trends with arrow icon, short description, severity (green/yellow/red)
- **Insight:** "Il martedì è diventato il giorno più produttivo, superando il lunedì per la terza settimana consecutiva. I venerdì pomeriggio restano sotto-utilizzati."

### 6. Monitoraggio 24/7 (`data-feature="monitoraggio"`)
- **Color accent:** Cyan (#22d3ee)
- **Stats:** Alert attivi 2, Risolti questa settimana 5, Tempo medio risposta 14min, Uptime 99.8%
- **Main viz:** Alert feed in log/console style — chronological list with timestamp, severity (critical/warning/info), message, status (new/seen/resolved)
- **Side panel:** Severity map with counters by type + mini bar chart of last 4 weeks of alerts
- **Insight:** "Questa settimana 2 alert critici: calo Diagnostica e ticket medio in discesa. Entrambi richiedono attenzione entro lunedì."

## Technical Implementation

### HTML Structure
```html
<!-- One per feature, hidden by default -->
<div class="feature-modal" id="modal-centri-ricavo" data-feature="centri-ricavo">
  <div class="fm-header">...</div>
  <div class="fm-stats">...</div>
  <div class="fm-grid">
    <div class="fm-main">...</div>
    <div class="fm-side">...</div>
  </div>
  <div class="fm-footer">...</div>
</div>

<!-- Shared backdrop -->
<div class="feature-modal-backdrop"></div>
```

### CSS
- `.feature-modal` — fixed position, starts at card position via inline style, transitions to center
- `.feature-modal.open` — full size centered
- `.feature-modal-backdrop` — fixed fullscreen, z-index below modal
- `.feature-item` — cursor: pointer added
- All transitions use `cubic-bezier(0.16, 1, 0.3, 1)` for consistency

### JavaScript
- Click handler on `.feature-item` reads `data-feature`, gets card rect, positions modal, triggers open
- Close via X button, backdrop click, ESC key
- Body scroll lock on open/close
- Animation uses `requestAnimationFrame` for smooth morph

### Responsive
- On mobile (<768px): modal goes full-screen (100vw × 100vh) instead of 90vw × 85vh
- Side panel stacks below main viz
- Stats row goes 2×2 grid

## Files Modified
- `index.html` — all changes inline (CSS + HTML + JS)

## Out of Scope
- No real data connection
- No interactive filters within modals
- No persistent state
