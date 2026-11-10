/* Read-only checks for the six-card supporter row. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.BES_QA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  fs.mkdirSync('artifacts', { recursive: true });
  const results = [];
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewport({ width: 1440, height: 1000 });
    const response = await page.goto(process.env.BES_QA_URL || 'http://127.0.0.1:3100', { waitUntil: 'networkidle2', timeout: 120000 });
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => !!document.querySelector('.header-account button'));
    await page.evaluate(() => {
      document.body.style.overflow = 'visible';
      document.body.style.height = 'auto';
      const container = document.querySelector('.inner_page');
      container.style.height = 'auto';
      container.style.maxHeight = 'none';
      container.style.overflow = 'visible';
    });
    for (const width of [1920, 1440, 1280, 1024, 768, 390, 320]) {
      await page.setViewport({ width, height: 1000 });
      await page.$eval('.partners-section', element => element.scrollIntoView({ behavior: 'instant' }));
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.querySelectorAll('.partner-logo img')].map(image => image.decode()));
        document.querySelector('.partners-row').scrollLeft = 0;
      });
      const geometry = await page.evaluate(() => {
        const row = document.querySelector('.partners-row');
        const rect = element => { const { x, y, width, height } = element.getBoundingClientRect(); return { x, y, width, height }; };
        return {
          width: innerWidth, documentWidth: document.documentElement.scrollWidth,
          row: rect(row), scrollWidth: row.scrollWidth, clientWidth: row.clientWidth,
          cards: [...row.querySelectorAll('.partner-card')].map(card => ({ ...rect(card), backdrop: getComputedStyle(card).backdropFilter, caption: rect(card.querySelector('.partner-caption')), loaded: card.querySelector('img').naturalWidth > 0 })),
          links: [...row.querySelectorAll('a')].map(link => link.getAttribute('href')),
        };
      });
      assert.equal(geometry.cards.length, 6);
      assert.equal(geometry.links.length, 5);
      assert.ok(geometry.documentWidth <= width + 1, `Page overflow at ${width}px`);
      const first = geometry.cards[0];
      for (const card of geometry.cards) {
        assert.ok(card.loaded);
        assert.ok(Math.abs(card.y - first.y) < 1, 'All six cards must remain in one row');
        assert.ok(Math.abs(card.width - first.width) < 1 && Math.abs(card.height - first.height) < 1, 'Card dimensions must match');
        assert.ok(card.caption.y + card.caption.height <= card.y + card.height + 1, 'Names must fit inside cards');
        assert.ok(card.backdrop.includes('blur'), 'Glass blur must be active');
      }
      if (width >= 1024) assert.ok(geometry.scrollWidth <= geometry.clientWidth + 2, 'All six cards must fit on desktop');
      else {
        assert.ok(geometry.scrollWidth > geometry.clientWidth, 'Narrow screens must scroll horizontally');
        await page.$eval('.partners-row', row => { row.scrollLeft = row.scrollWidth; });
        await page.waitForFunction(() => {
          const row = document.querySelector('.partners-row');
          const card = row.lastElementChild.getBoundingClientRect();
          const bounds = row.getBoundingClientRect();
          return card.right <= bounds.right + 2;
        });
        await page.$eval('.partners-row', row => { row.scrollLeft = 0; });
      }
      results.push(geometry);
      if ([1440, 390].includes(width)) await (await page.$('.partners-section')).screenshot({ path: `artifacts/supporters-glass-${width}.png` });
    }
    await page.setViewport({ width: 1440, height: 1000 });
    await page.$eval('.partners-section', element => element.scrollIntoView({ behavior: 'instant' }));
    const original = await page.$eval('.partner-card', card => getComputedStyle(card).transform);
    await page.hover('.partner-card');
    await page.waitForFunction(transform => getComputedStyle(document.querySelector('.partner-card')).transform !== transform, {}, original);
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const audit = await page.evaluate(() => axe.run('.partners-section', { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
    assert.deepEqual(audit.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), []);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    assert.equal(await page.$eval('.partner-card', card => getComputedStyle(card).transform), 'none');
    assert.deepEqual(errors, []);
    fs.writeFileSync('artifacts/supporters-glass-qa.json', JSON.stringify({ results, hover: 'passed', reducedMotion: 'passed', accessibility: 'No WCAG A/AA violations', runtimeErrors: errors }, null, 2));
    console.log('Supporter QA passed at seven widths: six aligned equal-size cards, desktop fit, mobile scroll, loaded logos, glass blur, hover, reduced motion, and accessibility.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
