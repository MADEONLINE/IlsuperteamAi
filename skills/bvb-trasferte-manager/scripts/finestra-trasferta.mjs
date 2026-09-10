#!/usr/bin/env node
/**
 * finestra-trasferta.mjs — calcola la finestra di pernottamento e viaggio
 * a partire dagli eventi aula del calendario BRAVE MEDIA.
 *
 *   node finestra-trasferta.mjs eventi.json
 *   node finestra-trasferta.mjs --date 2026-10-01 --days 2 --end 17:00 --citta Milano
 *
 * eventi.json = output di mcp__Google_Calendar__list_events (oggetto con `events`,
 * oppure direttamente l'array degli eventi).
 *
 * Regole applicate (vedi SKILL.md §2 e references/calendari-e-parsing.md):
 *  - per gli eventi all-day `end.date` e ESCLUSIVA -> ultimo giorno = end.date - 1
 *  - check-in  = giorno precedente al primo giorno d'aula
 *  - check-out = ultimo giorno d'aula
 *  - notti     = numero dei giorni d'aula
 *  - ultima sessione che finisce alle 16:30 o dopo -> NOTTE_EXTRA_DA_VALUTARE
 */

const ORA_LIMITE_RIENTRO = 16 * 60 + 30; // 16:30
const MARGINE_RIENTRO_MIN = 150;         // 2h30 tra fine aula e partenza
const ARRIVO_ENTRO = '21:00';

const ESCLUDI = /\b(meet|call|calendly|coworking|audible|abb\b|compleanno|ferie)\b/i;
const INCLUDI = /\b(modulo|master|corso|aula|convention|revolution|gestione|clinic|academy|edizione|ed\.)\b/i;

const giorno = (d) => d.toISOString().slice(0, 10);
const addDays = (iso, n) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return giorno(d);
};
const diffGiorni = (a, b) =>
  Math.round((new Date(`${b}T12:00:00Z`) - new Date(`${a}T12:00:00Z`)) / 86400000);
const minuti = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const hhmm = (min) =>
  `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/** Normalizza un evento Google Calendar in {inizio, fine, oraFine, titolo, citta}. */
function normalizza(ev) {
  const titolo = (ev.summary || '').trim();
  const allDay = Boolean(ev.start?.date);
  const inizio = allDay ? ev.start.date.slice(0, 10) : ev.start.dateTime.slice(0, 10);
  // end.date e esclusiva: l'ultimo giorno reale e quello precedente
  const fine = allDay
    ? addDays(ev.end.date.slice(0, 10), -1)
    : ev.end.dateTime.slice(0, 10);
  const oraFine = allDay ? null : ev.end.dateTime.slice(11, 16);
  return { titolo, inizio, fine, oraFine, citta: citta(ev), allDay };
}

function citta(ev) {
  if (ev.location) return ev.location.split(',')[0].trim();
  const noti = ['Milano', 'Padova', 'Bologna', 'Roma', 'Palermo', 'Napoli', 'Torino', 'Firenze', 'Verona', 'Bari'];
  const testo = `${ev.summary || ''} ${ev.description || ''}`;
  return noti.find((c) => new RegExp(c, 'i').test(testo)) || null;
}

const isAula = (ev) => {
  const t = ev.summary || '';
  if (!t || ESCLUDI.test(t)) return false;
  if (ev.conferenceUrl) return false;
  return INCLUDI.test(t) || Boolean(ev.start?.date); // gli all-day sono candidati aula
};

/** Accorpa eventi contigui (stesso giorno o giorni consecutivi) della stessa citta. */
function raggruppa(eventi) {
  const ordinati = [...eventi].sort((a, b) => a.inizio.localeCompare(b.inizio));
  const gruppi = [];
  for (const ev of ordinati) {
    const g = gruppi.find(
      (x) =>
        (x.citta === ev.citta || !ev.citta || !x.citta) &&
        diffGiorni(x.fine, ev.inizio) <= 1 &&
        diffGiorni(ev.fine, x.inizio) <= 1
    );
    if (g) {
      g.inizio = g.inizio < ev.inizio ? g.inizio : ev.inizio;
      g.fine = g.fine > ev.fine ? g.fine : ev.fine;
      g.citta = g.citta || ev.citta;
      if (ev.oraFine) g.oreFine[ev.fine] = ev.oraFine;
      if (!g.titoli.includes(ev.titolo)) g.titoli.push(ev.titolo);
    } else {
      gruppi.push({ ...ev, titoli: [ev.titolo], oreFine: ev.oraFine ? { [ev.fine]: ev.oraFine } : {} });
    }
  }
  // l'orario che conta e quello dell'ULTIMO giorno d'aula, non del primo
  for (const g of gruppi) g.oraFine = g.oreFine[g.fine] || null;
  return gruppi;
}

function finestra(g) {
  const giorniAula = diffGiorni(g.inizio, g.fine) + 1;
  const checkIn = addDays(g.inizio, -1);
  const checkOut = g.fine;
  const notti = giorniAula;
  const flags = [];
  let partenzaRientroMin = null;

  if (g.oraFine) {
    partenzaRientroMin = minuti(g.oraFine) + MARGINE_RIENTRO_MIN;
    if (minuti(g.oraFine) >= ORA_LIMITE_RIENTRO) flags.push('NOTTE_EXTRA_DA_VALUTARE');
  } else {
    flags.push('ORARIO_FINE_SCONOSCIUTO');
  }
  if (!g.citta) flags.push('CITTA_DA_CONFERMARE');

  return {
    evento: g.titoli.join(' + '),
    citta: g.citta || '?',
    aula: giorniAula === 1 ? g.inizio : `${g.inizio} -> ${g.fine}`,
    giorniAula,
    checkIn,
    checkOut,
    notti,
    voloAndata: `${checkIn}, arrivo entro le ${ARRIVO_ENTRO}`,
    voloRitorno: partenzaRientroMin
      ? `${checkOut}, partenza non prima delle ${hhmm(partenzaRientroMin)}`
      : `${checkOut}, orario fine aula da confermare`,
    flags,
  };
}

function stampa(righe) {
  for (const r of righe) {
    console.log(`\n=== ${r.evento} — ${r.citta}`);
    console.log(`    Aula        : ${r.aula} (${r.giorniAula} ${r.giorniAula === 1 ? 'giorno' : 'giorni'})`);
    console.log(`    Check-in    : ${r.checkIn}`);
    console.log(`    Check-out   : ${r.checkOut}`);
    console.log(`    Notti       : ${r.notti}`);
    console.log(`    Volo andata : ${r.voloAndata}`);
    console.log(`    Volo ritorno: ${r.voloRitorno}`);
    if (r.flags.length) console.log(`    ⚠️  ${r.flags.join(', ')}`);
  }
  console.log('');
}

// ---- CLI ----
const argv = process.argv.slice(2);
const opt = (nome) => {
  const i = argv.indexOf(`--${nome}`);
  return i === -1 ? null : argv[i + 1];
};

let gruppi;
if (opt('date')) {
  const inizio = opt('date');
  const giorni = Number(opt('days') || 1);
  gruppi = [
    {
      titoli: [opt('evento') || 'Evento'],
      citta: opt('citta') || null,
      inizio,
      fine: addDays(inizio, giorni - 1),
      oraFine: opt('end') || null,
    },
  ];
} else {
  const file = argv.find((a) => !a.startsWith('--'));
  if (!file) {
    console.error('Uso: finestra-trasferta.mjs <eventi.json> | --date YYYY-MM-DD [--days N] [--end HH:MM] [--citta X]');
    process.exit(1);
  }
  const raw = JSON.parse(await (await import('node:fs/promises')).readFile(file, 'utf8'));
  const eventi = Array.isArray(raw) ? raw : raw.events || [];
  gruppi = raggruppa(eventi.filter(isAula).map(normalizza));
}

const righe = gruppi.map(finestra);
if (argv.includes('--json')) console.log(JSON.stringify(righe, null, 2));
else stampa(righe);
