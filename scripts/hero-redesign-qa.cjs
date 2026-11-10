/* Read-only homepage hero checks; uses the local frontend preview. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('puppeteer-core');

(async () => {
  fs.mkdirSync('artifacts', { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: process.env.BES_QA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
  });
  const results = [];
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => { errors.push(error.message); console.error('Browser error:', error.stack || error.message); });
    await page.setViewport({ width: 1440, height: 1000 });
    const response = await page.goto(process.env.BES_QA_URL || 'http://127.0.0.1:3100', { waitUntil: 'networkidle2', timeout: 120000 });
    assert.equal(response.status(), 200);
    await page.waitForSelector('.hero-photo');
    await page.waitForFunction(() => Object.keys(document.querySelector('.hero-visual')).some(key => key.startsWith('__reactProps')));
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.body.style.overflow = 'visible';
      document.body.style.height = 'auto';
      const scroll = document.querySelector('.inner_page');
      scroll.style.height = 'auto';
      scroll.style.maxHeight = 'none';
      scroll.style.overflow = 'visible';
    });

    for (const width of [1920, 1440, 1024, 900, 768, 767, 390, 320]) {
      await page.setViewport({ width, height: 1000 });
      const geometry = await page.evaluate(async () => {
        const image = document.querySelector('.hero-photo');
        await image.decode();
        const rect = selector => {
          const { x, y, width, height } = document.querySelector(selector).getBoundingClientRect();
          return { x, y, width, height };
        };
        return {
          viewport: innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          countdown: rect('.expo-countdown'), hero: rect('.home-hero'),
          countdownCopy: rect('.expo-countdown-copy'), register: rect('.expo-countdown-register'), timer: rect('.expo-countdown-display'),
          frame: rect('.hero-grid'), copy: rect('.hero-copy'), image: rect('.hero-visual'),
          arrows: [...document.querySelectorAll('.hero-slide-controls button')].map(button => {
            const { x, y, width, height } = button.getBoundingClientRect();
            return { x, y, width, height };
          }),
          loaded: image.naturalWidth > 0,
        };
      });
      assert.ok(geometry.loaded, 'Hero photo must load');
      assert.ok(geometry.documentWidth <= width + 1, `Overflow at ${width}px`);
      const { frame, copy, image } = geometry;
      const { countdownCopy, register, timer } = geometry;
      if (width >= 768) {
        assert.ok(countdownCopy.x + countdownCopy.width <= register.x && register.x + register.width <= timer.x, 'Register button must sit between event details and timer');
      } else {
        assert.ok(countdownCopy.y + countdownCopy.height <= register.y && register.y + register.height <= timer.y, 'Register button must sit between stacked details and timer');
      }
      assert.ok(register.height >= 44 && register.width >= 44, 'Registration link needs an accessible touch target');
      assert.ok(Math.abs(geometry.hero.y - geometry.countdown.y - geometry.countdown.height) < 1, 'Countdown and hero must touch with no gap');
      assert.ok(Math.abs(frame.y - geometry.hero.y) < 1, 'Hero frame must start without top spacing');
      assert.ok(copy.x >= frame.x && image.x + image.width <= frame.x + frame.width + 1);
      assert.ok(Math.abs(frame.width - width) < 2 && Math.abs(frame.x) < 2, 'Hero must span the full viewport width');
      if (width >= 900) {
        assert.ok(Math.abs(image.x - copy.x - copy.width - 16) < 2, 'Columns must have a 16px gap');
        assert.ok(Math.abs(copy.width - image.width) < 2, 'Columns must have equal widths');
        assert.ok(Math.abs(copy.y - image.y) < 2 && Math.abs(copy.height - image.height) < 2, 'Columns must align at top and bottom');
      } else assert.ok(Math.abs(image.y - copy.y - copy.height - 16) < 2, 'Stacked components must have a 16px gap');
      assert.equal(geometry.arrows.length, 2);
      for (const arrow of geometry.arrows) {
        assert.ok(arrow.x >= image.x && arrow.x + arrow.width <= image.x + image.width);
        assert.ok(arrow.y >= image.y && arrow.y + arrow.height <= image.y + image.height);
        assert.ok(arrow.width >= 44 && arrow.height >= 44);
      }
      results.push({ width, ...geometry });
      if ([1440, 390].includes(width)) {
        await (await page.$('.home-hero')).screenshot({ path: `artifacts/hero-redesign-${width}.png` });
        await (await page.$('.expo-countdown')).screenshot({ path: `artifacts/countdown-register-${width}.png` });
      }
    }

    await page.setViewport({ width: 1440, height: 1000 });
    console.log('Responsive geometry and image checks passed.');
    const photo = () => page.$eval('.hero-photo', image => image.getAttribute('src'));
    const first = await photo();
    await page.click('[aria-label="Next event photo"]');
    console.log('Clicked next photo.');
    await page.waitForFunction(src => document.querySelector('.hero-photo').getAttribute('src') !== src, {}, first);
    await page.click('[aria-label="Previous event photo"]');
    assert.equal(await photo(), first, 'Previous arrow returns to first photo');
    await page.focus('.hero-visual');
    await page.keyboard.press('ArrowLeft');
    await page.waitForFunction(src => document.querySelector('.hero-photo').getAttribute('src') !== src, {}, first);
    await page.keyboard.press('ArrowRight');
    assert.equal(await photo(), first, 'Keyboard navigation wraps around');
    await page.click('[aria-label="Show event photo 2"]');
    assert.notEqual(await photo(), first, 'Photo indicator changes slide');
    await page.click('[aria-label="Show event photo 1"]');
    console.log('Arrows, keyboard, and indicators passed.');

    await page.setViewport({ width: 390, height: 1000, isMobile: true, hasTouch: true });
    await page.waitForFunction(() => Object.keys(document.querySelector('.hero-visual')).some(key => key.startsWith('__reactProps')));
    await page.$eval('.hero-visual', element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const touch = await page.$eval('.hero-visual', element => {
      const r = element.getBoundingClientRect();
      return { x: r.x + r.width * .75, y: r.y + r.height * .4 };
    });
    const client = await page.target().createCDPSession();
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [touch] });
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: touch.x - 100, y: touch.y }] });
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    console.log('Dispatched mobile swipe.');
    await page.waitForFunction(src => document.querySelector('.hero-photo').getAttribute('src') !== src, {}, first);

    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const accessibility = await page.evaluate(() => axe.run({ include: [['.home-hero'], ['.expo-countdown']] }, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
    assert.deepEqual(accessibility.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), []);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    assert.equal(await page.$eval('.hero-photo', image => getComputedStyle(image).animationName), 'none');
    assert.ok(await page.$eval('.expo-countdown-register', link => getComputedStyle(link).transitionDuration.split(',').every(duration => parseFloat(duration) <= .001)), 'Register animation must be disabled or negligible with reduced motion');
    const registrationPath = await page.$eval('.expo-countdown-register', link => new URL(link.href).pathname);
    await page.click('.expo-countdown-register');
    await page.waitForFunction(path => location.pathname === path, {}, registrationPath);
    await page.waitForSelector('#main-content h1');
    assert.deepEqual(errors, []);
    fs.writeFileSync('artifacts/hero-redesign-qa.json', JSON.stringify({ results, registrationPath, registrationNavigation: 'passed', navigation: 'arrows, wraparound, keyboard, photo indicators, and touch swipe passed', accessibility: 'No WCAG A/AA violations in hero or countdown', reducedMotion: 'passed', runtimeErrors: errors }, null, 2));
    console.log('Hero and countdown QA passed at eight widths; Register button placement and navigation, carousel controls, reduced motion, and accessibility passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
