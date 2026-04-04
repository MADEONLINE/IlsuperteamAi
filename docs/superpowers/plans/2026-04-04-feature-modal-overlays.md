# Feature Modal Overlays — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 6 clickable feature cards that morph into modal overlays showing mini-dashboards, demonstrating the depth of each AI agent's work to veterinarians.

**Architecture:** Each feature card gets a `data-feature` attribute and `cursor: pointer`. Clicking triggers a JS morph animation that expands a hidden modal `div` from the card's position to center-screen. Each modal contains a unique mini-dashboard with stats, charts (SVG), and agent insights. Everything is inline in `index.html`.

**Tech Stack:** HTML, CSS transitions, vanilla JS, inline SVG for charts

---

## File Structure

All changes are in a single file:
- **Modify:** `index.html`
  - CSS: Add modal styles (~120 lines) before `</style>` tag (line 888)
  - HTML: Add `data-feature` attrs to existing `.feature-item` elements (lines 1051-1056), add 6 modal divs + backdrop before `</body>` (line 1605)
  - JS: Add modal open/close logic in existing `<script>` block (before line 1603)

---

### Task 1: CSS Foundation for Modal System

Add all modal CSS styles. This is the foundation — no visible changes yet since no modals exist in HTML.

**Files:**
- Modify: `index.html:888` — insert CSS before `</style>`

- [ ] **Step 1: Add modal CSS before the closing `</style>` tag**

Insert these styles at line 888, right before `</style>`:

```css
/* ── Feature Modal Overlays ── */
.feature-item { cursor: pointer; }
.feature-item:active { transform: scale(0.98); }

.feature-modal-backdrop {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    z-index: 900; opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease;
}
.feature-modal-backdrop.visible { opacity: 1; pointer-events: auto; }

.feature-modal {
    position: fixed; z-index: 910;
    background: #080c14; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; overflow: hidden; overflow-y: auto;
    opacity: 0; pointer-events: none;
    transition: top 0.5s cubic-bezier(0.16,1,0.3,1), left 0.5s cubic-bezier(0.16,1,0.3,1),
                width 0.5s cubic-bezier(0.16,1,0.3,1), height 0.5s cubic-bezier(0.16,1,0.3,1),
                border-radius 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.15s ease;
    box-shadow: 0 0 100px rgba(59,130,246,0.08), 0 30px 80px rgba(0,0,0,0.6);
}
.feature-modal.morph-start { opacity: 1; pointer-events: none; }
.feature-modal.open { opacity: 1; pointer-events: auto; border-radius: 16px; }

.fm-inner { opacity: 0; transition: opacity 0.25s ease 0.35s; padding: 2rem; }
.feature-modal.open .fm-inner { opacity: 1; }

/* Header */
.fm-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.fm-header-left { display: flex; align-items: center; gap: 1rem; }
.fm-header-icon {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
}
.fm-header-icon svg { width: 24px; height: 24px; stroke-width: 1.5; fill: none; stroke-linecap: round; stroke-linejoin: round; }
.fm-header-title { font-size: 1.3rem; font-weight: 700; }
.fm-header-sub { font-size: 0.8rem; color: var(--gray-400); margin-top: 0.15rem; }
.fm-close {
    width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04); display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s, border-color 0.2s; color: var(--gray-400);
    font-size: 1.1rem; line-height: 1;
}
.fm-close:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); color: var(--white); }

/* Stats row */
.fm-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.8rem; margin-bottom: 1.2rem; }
.fm-stat {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px; padding: 0.8rem 1rem; text-align: left;
}
.fm-stat-label { font-size: 0.6rem; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem; }
.fm-stat-val { font-size: 1.2rem; font-weight: 700; }
.fm-stat-change { font-size: 0.6rem; font-weight: 600; margin-top: 0.2rem; }
.fm-stat-change.up { color: #22c55e; }
.fm-stat-change.down { color: #ef4444; }

/* Main grid */
.fm-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 1rem; margin-bottom: 1.2rem; }
.fm-panel {
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px; padding: 1.2rem;
}
.fm-panel-title { font-size: 0.65rem; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1rem; font-weight: 600; }

/* Footer */
.fm-footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.06); }
.fm-insight {
    display: flex; align-items: flex-start; gap: 0.6rem; flex: 1;
    font-size: 0.75rem; color: var(--gray-400); line-height: 1.5; font-style: italic;
}
.fm-insight-icon { font-size: 1rem; flex-shrink: 0; }

/* Shared chart elements */
.fm-hbar-row { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; }
.fm-hbar-label { font-size: 0.65rem; color: var(--gray-400); width: 100px; text-align: right; flex-shrink: 0; }
.fm-hbar-track { flex: 1; height: 20px; background: rgba(255,255,255,0.04); border-radius: 4px; overflow: hidden; position: relative; }
.fm-hbar-fill { height: 100%; border-radius: 4px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }
.fm-hbar-val { font-size: 0.6rem; color: var(--gray-500); width: 55px; flex-shrink: 0; }

.fm-table { width: 100%; border-collapse: collapse; }
.fm-table th { font-size: 0.55rem; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; text-align: left; padding: 0 0 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
.fm-table td { font-size: 0.65rem; color: var(--gray-400); padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
.fm-table td:first-child { color: var(--gray-300); font-weight: 500; }
.fm-badge { font-size: 0.5rem; padding: 0.1rem 0.35rem; border-radius: 3px; font-weight: 600; }
.fm-badge.up { color: #22c55e; background: rgba(34,197,94,0.1); }
.fm-badge.down { color: #ef4444; background: rgba(239,68,68,0.1); }

/* Rank list */
.fm-rank { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
.fm-rank:last-child { border-bottom: none; }
.fm-rank-pos { font-size: 0.6rem; font-weight: 700; color: var(--gray-500); width: 16px; text-align: center; }
.fm-rank-avatar { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; font-weight: 700; color: white; flex-shrink: 0; }
.fm-rank-info { flex: 1; }
.fm-rank-name { font-size: 0.7rem; font-weight: 600; color: var(--gray-300); }
.fm-rank-sub { font-size: 0.55rem; color: var(--gray-500); }
.fm-rank-trend { font-size: 0.6rem; font-weight: 600; }

/* Timeline */
.fm-timeline { display: flex; flex-direction: column; gap: 0; }
.fm-tl-item { display: flex; gap: 0.8rem; padding: 0.8rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
.fm-tl-item:last-child { border-bottom: none; }
.fm-tl-dot-col { display: flex; flex-direction: column; align-items: center; width: 12px; padding-top: 3px; }
.fm-tl-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.fm-tl-line { width: 1px; flex: 1; background: rgba(255,255,255,0.06); margin-top: 4px; }
.fm-tl-content { flex: 1; }
.fm-tl-date { font-size: 0.55rem; color: var(--gray-500); margin-bottom: 0.2rem; }
.fm-tl-title { font-size: 0.72rem; font-weight: 600; color: var(--gray-300); margin-bottom: 0.2rem; }
.fm-tl-desc { font-size: 0.6rem; color: var(--gray-500); line-height: 1.4; }

/* Report preview */
.fm-report { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 1rem; }
.fm-report-section { margin-bottom: 0.8rem; }
.fm-report-section:last-child { margin-bottom: 0; }
.fm-report-section-title { font-size: 0.55rem; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; margin-bottom: 0.3rem; padding-bottom: 0.2rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
.fm-report-line { font-size: 0.6rem; color: var(--gray-400); padding: 0.15rem 0; display: flex; align-items: center; gap: 0.4rem; }
.fm-report-line svg { width: 10px; height: 10px; stroke: var(--blue-light); stroke-width: 2; fill: none; flex-shrink: 0; }

/* Donut large */
.fm-donut-large { display: flex; align-items: center; justify-content: center; gap: 2rem; }
.fm-donut-lg { width: 160px; height: 160px; position: relative; }
.fm-donut-lg svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.fm-donut-lg circle { fill: none; stroke-width: 10; stroke-linecap: round; }
.fm-donut-lg-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; }
.fm-donut-lg-val { font-size: 1.5rem; font-weight: 700; }
.fm-donut-lg-label { font-size: 0.55rem; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.06em; }
.fm-donut-legend { display: flex; flex-direction: column; gap: 0.5rem; }
.fm-donut-legend-item { display: flex; align-items: center; gap: 0.5rem; }
.fm-donut-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.fm-donut-legend-text { font-size: 0.72rem; color: var(--gray-400); }
.fm-donut-legend-val { font-size: 0.72rem; font-weight: 600; color: var(--gray-300); margin-left: auto; }

/* Alert feed */
.fm-alert-feed { display: flex; flex-direction: column; gap: 0; }
.fm-alert-row { display: flex; align-items: center; gap: 0.6rem; padding: 0.5rem 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.04); border-radius: 6px; transition: background 0.2s; }
.fm-alert-row:hover { background: rgba(255,255,255,0.02); }
.fm-alert-sev { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.fm-alert-sev.critical { background: #ef4444; box-shadow: 0 0 6px rgba(239,68,68,0.4); }
.fm-alert-sev.warning { background: #f59e0b; box-shadow: 0 0 6px rgba(245,158,11,0.3); }
.fm-alert-sev.info { background: #3b82f6; }
.fm-alert-time { font-size: 0.55rem; color: var(--gray-500); width: 50px; flex-shrink: 0; font-variant-numeric: tabular-nums; }
.fm-alert-msg { font-size: 0.65rem; color: var(--gray-400); flex: 1; }
.fm-alert-status { font-size: 0.5rem; padding: 0.1rem 0.4rem; border-radius: 3px; font-weight: 600; flex-shrink: 0; }
.fm-alert-status.new { color: #ef4444; background: rgba(239,68,68,0.1); }
.fm-alert-status.seen { color: #f59e0b; background: rgba(245,158,11,0.1); }
.fm-alert-status.resolved { color: #22c55e; background: rgba(34,197,94,0.1); }

/* Client list */
.fm-client-row { display: flex; align-items: center; gap: 0.6rem; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
.fm-client-row:last-child { border-bottom: none; }
.fm-client-avatar { width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 0.5rem; color: var(--gray-400); flex-shrink: 0; }
.fm-client-info { flex: 1; }
.fm-client-name { font-size: 0.65rem; font-weight: 500; color: var(--gray-300); }
.fm-client-detail { font-size: 0.5rem; color: var(--gray-500); }
.fm-client-tag { font-size: 0.5rem; padding: 0.1rem 0.35rem; border-radius: 3px; font-weight: 600; flex-shrink: 0; }

/* Trend list */
.fm-trend-row { display: flex; align-items: center; gap: 0.6rem; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
.fm-trend-row:last-child { border-bottom: none; }
.fm-trend-arrow { font-size: 0.8rem; width: 20px; text-align: center; flex-shrink: 0; }
.fm-trend-text { font-size: 0.65rem; color: var(--gray-400); flex: 1; line-height: 1.3; }
.fm-trend-sev { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* Severity counters */
.fm-sev-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 1rem; }
.fm-sev-card { text-align: center; padding: 0.6rem; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); }
.fm-sev-count { font-size: 1.2rem; font-weight: 700; }
.fm-sev-label { font-size: 0.5rem; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.06em; }

/* Responsive */
@media (max-width: 768px) {
    .fm-stats { grid-template-columns: repeat(2, 1fr); }
    .fm-grid { grid-template-columns: 1fr; }
    .fm-donut-large { flex-direction: column; }
    .fm-inner { padding: 1.2rem; }
    .fm-hbar-label { width: 70px; font-size: 0.6rem; }
}
```

- [ ] **Step 2: Verify the page still loads correctly**

Open `file:///Users/massimo/The%20invisible%20team/index.html` in the browser and confirm nothing is broken. The feature cards should now show a pointer cursor on hover.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add CSS foundation for feature modal overlays"
```

---

### Task 2: JavaScript Modal Engine

Add the morph animation logic: open, close, backdrop, ESC key, scroll lock.

**Files:**
- Modify: `index.html` — JS section before closing `</script>` (around line 1603)

- [ ] **Step 1: Add `data-feature` attributes to all 6 feature cards**

Find each `.feature-item` in the HTML (lines 1051-1056) and add the `data-feature` attribute. Replace the 6 lines:

Line 1051 — add `data-feature="centri-ricavo"`:
```html
<div class="feature-item reveal reveal-d1" data-feature="centri-ricavo">
```

Line 1052 — add `data-feature="performance"`:
```html
<div class="feature-item reveal reveal-d2" data-feature="performance">
```

Line 1053 — add `data-feature="report"`:
```html
<div class="feature-item reveal reveal-d3" data-feature="report">
```

Line 1054 — add `data-feature="segmentazione"`:
```html
<div class="feature-item reveal reveal-d1" data-feature="segmentazione">
```

Line 1055 — add `data-feature="trend"`:
```html
<div class="feature-item reveal reveal-d2" data-feature="trend">
```

Line 1056 — add `data-feature="monitoraggio"`:
```html
<div class="feature-item reveal reveal-d3" data-feature="monitoraggio">
```

- [ ] **Step 2: Add backdrop div before `</body>`**

Insert right before `</body>`:

```html
<div class="feature-modal-backdrop" id="fmBackdrop"></div>
```

- [ ] **Step 3: Add modal JS engine**

Insert this JS in the `<script>` block, before the closing `})();` of the particle animation IIFE (or after it, as a new block):

```javascript
/* ── Feature Modal Engine ── */
(function() {
    var backdrop = document.getElementById('fmBackdrop');
    var activeModal = null;
    var sourceRect = null;

    function openModal(featureId, cardEl) {
        var modal = document.getElementById('modal-' + featureId);
        if (!modal) return;
        activeModal = modal;
        sourceRect = cardEl.getBoundingClientRect();

        // Position modal at card location
        modal.style.top = sourceRect.top + 'px';
        modal.style.left = sourceRect.left + 'px';
        modal.style.width = sourceRect.width + 'px';
        modal.style.height = sourceRect.height + 'px';
        modal.style.borderRadius = '20px';
        modal.classList.add('morph-start');

        backdrop.classList.add('visible');
        document.body.style.overflow = 'hidden';

        // Expand to center on next frame
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                var vw = window.innerWidth;
                var vh = window.innerHeight;
                var mw = Math.min(vw * 0.9, 1100);
                var mh = vh * 0.85;
                modal.style.top = ((vh - mh) / 2) + 'px';
                modal.style.left = ((vw - mw) / 2) + 'px';
                modal.style.width = mw + 'px';
                modal.style.height = mh + 'px';
                modal.style.borderRadius = '16px';
                modal.classList.add('open');
            });
        });
    }

    function closeModal() {
        if (!activeModal || !sourceRect) return;
        var modal = activeModal;
        modal.classList.remove('open');

        // Shrink back to card
        modal.style.top = sourceRect.top + 'px';
        modal.style.left = sourceRect.left + 'px';
        modal.style.width = sourceRect.width + 'px';
        modal.style.height = sourceRect.height + 'px';
        modal.style.borderRadius = '20px';

        backdrop.classList.remove('visible');

        setTimeout(function() {
            modal.classList.remove('morph-start');
            document.body.style.overflow = '';
            activeModal = null;
            sourceRect = null;
        }, 500);
    }

    // Click on feature cards
    document.querySelectorAll('.feature-item[data-feature]').forEach(function(card) {
        card.addEventListener('click', function() {
            openModal(card.getAttribute('data-feature'), card);
        });
    });

    // Close on backdrop click
    backdrop.addEventListener('click', closeModal);

    // Close on ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && activeModal) closeModal();
    });

    // Expose closeModal for inline close buttons
    window.closeFeatureModal = closeModal;
})();
```

- [ ] **Step 4: Verify modal engine works**

Open the page, click a feature card. The backdrop should appear with blur. Nothing else will happen visually yet since no modal HTML exists. Check browser console for errors.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add JS modal engine with morph animation"
```

---

### Task 3: Modal — Centri di Ricavo

**Files:**
- Modify: `index.html` — add modal HTML before backdrop div

- [ ] **Step 1: Add Centri di Ricavo modal HTML**

Insert before `<div class="feature-modal-backdrop"`:

```html
<div class="feature-modal" id="modal-centri-ricavo">
<div class="fm-inner">
    <div class="fm-header">
        <div class="fm-header-left">
            <div class="fm-header-icon" style="background:rgba(59,130,246,0.12);border:1px solid rgba(59,130,246,0.15)"><svg viewBox="0 0 24 24" style="stroke:#60a5fa"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
            <div><div class="fm-header-title">Centri di Ricavo</div><div class="fm-header-sub">Il Controller analizza ogni settimana i flussi economici per centro</div></div>
        </div>
        <button class="fm-close" onclick="closeFeatureModal()" aria-label="Chiudi">&times;</button>
    </div>
    <div class="fm-stats">
        <div class="fm-stat"><div class="fm-stat-label">Ricavo totale</div><div class="fm-stat-val" style="color:var(--white)">&euro; 24.580</div><div class="fm-stat-change up">&uarr; 12.4% vs sett. prec.</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Centri attivi</div><div class="fm-stat-val" style="color:var(--white)">6</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Centro top</div><div class="fm-stat-val" style="color:#60a5fa">Chirurgia</div><div class="fm-stat-change up">&euro; 8.200</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Margine medio</div><div class="fm-stat-val" style="color:var(--white)">34%</div><div class="fm-stat-change up">&uarr; 2.1pp</div></div>
    </div>
    <div class="fm-grid">
        <div class="fm-panel">
            <div class="fm-panel-title">Ricavi per centro di ricavo</div>
            <div class="fm-hbar-row"><div class="fm-hbar-label">Chirurgia</div><div class="fm-hbar-track"><div class="fm-hbar-fill" style="width:85%;background:linear-gradient(90deg,#3b82f6,#60a5fa)"></div></div><div class="fm-hbar-val">&euro; 8.200</div></div>
            <div class="fm-hbar-row"><div class="fm-hbar-label">Medicina int.</div><div class="fm-hbar-track"><div class="fm-hbar-fill" style="width:58%;background:linear-gradient(90deg,#3b82f6,#60a5fa)"></div></div><div class="fm-hbar-val">&euro; 5.640</div></div>
            <div class="fm-hbar-row"><div class="fm-hbar-label">Diagnostica</div><div class="fm-hbar-track"><div class="fm-hbar-fill" style="width:43%;background:linear-gradient(90deg,#f59e0b,#fbbf24)"></div></div><div class="fm-hbar-val">&euro; 4.120</div></div>
            <div class="fm-hbar-row"><div class="fm-hbar-label">Vaccinazioni</div><div class="fm-hbar-track"><div class="fm-hbar-fill" style="width:40%;background:linear-gradient(90deg,#22c55e,#4ade80)"></div></div><div class="fm-hbar-val">&euro; 3.890</div></div>
            <div class="fm-hbar-row"><div class="fm-hbar-label">Dermatologia</div><div class="fm-hbar-track"><div class="fm-hbar-fill" style="width:28%;background:linear-gradient(90deg,#3b82f6,#60a5fa)"></div></div><div class="fm-hbar-val">&euro; 2.730</div></div>
            <div class="fm-hbar-row"><div class="fm-hbar-label">Odontoiatria</div><div class="fm-hbar-track"><div class="fm-hbar-fill" style="width:10%;background:linear-gradient(90deg,#3b82f6,#60a5fa)"></div></div><div class="fm-hbar-val">&euro; 980</div></div>
        </div>
        <div class="fm-panel">
            <div class="fm-panel-title">Variazione vs settimana precedente</div>
            <table class="fm-table">
                <thead><tr><th>Centro</th><th>Var.</th></tr></thead>
                <tbody>
                    <tr><td>Chirurgia</td><td><span class="fm-badge up">+14%</span></td></tr>
                    <tr><td>Medicina int.</td><td><span class="fm-badge up">+6%</span></td></tr>
                    <tr><td>Diagnostica</td><td><span class="fm-badge down">-18%</span></td></tr>
                    <tr><td>Vaccinazioni</td><td><span class="fm-badge up">+22%</span></td></tr>
                    <tr><td>Dermatologia</td><td><span class="fm-badge up">+3%</span></td></tr>
                    <tr><td>Odontoiatria</td><td><span class="fm-badge down">-5%</span></td></tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="fm-footer">
        <div class="fm-insight"><span class="fm-insight-icon">&#128161;</span>La Diagnostica per immagini ha perso il 18% questa settimana. Il centro Vaccinazioni è in crescita costante da 3 settimane: valuta una campagna mirata.</div>
        <a href="#cta" class="btn-dot btn-dot--sm" onclick="closeFeatureModal()">Attiva agente <span class="dot-accent" aria-hidden="true"></span></a>
    </div>
</div>
</div>
```

- [ ] **Step 2: Test the modal**

Open the page, click "Centri di ricavo" card. The card should morph into the modal showing the horizontal bar chart and table. Click X or backdrop to close. Verify the shrink-back animation works.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Centri di Ricavo modal with bar chart"
```

---

### Task 4: Modal — Performance Individuali

**Files:**
- Modify: `index.html` — add modal HTML after the centri-ricavo modal

- [ ] **Step 1: Add Performance Individuali modal HTML**

Insert after the closing `</div>` of `modal-centri-ricavo`:

```html
<div class="feature-modal" id="modal-performance">
<div class="fm-inner">
    <div class="fm-header">
        <div class="fm-header-left">
            <div class="fm-header-icon" style="background:rgba(124,58,237,0.12);border:1px solid rgba(124,58,237,0.15)"><svg viewBox="0 0 24 24" style="stroke:#a78bfa"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 8-4 4 4 4"/></svg></div>
            <div><div class="fm-header-title">Performance Individuali</div><div class="fm-header-sub">Il Coach monitora produttivita e vendite di ogni veterinario</div></div>
        </div>
        <button class="fm-close" onclick="closeFeatureModal()" aria-label="Chiudi">&times;</button>
    </div>
    <div class="fm-stats">
        <div class="fm-stat"><div class="fm-stat-label">Veterinari attivi</div><div class="fm-stat-val" style="color:var(--white)">5</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Fatturato medio</div><div class="fm-stat-val" style="color:var(--white)">&euro; 4.916</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Top performer</div><div class="fm-stat-val" style="color:#a78bfa">Dr. Rossi</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Visite medie/giorno</div><div class="fm-stat-val" style="color:var(--white)">12</div></div>
    </div>
    <div class="fm-grid">
        <div class="fm-panel">
            <div class="fm-panel-title">Fatturato per veterinario — questa settimana</div>
            <div class="fm-hbar-row"><div class="fm-hbar-label">Dr. Rossi</div><div class="fm-hbar-track"><div class="fm-hbar-fill" style="width:100%;background:linear-gradient(90deg,#7c3aed,#a78bfa)"></div></div><div class="fm-hbar-val">&euro; 6.240</div></div>
            <div class="fm-hbar-row"><div class="fm-hbar-label">Dr.ssa Bianchi</div><div class="fm-hbar-track"><div class="fm-hbar-fill" style="width:88%;background:linear-gradient(90deg,#7c3aed,#a78bfa)"></div></div><div class="fm-hbar-val">&euro; 5.890</div></div>
            <div class="fm-hbar-row"><div class="fm-hbar-label">Dr. Verdi</div><div class="fm-hbar-track"><div class="fm-hbar-fill" style="width:69%;background:linear-gradient(90deg,#f59e0b,#fbbf24)"></div></div><div class="fm-hbar-val">&euro; 4.320</div></div>
            <div class="fm-hbar-row"><div class="fm-hbar-label">Dr.ssa Neri</div><div class="fm-hbar-track"><div class="fm-hbar-fill" style="width:62%;background:linear-gradient(90deg,#7c3aed,#a78bfa)"></div></div><div class="fm-hbar-val">&euro; 3.880</div></div>
            <div class="fm-hbar-row"><div class="fm-hbar-label">Dr. Conti</div><div class="fm-hbar-track"><div class="fm-hbar-fill" style="width:58%;background:linear-gradient(90deg,#7c3aed,#a78bfa)"></div></div><div class="fm-hbar-val">&euro; 3.650</div></div>
        </div>
        <div class="fm-panel">
            <div class="fm-panel-title">Classifica settimanale</div>
            <div class="fm-rank"><div class="fm-rank-pos">1</div><div class="fm-rank-avatar" style="background:linear-gradient(135deg,#3b82f6,#7c3aed)">MR</div><div class="fm-rank-info"><div class="fm-rank-name">Dr. Rossi</div><div class="fm-rank-sub">42 visite · ticket &euro;149</div></div><div class="fm-rank-trend" style="color:#22c55e">&uarr; 12%</div></div>
            <div class="fm-rank"><div class="fm-rank-pos">2</div><div class="fm-rank-avatar" style="background:linear-gradient(135deg,#22c55e,#3b82f6)">LB</div><div class="fm-rank-info"><div class="fm-rank-name">Dr.ssa Bianchi</div><div class="fm-rank-sub">38 visite · ticket &euro;155</div></div><div class="fm-rank-trend" style="color:#22c55e">&uarr; 8%</div></div>
            <div class="fm-rank"><div class="fm-rank-pos">3</div><div class="fm-rank-avatar" style="background:linear-gradient(135deg,#f59e0b,#ef4444)">GV</div><div class="fm-rank-info"><div class="fm-rank-name">Dr. Verdi</div><div class="fm-rank-sub">35 visite · ticket &euro;123</div></div><div class="fm-rank-trend" style="color:#ef4444">&darr; 6%</div></div>
            <div class="fm-rank"><div class="fm-rank-pos">4</div><div class="fm-rank-avatar" style="background:linear-gradient(135deg,#ec4899,#a78bfa)">AN</div><div class="fm-rank-info"><div class="fm-rank-name">Dr.ssa Neri</div><div class="fm-rank-sub">30 visite · ticket &euro;129</div></div><div class="fm-rank-trend" style="color:#22c55e">&uarr; 3%</div></div>
            <div class="fm-rank"><div class="fm-rank-pos">5</div><div class="fm-rank-avatar" style="background:linear-gradient(135deg,#6b7280,#374151)">PC</div><div class="fm-rank-info"><div class="fm-rank-name">Dr. Conti</div><div class="fm-rank-sub">28 visite · ticket &euro;130</div></div><div class="fm-rank-trend" style="color:#f59e0b">&mdash; 0%</div></div>
        </div>
    </div>
    <div class="fm-footer">
        <div class="fm-insight"><span class="fm-insight-icon">&#128161;</span>Dr. Rossi ha aumentato il ticket medio del 12% grazie a un incremento di chirurgie ortopediche. Dr. Verdi è sotto media per il terzo mese: suggerisci un confronto.</div>
        <a href="#cta" class="btn-dot btn-dot--sm" onclick="closeFeatureModal()">Attiva agente <span class="dot-accent" aria-hidden="true"></span></a>
    </div>
</div>
</div>
```

- [ ] **Step 2: Test and commit**

```bash
git add index.html
git commit -m "feat: add Performance Individuali modal with ranking"
```

---

### Task 5: Modal — Report Automatici

**Files:**
- Modify: `index.html` — add modal HTML after modal-performance

- [ ] **Step 1: Add Report Automatici modal HTML**

```html
<div class="feature-modal" id="modal-report">
<div class="fm-inner">
    <div class="fm-header">
        <div class="fm-header-left">
            <div class="fm-header-icon" style="background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.15)"><svg viewBox="0 0 24 24" style="stroke:#4ade80"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
            <div><div class="fm-header-title">Report Automatici</div><div class="fm-header-sub">Ogni lunedì ricevi un report completo generato dall'AI</div></div>
        </div>
        <button class="fm-close" onclick="closeFeatureModal()" aria-label="Chiudi">&times;</button>
    </div>
    <div class="fm-stats">
        <div class="fm-stat"><div class="fm-stat-label">Report generati</div><div class="fm-stat-val" style="color:var(--white)">16</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Anomalie rilevate</div><div class="fm-stat-val" style="color:#f59e0b">7</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Raccomandazioni</div><div class="fm-stat-val" style="color:var(--white)">12</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Tempo risparmiato</div><div class="fm-stat-val" style="color:#4ade80">4.2h</div></div>
    </div>
    <div class="fm-grid">
        <div class="fm-panel">
            <div class="fm-panel-title">Ultimi report settimanali</div>
            <div class="fm-timeline">
                <div class="fm-tl-item"><div class="fm-tl-dot-col"><div class="fm-tl-dot" style="background:#4ade80"></div><div class="fm-tl-line"></div></div><div class="fm-tl-content"><div class="fm-tl-date">31 Mar 2026 · 07:30</div><div class="fm-tl-title">Report Settimana 14</div><div class="fm-tl-desc">Ricavi +12.4% · Chirurgia centro top · 2 alert critici</div></div></div>
                <div class="fm-tl-item"><div class="fm-tl-dot-col"><div class="fm-tl-dot" style="background:#3b82f6"></div><div class="fm-tl-line"></div></div><div class="fm-tl-content"><div class="fm-tl-date">24 Mar 2026 · 07:30</div><div class="fm-tl-title">Report Settimana 13</div><div class="fm-tl-desc">Ricavi +3.1% · 47 nuovi clienti · Ticket medio stabile</div></div></div>
                <div class="fm-tl-item"><div class="fm-tl-dot-col"><div class="fm-tl-dot" style="background:#3b82f6"></div><div class="fm-tl-line"></div></div><div class="fm-tl-content"><div class="fm-tl-date">17 Mar 2026 · 07:30</div><div class="fm-tl-title">Report Settimana 12</div><div class="fm-tl-desc">Ricavi +8.7% · Settimana record · Margine in crescita</div></div></div>
                <div class="fm-tl-item"><div class="fm-tl-dot-col"><div class="fm-tl-dot" style="background:#f59e0b"></div></div><div class="fm-tl-content"><div class="fm-tl-date">10 Mar 2026 · 07:30</div><div class="fm-tl-title">Report Settimana 11</div><div class="fm-tl-desc">Ricavi -2.3% · Alert su Diagnostica · 3 raccomandazioni</div></div></div>
            </div>
        </div>
        <div class="fm-panel">
            <div class="fm-panel-title">Anteprima report</div>
            <div class="fm-report">
                <div class="fm-report-section"><div class="fm-report-section-title">Ricavi</div><div class="fm-report-line"><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Fatturato settimanale: &euro;24.580 (+12.4%)</div><div class="fm-report-line"><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Centro top: Chirurgia (&euro;8.200)</div><div class="fm-report-line"><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Margine operativo: 34.2%</div></div>
                <div class="fm-report-section"><div class="fm-report-section-title">Team</div><div class="fm-report-line"><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Top performer: Dr. Rossi (&euro;6.240)</div><div class="fm-report-line"><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Attenzione: Dr. Verdi sotto media</div></div>
                <div class="fm-report-section"><div class="fm-report-section-title">Alert</div><div class="fm-report-line"><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Diagnostica -18% vs media 4 sett.</div><div class="fm-report-line"><svg viewBox="0 0 16 16"><path d="M3.3 8.7 6 11.3l6.7-6.6"/></svg>Ticket medio in lieve calo (-3.1%)</div></div>
            </div>
        </div>
    </div>
    <div class="fm-footer">
        <div class="fm-insight"><span class="fm-insight-icon">&#128161;</span>Nelle ultime 4 settimane hai ricevuto 12 raccomandazioni operative. 8 erano su ottimizzazione slot, 3 su margini, 1 su personale.</div>
        <a href="#cta" class="btn-dot btn-dot--sm" onclick="closeFeatureModal()">Attiva agente <span class="dot-accent" aria-hidden="true"></span></a>
    </div>
</div>
</div>
```

- [ ] **Step 2: Test and commit**

```bash
git add index.html
git commit -m "feat: add Report Automatici modal with timeline"
```

---

### Task 6: Modal — Segmentazione Clienti

**Files:**
- Modify: `index.html` — add modal HTML after modal-report

- [ ] **Step 1: Add Segmentazione Clienti modal HTML**

```html
<div class="feature-modal" id="modal-segmentazione">
<div class="fm-inner">
    <div class="fm-header">
        <div class="fm-header-left">
            <div class="fm-header-icon" style="background:rgba(249,115,22,0.12);border:1px solid rgba(249,115,22,0.15)"><svg viewBox="0 0 24 24" style="stroke:#fb923c"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg></div>
            <div><div class="fm-header-title">Segmentazione Clienti</div><div class="fm-header-sub">L'Analyst classifica automaticamente le tipologie di clienti</div></div>
        </div>
        <button class="fm-close" onclick="closeFeatureModal()" aria-label="Chiudi">&times;</button>
    </div>
    <div class="fm-stats">
        <div class="fm-stat"><div class="fm-stat-label">Clienti totali</div><div class="fm-stat-val" style="color:var(--white)">1.247</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Abituali</div><div class="fm-stat-val" style="color:#3b82f6">38%</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Nuovi del mese</div><div class="fm-stat-val" style="color:#22c55e">47</div></div>
        <div class="fm-stat"><div class="fm-stat-label">A rischio</div><div class="fm-stat-val" style="color:#ef4444">23</div></div>
    </div>
    <div class="fm-grid">
        <div class="fm-panel">
            <div class="fm-panel-title">Distribuzione clienti</div>
            <div class="fm-donut-large">
                <div class="fm-donut-lg">
                    <svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" stroke="rgba(255,255,255,0.04)"/><circle cx="18" cy="18" r="14" stroke="#3b82f6" stroke-dasharray="33.4 54.6" stroke-dashoffset="0"/><circle cx="18" cy="18" r="14" stroke="#22c55e" stroke-dasharray="22 66" stroke-dashoffset="-33.4"/><circle cx="18" cy="18" r="14" stroke="#f59e0b" stroke-dasharray="17.6 70.4" stroke-dashoffset="-55.4"/><circle cx="18" cy="18" r="14" stroke="#ef4444" stroke-dasharray="14.96 73.04" stroke-dashoffset="-73"/></svg>
                    <div class="fm-donut-lg-center"><div class="fm-donut-lg-val">1.247</div><div class="fm-donut-lg-label">Clienti</div></div>
                </div>
                <div class="fm-donut-legend">
                    <div class="fm-donut-legend-item"><div class="fm-donut-legend-dot" style="background:#3b82f6"></div><div class="fm-donut-legend-text">Abituali</div><div class="fm-donut-legend-val">474</div></div>
                    <div class="fm-donut-legend-item"><div class="fm-donut-legend-dot" style="background:#22c55e"></div><div class="fm-donut-legend-text">Nuovi</div><div class="fm-donut-legend-val">312</div></div>
                    <div class="fm-donut-legend-item"><div class="fm-donut-legend-dot" style="background:#f59e0b"></div><div class="fm-donut-legend-text">Occasionali</div><div class="fm-donut-legend-val">249</div></div>
                    <div class="fm-donut-legend-item"><div class="fm-donut-legend-dot" style="background:#ef4444"></div><div class="fm-donut-legend-text">Dormienti</div><div class="fm-donut-legend-val">212</div></div>
                </div>
            </div>
        </div>
        <div class="fm-panel">
            <div class="fm-panel-title">Clienti a rischio abbandono</div>
            <div class="fm-client-row"><div class="fm-client-avatar">MF</div><div class="fm-client-info"><div class="fm-client-name">Marco Ferri</div><div class="fm-client-detail">Ultima visita: 94 giorni fa</div></div><div class="fm-client-tag" style="color:#ef4444;background:rgba(239,68,68,0.1)">Dormiente</div></div>
            <div class="fm-client-row"><div class="fm-client-avatar">AG</div><div class="fm-client-info"><div class="fm-client-name">Anna Galli</div><div class="fm-client-detail">Ultima visita: 112 giorni fa</div></div><div class="fm-client-tag" style="color:#ef4444;background:rgba(239,68,68,0.1)">Dormiente</div></div>
            <div class="fm-client-row"><div class="fm-client-avatar">LM</div><div class="fm-client-info"><div class="fm-client-name">Luca Moretti</div><div class="fm-client-detail">Ultima visita: 87 giorni fa</div></div><div class="fm-client-tag" style="color:#f59e0b;background:rgba(245,158,11,0.1)">A rischio</div></div>
            <div style="margin-top:1rem"><div class="fm-panel-title">Clienti alto valore</div></div>
            <div class="fm-client-row"><div class="fm-client-avatar">SR</div><div class="fm-client-info"><div class="fm-client-name">Sara Ricci</div><div class="fm-client-detail">12 visite/anno · &euro;2.340</div></div><div class="fm-client-tag" style="color:#3b82f6;background:rgba(59,130,246,0.1)">VIP</div></div>
            <div class="fm-client-row"><div class="fm-client-avatar">PB</div><div class="fm-client-info"><div class="fm-client-name">Paolo Bruni</div><div class="fm-client-detail">8 visite/anno · &euro;1.890</div></div><div class="fm-client-tag" style="color:#3b82f6;background:rgba(59,130,246,0.1)">VIP</div></div>
        </div>
    </div>
    <div class="fm-footer">
        <div class="fm-insight"><span class="fm-insight-icon">&#128161;</span>Hai 47 clienti dormienti che non tornano da oltre 90 giorni. Una campagna di richiamo sui vaccini potrebbe riattivarne il 30%.</div>
        <a href="#cta" class="btn-dot btn-dot--sm" onclick="closeFeatureModal()">Attiva agente <span class="dot-accent" aria-hidden="true"></span></a>
    </div>
</div>
</div>
```

- [ ] **Step 2: Test and commit**

```bash
git add index.html
git commit -m "feat: add Segmentazione Clienti modal with donut chart"
```

---

### Task 7: Modal — Trend in Tempo Reale

**Files:**
- Modify: `index.html` — add modal HTML after modal-segmentazione

- [ ] **Step 1: Add Trend modal HTML**

```html
<div class="feature-modal" id="modal-trend">
<div class="fm-inner">
    <div class="fm-header">
        <div class="fm-header-left">
            <div class="fm-header-icon" style="background:rgba(236,72,153,0.12);border:1px solid rgba(236,72,153,0.15)"><svg viewBox="0 0 24 24" style="stroke:#f472b6"><path d="M18 20V10M12 20V4M6 20v-6"/></svg></div>
            <div><div class="fm-header-title">Trend in Tempo Reale</div><div class="fm-header-sub">Confronto settimana su settimana per individuare pattern</div></div>
        </div>
        <button class="fm-close" onclick="closeFeatureModal()" aria-label="Chiudi">&times;</button>
    </div>
    <div class="fm-stats">
        <div class="fm-stat"><div class="fm-stat-label">Trend positivi</div><div class="fm-stat-val" style="color:#22c55e">4</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Trend negativi</div><div class="fm-stat-val" style="color:#ef4444">2</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Settimana migliore</div><div class="fm-stat-val" style="color:var(--white)">Sett. 12</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Variazione media</div><div class="fm-stat-val" style="color:#22c55e">+6.3%</div></div>
    </div>
    <div class="fm-grid">
        <div class="fm-panel">
            <div class="fm-panel-title">Ricavi: questa settimana vs precedente</div>
            <svg viewBox="0 0 500 180" preserveAspectRatio="none" style="width:100%;height:180px">
                <defs>
                    <linearGradient id="fmTrendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f472b6" stop-opacity="0.15"/><stop offset="100%" stop-color="#f472b6" stop-opacity="0"/></linearGradient>
                </defs>
                <line x1="0" y1="36" x2="500" y2="36" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
                <line x1="0" y1="72" x2="500" y2="72" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
                <line x1="0" y1="108" x2="500" y2="108" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
                <line x1="0" y1="144" x2="500" y2="144" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
                <!-- Previous week (dashed) -->
                <path d="M0,120 C70,110 140,100 210,95 C280,90 350,105 420,115 C460,120 500,118 500,118" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="6 4"/>
                <!-- Current week (solid + fill) -->
                <path d="M0,130 C70,100 140,80 210,60 C280,45 350,55 420,40 C460,35 500,30 500,30 L500,180 L0,180Z" fill="url(#fmTrendFill)"/>
                <path d="M0,130 C70,100 140,80 210,60 C280,45 350,55 420,40 C460,35 500,30 500,30" fill="none" stroke="#f472b6" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div style="display:flex;justify-content:space-between;padding-top:0.3rem"><span style="font-size:0.5rem;color:var(--gray-500)">Lun</span><span style="font-size:0.5rem;color:var(--gray-500)">Mar</span><span style="font-size:0.5rem;color:var(--gray-500)">Mer</span><span style="font-size:0.5rem;color:var(--gray-500)">Gio</span><span style="font-size:0.5rem;color:var(--gray-500)">Ven</span><span style="font-size:0.5rem;color:var(--gray-500)">Sab</span></div>
            <div style="display:flex;gap:1.5rem;margin-top:0.6rem"><span style="font-size:0.6rem;color:#f472b6;display:flex;align-items:center;gap:0.3rem"><span style="width:16px;height:2px;background:#f472b6;display:inline-block"></span>Questa sett.</span><span style="font-size:0.6rem;color:var(--gray-500);display:flex;align-items:center;gap:0.3rem"><span style="width:16px;height:2px;background:rgba(255,255,255,0.2);display:inline-block;border-top:1px dashed rgba(255,255,255,0.3)"></span>Sett. precedente</span></div>
        </div>
        <div class="fm-panel">
            <div class="fm-panel-title">Trend rilevati</div>
            <div class="fm-trend-row"><div class="fm-trend-arrow" style="color:#22c55e">&uarr;</div><div class="fm-trend-text">Chirurgia: +14% per la terza settimana</div><div class="fm-trend-sev" style="background:#22c55e"></div></div>
            <div class="fm-trend-row"><div class="fm-trend-arrow" style="color:#22c55e">&uarr;</div><div class="fm-trend-text">Vaccinazioni in crescita costante (+22%)</div><div class="fm-trend-sev" style="background:#22c55e"></div></div>
            <div class="fm-trend-row"><div class="fm-trend-arrow" style="color:#22c55e">&uarr;</div><div class="fm-trend-text">Martedì supera Lunedì come giorno top</div><div class="fm-trend-sev" style="background:#3b82f6"></div></div>
            <div class="fm-trend-row"><div class="fm-trend-arrow" style="color:#22c55e">&uarr;</div><div class="fm-trend-text">Nuovi clienti +20.5% vs media</div><div class="fm-trend-sev" style="background:#22c55e"></div></div>
            <div class="fm-trend-row"><div class="fm-trend-arrow" style="color:#ef4444">&darr;</div><div class="fm-trend-text">Diagnostica in calo da 2 settimane</div><div class="fm-trend-sev" style="background:#ef4444"></div></div>
            <div class="fm-trend-row"><div class="fm-trend-arrow" style="color:#ef4444">&darr;</div><div class="fm-trend-text">Venerdì pomeriggio sotto-utilizzati</div><div class="fm-trend-sev" style="background:#f59e0b"></div></div>
        </div>
    </div>
    <div class="fm-footer">
        <div class="fm-insight"><span class="fm-insight-icon">&#128161;</span>Il martedì è diventato il giorno più produttivo, superando il lunedì per la terza settimana consecutiva. I venerdì pomeriggio restano sotto-utilizzati.</div>
        <a href="#cta" class="btn-dot btn-dot--sm" onclick="closeFeatureModal()">Attiva agente <span class="dot-accent" aria-hidden="true"></span></a>
    </div>
</div>
</div>
```

- [ ] **Step 2: Test and commit**

```bash
git add index.html
git commit -m "feat: add Trend in Tempo Reale modal with area chart"
```

---

### Task 8: Modal — Monitoraggio 24/7

**Files:**
- Modify: `index.html` — add modal HTML after modal-trend

- [ ] **Step 1: Add Monitoraggio modal HTML**

```html
<div class="feature-modal" id="modal-monitoraggio">
<div class="fm-inner">
    <div class="fm-header">
        <div class="fm-header-left">
            <div class="fm-header-icon" style="background:rgba(34,211,238,0.12);border:1px solid rgba(34,211,238,0.15)"><svg viewBox="0 0 24 24" style="stroke:#22d3ee"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg></div>
            <div><div class="fm-header-title">Monitoraggio 24/7</div><div class="fm-header-sub">I tre agenti monitorano continuamente e inviano alert</div></div>
        </div>
        <button class="fm-close" onclick="closeFeatureModal()" aria-label="Chiudi">&times;</button>
    </div>
    <div class="fm-stats">
        <div class="fm-stat"><div class="fm-stat-label">Alert attivi</div><div class="fm-stat-val" style="color:#ef4444">2</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Risolti questa sett.</div><div class="fm-stat-val" style="color:#22c55e">5</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Tempo medio risposta</div><div class="fm-stat-val" style="color:var(--white)">14min</div></div>
        <div class="fm-stat"><div class="fm-stat-label">Uptime</div><div class="fm-stat-val" style="color:#22d3ee">99.8%</div></div>
    </div>
    <div class="fm-grid">
        <div class="fm-panel">
            <div class="fm-panel-title">Feed alert — ultimi 7 giorni</div>
            <div class="fm-alert-feed">
                <div class="fm-alert-row"><div class="fm-alert-sev critical"></div><div class="fm-alert-time">Oggi 07:31</div><div class="fm-alert-msg">Diagnostica per immagini -18% vs media 4 settimane</div><div class="fm-alert-status new">Nuovo</div></div>
                <div class="fm-alert-row"><div class="fm-alert-sev warning"></div><div class="fm-alert-time">Oggi 07:31</div><div class="fm-alert-msg">Ticket medio in calo: &euro;87 (-3.1% vs sett. prec.)</div><div class="fm-alert-status new">Nuovo</div></div>
                <div class="fm-alert-row"><div class="fm-alert-sev warning"></div><div class="fm-alert-time">Ieri 09:15</div><div class="fm-alert-msg">Dr. Verdi sotto media fatturato per 3&deg; mese consecutivo</div><div class="fm-alert-status seen">Visto</div></div>
                <div class="fm-alert-row"><div class="fm-alert-sev info"></div><div class="fm-alert-time">Ieri 08:00</div><div class="fm-alert-msg">12 clienti dormienti identificati (ultima visita >90gg)</div><div class="fm-alert-status seen">Visto</div></div>
                <div class="fm-alert-row"><div class="fm-alert-sev warning"></div><div class="fm-alert-time">Mar 07:30</div><div class="fm-alert-msg">Venerdì pomeriggio sotto-utilizzato: 40% slot vuoti</div><div class="fm-alert-status resolved">Risolto</div></div>
                <div class="fm-alert-row"><div class="fm-alert-sev critical"></div><div class="fm-alert-time">Lun 07:30</div><div class="fm-alert-msg">Margine Odontoiatria sotto soglia critica (12%)</div><div class="fm-alert-status resolved">Risolto</div></div>
                <div class="fm-alert-row"><div class="fm-alert-sev info"></div><div class="fm-alert-time">Lun 07:30</div><div class="fm-alert-msg">Report settimanale #14 generato e inviato</div><div class="fm-alert-status resolved">Risolto</div></div>
            </div>
        </div>
        <div class="fm-panel">
            <div class="fm-panel-title">Severità alert</div>
            <div class="fm-sev-grid">
                <div class="fm-sev-card"><div class="fm-sev-count" style="color:#ef4444">2</div><div class="fm-sev-label">Critici</div></div>
                <div class="fm-sev-card"><div class="fm-sev-count" style="color:#f59e0b">3</div><div class="fm-sev-label">Warning</div></div>
                <div class="fm-sev-card"><div class="fm-sev-count" style="color:#3b82f6">2</div><div class="fm-sev-label">Info</div></div>
            </div>
            <div class="fm-panel-title">Alert per settimana</div>
            <div style="display:flex;align-items:flex-end;gap:4px;height:60px;padding-top:0.5rem">
                <div style="flex:1;background:rgba(34,211,238,0.2);border-radius:3px 3px 0 0;height:40%"></div>
                <div style="flex:1;background:rgba(34,211,238,0.3);border-radius:3px 3px 0 0;height:60%"></div>
                <div style="flex:1;background:rgba(34,211,238,0.25);border-radius:3px 3px 0 0;height:45%"></div>
                <div style="flex:1;background:rgba(34,211,238,0.5);border-radius:3px 3px 0 0;height:100%"></div>
            </div>
            <div style="display:flex;justify-content:space-between;padding-top:0.3rem"><span style="font-size:0.5rem;color:var(--gray-500)">S.11</span><span style="font-size:0.5rem;color:var(--gray-500)">S.12</span><span style="font-size:0.5rem;color:var(--gray-500)">S.13</span><span style="font-size:0.5rem;color:var(--gray-500)">S.14</span></div>
        </div>
    </div>
    <div class="fm-footer">
        <div class="fm-insight"><span class="fm-insight-icon">&#128161;</span>Questa settimana 2 alert critici: calo Diagnostica e ticket medio in discesa. Entrambi richiedono attenzione entro lunedì.</div>
        <a href="#cta" class="btn-dot btn-dot--sm" onclick="closeFeatureModal()">Attiva agente <span class="dot-accent" aria-hidden="true"></span></a>
    </div>
</div>
</div>
```

- [ ] **Step 2: Test all 6 modals**

Click each of the 6 feature cards and verify:
- Morph animation opens smoothly from card position
- Content is correct and readable
- Close button, backdrop click, and ESC all work
- Shrink-back animation returns to correct card position
- No console errors

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Monitoraggio 24/7 modal with alert feed"
```

---

### Task 9: Final Polish and Cross-Browser Test

- [ ] **Step 1: Test responsive behavior**

Resize browser to <768px and verify:
- Modals go full screen
- Stats grid becomes 2×2
- Main grid stacks vertically
- Donut chart stacks vertically
- All content remains readable

- [ ] **Step 2: Test all morph animations at different scroll positions**

Scroll to different positions on the page, then click feature cards. The morph should always start from the card's current visible position, not a stale one.

- [ ] **Step 3: Final commit**

```bash
git add index.html
git commit -m "feat: complete feature modal overlays — 6 interactive mini-dashboards"
```
