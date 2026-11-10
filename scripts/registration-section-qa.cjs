/* Read-only layout, accessibility, and navigation checks for homepage registration. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.BES_QA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  try {
    const page = await browser.newPage();
    const base = process.env.BES_QA_URL || 'http://127.0.0.1:3100';
    const results = [];
    await page.setViewport({ width: 1440, height: 1000 });
    const response = await page.goto(base, { waitUntil: 'networkidle2', timeout: 120000 });
    assert.equal(response.status(), 200);
    await page.waitForSelector('.header-account button');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.registration-buttons')).display === 'grid');
    await page.evaluate(() => {
      document.body.style.height = 'auto'; document.body.style.overflow = 'visible';
      const scroll = document.querySelector('.inner_page');
      scroll.style.height = 'auto'; scroll.style.maxHeight = 'none'; scroll.style.overflow = 'visible';
    });
    const expected = [
      { label: 'Register as a Visitor', href: '/registrationform/visitor' },
      { label: 'Register as a Delegate', href: '/registrationform/delegateregistration' },
      { label: 'Book Exhibition Space', href: '/event_conference/bes_expo/exibition/participation_fee' },
    ];
    fs.mkdirSync('artifacts', { recursive: true });
    for (const width of [1920, 1440, 1024, 900, 768, 767, 390, 320]) {
      await page.setViewport({ width, height: 1000 });
      await page.$eval('.registration-section', section => section.scrollIntoView({ behavior: 'instant' }));
      const geometry = await page.evaluate(() => {
        const section = document.querySelector('.registration-section');
        const rect = element => { const { x, y, width, height } = element.getBoundingClientRect(); return { x, y, width, height }; };
        return {
          width: innerWidth, documentWidth: document.documentElement.scrollWidth,
          directlyAfterNews: section.previousElementSibling.classList.contains('announcement-bar'),
          section: rect(section), news: rect(section.previousElementSibling),
          buttons: [...section.querySelectorAll('a')].map(link => ({ ...rect(link), label: link.textContent.trim(), href: link.getAttribute('href'), contentWidth: link.scrollWidth, clientWidth: link.clientWidth })),
        };
      });
      assert.equal(geometry.directlyAfterNews, true);
      assert.ok(Math.abs(geometry.section.y - geometry.news.y - geometry.news.height) < 1);
      assert.equal(geometry.buttons.length, 3);
      assert.ok(geometry.documentWidth <= width + 1, `Overflow at ${width}px`);
      const first = geometry.buttons[0];
      geometry.buttons.forEach((button, index) => {
        assert.equal(button.label, expected[index].label);
        assert.equal(button.href, expected[index].href);
        assert.ok(button.height >= 44 && button.width >= 44);
        assert.ok(button.contentWidth <= button.clientWidth + 1, 'Button label must fit');
        assert.ok(Math.abs(button.width - first.width) < 1 && Math.abs(button.height - first.height) < 1);
        if (width >= 768) assert.ok(Math.abs(button.y - first.y) < 1, 'Desktop buttons must align in one row');
        else if (index) assert.ok(button.y >= geometry.buttons[index - 1].y + geometry.buttons[index - 1].height + 11, 'Mobile buttons must stack with spacing');
      });
      results.push(geometry);
      if ([1440, 390].includes(width)) await (await page.$('.registration-section')).screenshot({ path: `artifacts/registration-section-${width}.png` });
    }
    await page.focus('.registration-button-visitor');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Register as a Delegate');
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const audit = await page.evaluate(() => axe.run('.registration-section', { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
    assert.deepEqual(audit.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), []);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    assert.equal(await page.$eval('.registration-button', button => getComputedStyle(button).transform), 'none');
    const navigation = [];
    for (const link of expected) {
      await page.goto(base, { waitUntil: 'networkidle2' });
      await page.click(`.registration-buttons a[href="${link.href}"]`);
      await page.waitForFunction(path => location.pathname === path, { timeout: 60000 }, link.href);
      await page.waitForSelector('#main-content h1', { timeout: 60000 });
      navigation.push({ ...link, navigated: true });
    }
    fs.writeFileSync('artifacts/registration-section-qa.json', JSON.stringify({ results, navigation, keyboard: 'passed', reducedMotion: 'passed', accessibility: 'No WCAG A/AA violations' }, null, 2));
    console.log('Registration section passed: directly below News, three equal buttons, eight screen widths, keyboard access, accessibility, reduced motion, and navigation to all three destinations.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
