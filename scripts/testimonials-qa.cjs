const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewport({ width: 1440, height: 1000 });
    const response = await page.goto('http://127.0.0.1:3100', { waitUntil: 'networkidle2', timeout: 120000 });
    assert.equal(response.status(), 200);
    await page.waitForSelector('.testimonials-section');
    await page.waitForFunction(() => Object.keys(document.querySelector('.testimonial-cover')).some(key => key.startsWith('__reactProps')));
    await page.evaluate(() => {
      document.body.style.overflow = 'visible'; document.body.style.height = 'auto';
      Object.assign(document.querySelector('.inner_page').style, { height: 'auto', maxHeight: 'none', overflow: 'visible' });
    });
    const ids = ['BDtraVu50bw', '56OQ7arLGU8', 'bAULMpEPAPg', 'HP7kd92ldZI', '20YVPPAjVK0'];
    const urls = await page.$$eval('.testimonial-youtube', links => links.map(link => link.href));
    assert.equal(urls.length, 5);
    urls.forEach((url, index) => assert.equal(new URL(url).pathname, `/shorts/${ids[index]}`));
    assert.equal(await page.$$eval('.testimonial-video iframe', frames => frames.length), 0, 'Players only load on click');
    const layouts = [];
    for (const width of [1440, 1200, 1024, 768, 601, 600, 390, 320]) {
      await page.setViewport({ width, height: 1000 });
      await page.$eval('.testimonials-section', section => section.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForFunction(() => [...document.querySelectorAll('.testimonial-cover img')].every(img => img.complete && img.naturalWidth > 0), { timeout: 20000 });
      const layout = await page.evaluate(() => {
        const grid = document.querySelector('.testimonials-grid');
        return { width: innerWidth, documentWidth: document.documentElement.scrollWidth, scrollWidth: grid.scrollWidth, gridWidth: grid.clientWidth,
          cards: [...document.querySelectorAll('.testimonial-video')].map(card => { const r = card.getBoundingClientRect(); return { width: r.width, height: r.height }; }),
          thumbnails: [...document.querySelectorAll('.testimonial-cover img')].map(img => ({ loaded: img.naturalWidth > 0, visible: getComputedStyle(img).visibility !== 'hidden' })) };
      });
      assert.ok(layout.documentWidth <= width + 1, `No page overflow at ${width}px`);
      assert.ok(layout.cards.every(card => Math.abs(card.width / card.height - 9 / 16) < .01), 'Portrait video proportions');
      assert.ok(layout.cards.every(card => card.width >= 200), 'Video cards remain readable at every breakpoint');
      if (width <= 600) assert.ok(layout.scrollWidth > layout.gridWidth, 'All five cards available in mobile scroll row');
      layouts.push(layout);
      if ([1440, 390].includes(width)) await (await page.$('.testimonials-section')).screenshot({ path: `artifacts/testimonials-${width}.png` });
    }
    await page.setViewport({ width: 1440, height: 1000 });
    const players = [];
    const playbackChecks = [];
    for (const [index, id] of ids.entries()) {
      await page.click(`[aria-label="Play BES EXPO testimonial 0${index + 1}"]`);
      const sources = await page.$$eval('.testimonial-video iframe', frames => frames.map(frame => frame.src));
      assert.equal(sources.length, 1, 'Only one video plays at a time');
      assert.equal(new URL(sources[0]).pathname, `/embed/${id}`);
      assert.equal(new URL(sources[0]).hostname, 'www.youtube-nocookie.com');
      players.push(sources[0]);
      const iframe = await page.$('.testimonial-video iframe');
      const playerFrame = await iframe.contentFrame();
      await playerFrame.waitForFunction(() => document.querySelector('video')?.readyState >= 2, { timeout: 8000 }).catch(() => {});
      playbackChecks.push(await playerFrame.evaluate(() => ({ title: document.title, videoReadyState: document.querySelector('video')?.readyState ?? null, text: document.body?.innerText.slice(0, 400) })));
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    const frame = page.frames().find(frame => frame.url().includes('/embed/20YVPPAjVK0'));
    const playback = frame ? await frame.evaluate(() => ({ text: document.body?.innerText.slice(0, 600), videoReadyState: document.querySelector('video')?.readyState ?? null })).catch(error => ({ error: error.message })) : { status: 'Player frame unavailable' };
    await page.click('[aria-label="Stop BES EXPO testimonial 05"]');
    assert.equal(await page.$$eval('.testimonial-video iframe', frames => frames.length), 0);
    await page.focus('[aria-label="Play BES EXPO testimonial 01"]');
    await page.keyboard.press('Enter');
    assert.equal(await page.$$eval('.testimonial-video iframe', frames => frames.length), 1, 'Keyboard starts playback');
    await page.click('[aria-label="Stop BES EXPO testimonial 01"]');
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const accessibility = await page.evaluate(() => axe.run(document.querySelector('.testimonials-section'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
    const violations = accessibility.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) }));
    assert.deepEqual(violations, []);
    assert.deepEqual(errors, []);
    fs.writeFileSync('artifacts/testimonials-qa.json', JSON.stringify({ layouts, urls, players, playbackChecks, playback, violations, errors }, null, 2));
    console.log(JSON.stringify({ status: 'Passed responsive layouts, all five links and embed URLs, single-player switching, stop, keyboard and accessibility checks', playbackChecks }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
