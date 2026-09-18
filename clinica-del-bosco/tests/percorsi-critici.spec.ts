import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import clinica from '../src/data/clinica.json' with { type: 'json' };

const tel = `tel:${clinica.contatti.telefono.e164}`;

// Scroll smooth disattivato: rende instabili i click di Playwright (il sito rispetta prefers-reduced-motion)
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test.describe('Percorso urgenza', () => {
  test('la home permette di chiamare subito', async ({ page }) => {
    await page.goto('/');
    const chiama = page.locator(`a[href="${tel}"]:visible`).first();
    await expect(chiama).toBeVisible();
    await expect(page.locator('.badge-aperto__testo').first()).toContainText(/Aperto ora/);
  });

  test('/pronto-soccorso: CTA chiama sopra la piega e senza "chiuso"', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/pronto-soccorso');
    const cta = page.getByRole('link', { name: /Chiama ora il pronto soccorso/ });
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    const viewport = page.viewportSize()!;
    expect(box, 'CTA presente').not.toBeNull();
    expect(box!.y + box!.height, 'CTA entro la piega').toBeLessThanOrEqual(viewport.height);
    expect(box!.height, 'altezza minima 56px').toBeGreaterThanOrEqual(56);
    if (isMobile)
      expect(box!.width, 'piena larghezza su mobile').toBeGreaterThan(viewport.width * 0.8);
    await expect(page.locator('main')).not.toContainText(/chius[oa] ora/i);
    await expect(page.locator('#blocco-urinario')).toBeVisible();
  });

  test('barra sticky mobile con Chiama e Indicazioni', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'solo mobile');
    await page.goto('/servizi/chirurgia');
    const barra = page.getByRole('navigation', { name: 'Contatti rapidi' });
    await expect(barra).toBeVisible();
    await expect(barra.locator(`a[href="${tel}"]`)).toBeVisible();
    await expect(barra.getByRole('link', { name: /Indicazioni/ })).toBeVisible();
  });
});

test.describe('Percorso prenotazione', () => {
  test("form multi-step completo fino all'invio", async ({ page }) => {
    await page.goto('/prenota');
    await page.locator('label.scelta', { hasText: 'Cane' }).click();
    await page.getByLabel('Come si chiama?').fill('Luna');
    await page.getByLabel('Quanti anni ha?').selectOption('4-7');
    await page.getByRole('button', { name: 'Continua' }).click();
    await expect(page.getByText('Di cosa hai bisogno?')).toBeVisible();
    await page.getByLabel('Visita generale o controllo').check();
    await page.getByRole('button', { name: 'Continua' }).click();
    await page.locator('label.scelta', { hasText: 'Mattina' }).click();
    const domani = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
    await page.getByLabel('Prima data preferita').fill(domani);
    await page.getByRole('button', { name: 'Continua' }).click();
    await page.getByLabel('Nome e cognome').fill('Maria Rossi');
    await page.getByLabel('Telefono').fill('333 1234567');
    await page.getByLabel(/Ho letto l'informativa/).check();
    await expect(page.getByLabel(/Acconsento a ricevere promemoria/)).not.toBeChecked();
    // Intercetta il POST (Netlify Forms non esiste in preview) e simula il redirect
    await page.route('**/prenota/grazie', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Richiesta ricevuta</h1>' }),
    );
    await page.getByRole('button', { name: 'Invia la richiesta' }).click();
    await expect(page.locator('h1')).toContainText('Richiesta ricevuta');
  });

  test('scegliere "è un\'urgenza" mostra il numero e blocca il form', async ({ page }) => {
    await page.goto('/prenota');
    await page.locator('label.scelta', { hasText: 'Gatto' }).click();
    await page.getByLabel('Come si chiama?').fill('Micio');
    await page.getByLabel('Quanti anni ha?').selectOption('1-3');
    await page.getByRole('button', { name: 'Continua' }).click();
    await page.locator('input[name="motivo"][value="urgenza"]').check();
    await expect(page.locator('.pannello-urgenza')).toBeVisible();
    await expect(page.locator(`.pannello-urgenza a[href="${tel}"]`)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continua' })).toBeHidden();
  });

  test('la validazione inline blocca il passo con errori', async ({ page }) => {
    await page.goto('/prenota');
    await page.getByRole('button', { name: 'Continua' }).click();
    await expect(
      page.getByRole('alert').filter({ hasText: 'Scegli il tipo di animale' }),
    ).toBeVisible();
    await expect(page.getByText('Di cosa hai bisogno?')).toBeHidden();
  });
});

test.describe('Percorso colleghi', () => {
  test('in 2 click dalla home al modulo di invio caso', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) await page.getByRole('button', { name: 'Apri il menu' }).click();
    await page.getByRole('link', { name: 'Per i colleghi' }).first().click();
    await page.getByRole('link', { name: 'Vai al modulo' }).click();
    await expect(page.getByLabel('Medico referente')).toBeInViewport();
    await expect(page.getByText('Il paziente torna sempre al collega inviante.')).toBeVisible();
    await expect(page.getByRole('link', { name: /Modulo richiesta convenzione/ })).toHaveAttribute(
      'href',
      /\.pdf$/,
    );
  });
});

test.describe('Accessibilità e tastiera', () => {
  for (const url of ['/', '/pronto-soccorso', '/prenota', '/servizi/chirurgia', '/piani-salute']) {
    test(`axe senza violazioni su ${url}`, async ({ page }) => {
      await page.goto(url);
      const risultati = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(risultati.violations, JSON.stringify(risultati.violations, null, 2)).toEqual([]);
    });
  }

  test('skip link e navigazione da tastiera in home', async ({ page, isMobile }) => {
    test.skip(isMobile, 'tastiera su desktop');
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Vai al contenuto' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#contenuto')).toBeFocused();
  });

  test('un solo H1 e lang="it" su ogni pagina campione', async ({ page }) => {
    for (const url of [
      '/',
      '/pronto-soccorso',
      '/servizi/chirurgia',
      '/magazine/colpo-di-calore-nel-cane-e-nel-gatto',
    ]) {
      await page.goto(url);
      expect(await page.locator('h1').count(), url).toBe(1);
      expect(await page.locator('html').getAttribute('lang')).toBe('it');
    }
  });
});

test.describe('Marchio e stili', () => {
  test('dopo una navigazione lato client la pagina resta formattata', async ({ page }) => {
    // Regressione: con il CSS inline la CSP nativa di Astro calcola un hash per
    // pagina, ma dopo una navigazione del ClientRouter resta in vigore la CSP del
    // documento iniziale. Il browser rifiutava gli stili della pagina di arrivo e
    // il sito si presentava senza formattazione. Vedi astro.config.mjs.
    const rifiuti: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error' && /Refused to apply inline style/.test(m.text())) {
        rifiuti.push(m.text());
      }
    });

    await page.goto('/');
    const sfondoIniziale = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    expect(sfondoIniziale).not.toBe('rgba(0, 0, 0, 0)');

    // Il piede pagina espone gli stessi link a ogni larghezza: su mobile la
    // navigazione della testata è dentro il menu a scomparsa.
    for (const href of ['/la-struttura', '/contatti', '/equipe']) {
      const link = page.locator(`footer a[href="${href}"]`).first();
      await link.scrollIntoViewIfNeeded();
      await link.click();
      await page.waitForURL(new RegExp(`${href}/?$`));
      await expect
        .poll(() => page.evaluate(() => document.styleSheets.length), { timeout: 5000 })
        .toBeGreaterThan(0);
      const sfondo = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(sfondo, `sfondo del body dopo la navigazione a ${href}`).toBe(sfondoIniziale);
    }
    expect(rifiuti, 'la CSP non deve rifiutare gli stili').toEqual([]);
  });

  test('il marchio ufficiale è quello del kit e rispetta la misura minima', async ({ page }) => {
    await page.goto('/');
    // Lo sprite definisce il lockup una volta sola; header e piede lo richiamano.
    await expect(page.locator('#marchio-lockup')).toHaveCount(1);
    const logo = page.locator('header a[href="/"] svg').first();
    const box = await logo.boundingBox();
    // Il kit non ammette il lockup sotto i 140 px di larghezza.
    expect(box!.width).toBeGreaterThanOrEqual(140);
  });
});

test.describe('Modulo di prenotazione', () => {
  // Invariante: o il modulo va a passi (e allora c'è "Continua"), oppure si
  // vede tutto in una schermata (e allora c'è "Invia la richiesta"). Lo stato
  // intermedio — tutto visibile ma senza modo di inviare — lasciava il
  // visitatore bloccato senza capire perché.
  for (const conJs of [true, false]) {
    test(`con JavaScript ${conJs ? 'attivo' : 'spento'} si può sempre arrivare a inviare`, async ({
      browser,
    }) => {
      const contesto = await browser.newContext({ javaScriptEnabled: conJs });
      const pagina = await contesto.newPage();
      await pagina.goto('/prenota');

      const passiVisibili = await pagina.evaluate(
        () =>
          [...document.querySelectorAll('.passo')].filter(
            (f) => (f as HTMLElement).offsetParent !== null,
          ).length,
      );
      const continuaNascosto = await pagina.locator('.avanti').isHidden();
      const inviaNascosto = await pagina.locator('.invia').isHidden();

      if (passiVisibili > 1) {
        // Tutto in una schermata: deve esserci il pulsante di invio.
        expect(inviaNascosto, 'con tutti i passi a schermo serve il pulsante di invio').toBe(false);
      } else {
        // A passi: deve esserci "Continua".
        expect(continuaNascosto, 'con un passo alla volta serve "Continua"').toBe(false);
      }
      await contesto.close();
    });
  }

  test('senza JavaScript la richiesta si invia direttamente', async ({ browser }) => {
    // `reducedMotion` spegne lo scroll morbido: il modulo è lungo e Playwright,
    // mentre la pagina sta ancora scorrendo, considera i campi "non stabili".
    // Non cambia nulla del comportamento in prova, solo il modo di raggiungerli.
    const contesto = await browser.newContext({
      javaScriptEnabled: false,
      reducedMotion: 'reduce',
    });
    const pagina = await contesto.newPage();
    await pagina.goto('/prenota');
    await pagina.locator('label.scelta').filter({ hasText: 'Cane' }).first().click();
    await pagina.getByLabel('Come si chiama?').fill('Luna');
    await pagina.getByLabel('Quanti anni ha?').selectOption('4-7');
    await pagina
      .locator('.passo[data-passo="2"] label')
      .filter({ hasText: 'Vaccinazione o antiparassitari' })
      .first()
      .click();
    await pagina
      .locator('.passo[data-passo="3"] label')
      .filter({ hasText: 'Mattina' })
      .first()
      .click();
    await pagina
      .locator('input[name="data-1"]')
      .fill(new Date(Date.now() + 86_400_000).toISOString().slice(0, 10));
    await pagina.getByLabel('Nome e cognome').fill('Maria Rossi');
    await pagina.getByLabel('Telefono').fill('333 1234567');
    await pagina.getByLabel(/Ho letto l'informativa/).check();
    // I campi facoltativi restano vuoti: non devono impedire l'invio.
    await pagina.route('**/prenota/grazie', (r) =>
      r.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Richiesta ricevuta</h1>' }),
    );
    // Su mobile la barra fissa in basso occupa l'ultima fascia dello schermo:
    // si scorre a fondo pagina (il body ha il padding che le lascia spazio)
    // prima di premere, come farebbe chi compila davvero.
    await pagina.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await pagina.locator('.invia').click();
    await expect(pagina.locator('h1')).toContainText('Richiesta ricevuta');
    await contesto.close();
  });

  test('con tutti i dati inseriti si invia senza ripassare dai passi', async ({ page }) => {
    await page.goto('/prenota');
    const invia = page.locator('.invia');
    const continua = page.getByRole('button', { name: 'Continua' });

    // Passo 1: l'invio non c'è ancora, mancano i dati dei passi successivi.
    await page.locator('label.scelta').filter({ hasText: 'Cane' }).first().click();
    await page.getByLabel('Come si chiama?').fill('Luna');
    await page.getByLabel('Quanti anni ha?').selectOption('4-7');
    await expect(invia).toBeHidden();
    await continua.click();

    await page
      .locator('.passo[data-passo="2"] label')
      .filter({ hasText: 'Vaccinazione o antiparassitari' })
      .first()
      .click();
    await continua.click();

    await page
      .locator('.passo[data-passo="3"] label')
      .filter({ hasText: 'Mattina' })
      .first()
      .click();
    await page
      .locator('input[name="data-1"]')
      .fill(new Date(Date.now() + 86_400_000).toISOString().slice(0, 10));
    await continua.click();

    await page.getByLabel('Nome e cognome').fill('Maria Rossi');
    await page.getByLabel('Telefono').fill('333 1234567');
    await page.getByLabel(/Ho letto l'informativa/).check();
    await expect(invia).toBeVisible();

    // Tornando indietro i dati restano completi: l'invio deve restare a
    // disposizione, senza costringere a rifare tutta la procedura.
    await page.getByRole('button', { name: 'Indietro' }).click();
    await expect(invia).toBeVisible();
    await page.route('**/prenota/grazie', (r) =>
      r.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Richiesta ricevuta</h1>' }),
    );
    await invia.click();
    await expect(page.locator('h1')).toContainText('Richiesta ricevuta');
  });

  test('quando manca un campo il messaggio dice quale', async ({ page }) => {
    await page.goto('/prenota');
    await page.getByRole('button', { name: 'Continua' }).click();
    await expect(page.locator('.stato')).toContainText(/Scegli il tipo di animale/i);
  });
});

test.describe('Assistente del sito', () => {
  test('si apre, cerca nei contenuti del sito e si chiude con Escape', async ({ page }) => {
    const rifiuti: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error' && /Refused to|Content Security Policy/.test(m.text())) {
        rifiuti.push(m.text());
      }
    });

    await page.goto('/');
    const avvio = page.locator('[data-assistente-avvio]');
    await expect(avvio).toHaveAttribute('aria-expanded', 'false');
    await avvio.click();

    const pannello = page.locator('[data-assistente-pannello]');
    await expect(pannello).toBeVisible();
    await expect(avvio).toHaveAttribute('aria-expanded', 'true');

    // Il numero delle urgenze è sempre in vista, con il richiamo all'uso corretto.
    await expect(pannello.getByText(/solo per le vere urgenze/i)).toBeVisible();

    // Ricerca libera sui contenuti reali.
    await page.fill('[data-assistente-input]', 'tac');
    await expect(page.locator('.assistente-risposta').first()).toBeVisible();
    const primo = page.locator('.assistente-risposta').first();
    await expect(primo).toHaveAttribute('href', /.+/);

    // Le scorciatoie lasciano il posto alle risposte.
    await expect(page.locator('[data-assistente-scorciatoie]')).toBeHidden();

    // Una domanda che sembra urgente porta al telefono, non a una valutazione clinica.
    await page.fill('[data-assistente-input]', 'il mio cane sanguina');
    await expect(page.getByText(/chiama, risponde un medico a qualsiasi ora/i)).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(pannello).toBeHidden();
    expect(rifiuti, 'la CSP non deve bloccare nulla').toEqual([]);
  });

  test('senza JavaScript il pulsante porta alle domande frequenti', async ({ browser }) => {
    const contesto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contesto.newPage();
    await pagina.goto('/');
    await expect(pagina.locator('[data-assistente-avvio]')).toHaveAttribute(
      'href',
      '/domande-frequenti',
    );
    await contesto.close();
  });
});

test.describe('SEO e GEO', () => {
  test('JSON-LD valido e canonical coerente', async ({ page }) => {
    await page.goto('/pronto-soccorso');
    const blocchi = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocchi.length).toBeGreaterThanOrEqual(1);
    const tipi = blocchi
      .flatMap((b) => {
        const j = JSON.parse(b);
        return Array.isArray(j) ? j.map((x) => x['@type']) : [j['@type']];
      })
      .flat();
    expect(tipi).toContain('EmergencyService');
    expect(tipi).toContain('FAQPage');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${clinica.dominio.canonico}/pronto-soccorso`,
    );
  });

  test('llms.txt e robots.txt raggiungibili', async ({ request }) => {
    const llms = await request.get('/llms.txt');
    expect(llms.ok()).toBeTruthy();
    expect(await llms.text()).toContain(clinica.nome);
    const robots = await request.get('/robots.txt');
    expect(await robots.text()).toContain('GPTBot');
  });
});
