/**
 * /site.webmanifest — generato a build time così le icone portano la stessa versione (?v=…)
 * dei link nel <head>: Android e le app installate non restano sulla vecchia icona.
 */
import type { APIRoute } from 'astro';
import { clinica } from '@lib/clinica';
import { conVersione } from '@lib/versione-icone';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: clinica.nome,
        short_name: 'Clinica del bosco',
        description: 'Pronto soccorso veterinario 24 ore su 24 a Portici (Napoli).',
        lang: 'it',
        start_url: '/',
        display: 'browser',
        background_color: '#f5f7f4',
        theme_color: '#05262b',
        icons: [
          { src: conVersione('/favicon.svg'), sizes: 'any', type: 'image/svg+xml' },
          { src: conVersione('/icon-192.png'), sizes: '192x192', type: 'image/png' },
          { src: conVersione('/icon-512.png'), sizes: '512x512', type: 'image/png' },
          {
            src: conVersione('/icon-maskable-512.png'),
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } },
  );
