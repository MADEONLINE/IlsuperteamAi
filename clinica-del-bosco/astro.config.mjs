// @ts-check
import { defineConfig } from 'astro/config';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import clinica from './src/data/clinica.json' with { type: 'json' };

/**
 * Configurazione Astro — Clinica Veterinaria del Bosco.
 * Ogni scelta è motivata nel README (§ "Decisioni tecniche").
 */
export default defineConfig({
  // Dominio canonico unico (vedi redirects.map e TODO-DATI.md).
  site: clinica.dominio.canonico,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file', // /servizi/chirurgia.html → URL /servizi/chirurgia (senza slash finale)
    inlineStylesheets: 'always', // CSS critico inline: una richiesta in meno sul percorso LCP
  },
  compressHTML: true,
  markdown: {
    // Nessun blocco di codice nei contenuti: disattivato per evitare stili inline incompatibili con la CSP.
    syntaxHighlight: false,
  },
  // Prefetch disattivato: la catena page.js → prefetch.js aggiungeva un round trip nel grafo LCP
  // simulato da Lighthouse; il ClientRouter mantiene comunque le transizioni di vista.
  prefetch: false,
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    responsiveStyles: true,
    layout: 'constrained',
  },
  security: {
    // CSP con hash degli script e degli stili inline, generata da Astro ad ogni build.
    // Gli header HTTP (netlify.toml / vercel.json) aggiungono frame-ancestors e le altre direttive.
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://plausible.io",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: {
        resources: ["'self'", 'https://plausible.io'],
      },
      styleDirective: {
        resources: ["'self'"],
      },
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(grazie|404)$/.test(page),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        // Priorità più alta per le pagine commercialmente critiche.
        if (
          /\/(pronto-soccorso|prenota|piani-salute)$/.test(item.url) ||
          item.url === `${clinica.dominio.canonico}/`
        ) {
          item.priority = 1.0;
          item.changefreq = ChangeFreqEnum.DAILY;
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
