/**
 * Lighthouse CI — budget fallimentare (mobile, 4G simulato) sulle 4 pagine campione.
 * Eseguire dopo il build: npx lhci autorun
 */
module.exports = {
  ci: {
    collect: {
      // Server statico con brotli (come Netlify/Vercel): misure di trasferimento realistiche.
      startServerCommand: 'node scripts/serve-dist.mjs 4173',
      startServerReadyPattern: 'servito su',
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/pronto-soccorso',
        'http://localhost:4173/servizi/chirurgia',
        'http://localhost:4173/magazine/colpo-di-calore-nel-cane-e-nel-gatto',
      ],
      numberOfRuns: 2,
      settings: {
        preset: 'perf',
        formFactor: 'mobile',
        throttlingMethod: 'simulate',
        throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 },
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          disabled: false,
        },
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        chromeFlags: '--no-sandbox --headless=new --disable-gpu --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.98 }],
        'categories:accessibility': ['error', { minScore: 0.98 }],
        'categories:best-practices': ['error', { minScore: 0.98 }],
        'categories:seo': ['error', { minScore: 0.98 }],
        // 1800 ms era tarato su una configurazione che metteva il CSS in linea in
        // ogni pagina: veloce, ma con la CSP nativa rendeva il sito illeggibile
        // dopo ogni navigazione interna (vedi astro.config.mjs). Con il foglio di
        // stile esterno il primo caricamento paga un giro di rete in più — circa
        // 300 ms secondo Lighthouse — mentre dalla seconda pagina in poi il CSS
        // è in cache. Soglia riportata alla misura reale dell'architettura
        // corretta, comunque molto dentro la fascia "buona" di Google (2500 ms).
        // Il punteggio di prestazioni resta a 100 ed è il vero guardiano qui.
        'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 92160 }],
        'resource-summary:font:size': ['error', { maxNumericValue: 122880 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/report' },
  },
};
