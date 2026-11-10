const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.BES_QA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const results = [];
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewport({ width: 1440, height: 1000 });
    const response = await page.goto(process.env.BES_QA_URL || 'http://127.0.0.1:3100', { waitUntil: 'networkidle2', timeout: 120000 });
    assert.equal(response.status(), 200);
    await page.waitForSelector('.event-memory-card');
    await page.waitForFunction(() => Object.keys(document.querySelector('.event-memories')).some(key => key.startsWith('__reactProps')));
    // Expand the site's scrolling shell for predictable element screenshots.
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.body.style.overflow = 'visible';
      document.body.style.height = 'auto';
      const shell = document.querySelector('.inner_page');
      if (shell) Object.assign(shell.style, { height: 'auto', maxHeight: 'none', overflow: 'visible' });
    });
    const active = () => page.$eval('.event-memory-card[data-active="true"]', card => card.getAttribute('aria-label'));
    // Pause during layout and control checks.
    await page.click('[aria-label="Pause photo rotation"]');
    for (const width of [1920, 1440, 1024, 768, 600, 390, 320]) {
      await page.setViewport({ width, height: 1000 });
      await page.$eval('.event-memories', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      const geometry = await page.evaluate(async () => {
        const cards = [...document.querySelectorAll('.event-memory-card')];
        await Promise.all(cards.map(card => card.querySelector('img').decode()));
        const card = document.querySelector('.event-memory-card[data-active="true"]');
        const rect = card.getBoundingClientRect();
        return { width: innerWidth, documentWidth: document.documentElement.scrollWidth, card: { x: rect.x, width: rect.width }, loaded: cards.every(card => card.querySelector('img').naturalWidth > 0), count: cards.length, images: cards.map(card => card.querySelector('img').getAttribute('src')), link: document.querySelector('.event-memory-gallery').getAttribute('href') };
      });
      assert.ok(geometry.documentWidth <= width + 1, `No page overflow at ${width}px`);
      assert.ok(geometry.loaded, 'All six event photographs load');
      assert.equal(geometry.count, 6);
      assert.ok(Math.abs(geometry.card.x + geometry.card.width / 2 - width / 2) < 2, 'Featured card is centred');
      assert.ok(geometry.card.x > 0 && geometry.card.x + geometry.card.width < width, 'Featured card fits viewport');
      assert.ok(geometry.images.every(src => decodeURIComponent(src).includes('/Images/ImageGallery/2026/')));
      assert.equal(geometry.link, '/galleries/pictures?selectedValue=2026');
      const controls = await page.$$eval('.event-memory-arrow, .event-memory-play', buttons => buttons.map(button => ({ width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height })));
      assert.ok(controls.every(button => button.width >= 44 && button.height >= 44), `Navigation targets stay 44px at ${width}px`);
      results.push(geometry);
      if ([1440, 390].includes(width)) await (await page.$('.event-memories')).screenshot({ path: `artifacts/event-memories-${width}.png` });
    }
    await page.setViewport({ width: 1440, height: 1000 });
    const first = await active();
    await page.click('[aria-label="Next memory"]');
    assert.notEqual(await active(), first);
    await page.click('[aria-label="Previous memory"]');
    assert.equal(await active(), first);
    await page.focus('.event-memory-card[data-active="true"]');
    await page.keyboard.press('ArrowLeft');
    assert.match(await active(), /photo 6:/);
    await page.keyboard.press('ArrowRight');
    assert.equal(await active(), first);
    await page.click('[aria-label^="Go to memory 3:"]');
    assert.match(await active(), /photo 3:/);
    await page.$eval('[aria-label^="Show photo 4:"]', el => el.click());
    assert.match(await active(), /photo 4:/);
    await page.click('[aria-label^="Go to memory 1:"]');

    await page.setViewport({ width: 390, height: 1000, isMobile: true, hasTouch: true });
    await page.$eval('.event-memories-stage', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const touch = await page.$eval('.event-memory-card[data-active="true"]', el => {
      const r = el.getBoundingClientRect(); return { x: r.x + r.width * .75, y: r.y + r.height * .4 };
    });
    const client = await page.target().createCDPSession();
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [touch] });
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: touch.x - 90, y: touch.y }] });
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForFunction(() => document.querySelector('.event-memory-card[data-active="true"]').getAttribute('aria-label').includes('photo 2:'));

    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const accessibility = await page.evaluate(() => axe.run(document.querySelector('.event-memories'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
    assert.deepEqual(accessibility.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), []);

    await page.setViewport({ width: 1440, height: 1000 });
    // Changing mobile emulation reloads the page; wait for hydration and its default running state.
    await page.waitForSelector('[aria-label="Pause photo rotation"]');
    await page.evaluate(() => document.activeElement.blur());
    await page.$eval('.event-memories', el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.mouse.move(0, 0);
    const beforeAuto = await active();
    await page.waitForFunction(previous => document.querySelector('.event-memory-card[data-active="true"]').getAttribute('aria-label') !== previous, { timeout: 7000 }, beforeAuto);
    await page.hover('.event-memory-card[data-active="true"]');
    const hovered = await active();
    await new Promise(resolve => setTimeout(resolve, 4800));
    assert.equal(await active(), hovered, 'Hover pauses rotation');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.mouse.move(0, 0);
    await page.waitForSelector('.event-memory-play:disabled');
    const reduced = await active();
    await new Promise(resolve => setTimeout(resolve, 4800));
    assert.equal(await active(), reduced, 'Reduced motion disables automatic rotation');
    assert.ok(await page.$eval('.event-memory-card', el => getComputedStyle(el).transitionDuration.split(',').every(duration => parseFloat(duration) <= .001)), 'Reduced motion makes transitions immediate');
    await page.click('[aria-label="Next memory"]');
    assert.notEqual(await active(), reduced, 'Manual controls still work with reduced motion');
    assert.deepEqual(errors, []);
    fs.writeFileSync('artifacts/event-memories-qa.json', JSON.stringify({ results, controls: 'arrows, dots, cards, keyboard wraparound, touch swipe', autoplay: 'advances; hover pauses', reducedMotion: 'no transitions or automatic rotation; manual controls work', accessibilityViolations: [], errors }, null, 2));
    console.log('Event photo carousel passed responsive, image, controls, swipe, autoplay, reduced-motion and accessibility checks.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
