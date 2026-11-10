/* Read-only verification of the direct desktop and mobile membership links. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.BES_QA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  try {
    const page = await browser.newPage();
    const base = process.env.BES_QA_URL || 'http://127.0.0.1:3100';
    const target = '/about_bes/membership';
    const results = [];
    await page.setViewport({ width: 1440, height: 1000 });
    const response = await page.goto(base, { waitUntil: 'networkidle2', timeout: 120000 });
    assert.equal(response.status(), 200);
    await page.waitForSelector('.header-account button');
    for (const width of [1920, 1440, 1280, 1200]) {
      await page.setViewport({ width, height: 1000 });
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.header-inner')).display === 'flex' && getComputedStyle(document.querySelector('.desktop-nav')).display === 'flex');
      const header = await page.evaluate(() => {
        const rect = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { left: r.left, right: r.right }; };
        const link = document.querySelector('.desktop-nav > a[href="/about_bes/membership"]');
        return { logo: rect('.brand-logo'), nav: rect('.desktop-nav'), account: rect('.header-account'), label: link?.textContent, other: [...document.querySelectorAll('.desktop-nav button')].some(button => button.textContent.trim() === 'Other'), overflow: document.documentElement.scrollWidth > innerWidth };
      });
      assert.equal(header.label, 'Become a Member');
      assert.equal(header.other, false);
      assert.equal(header.overflow, false, `Header overflow at ${width}px`);
      assert.ok(header.logo.right <= header.nav.left && header.nav.right <= header.account.left, `Header components overlap at ${width}px: ${JSON.stringify(header)}`);
      results.push({ width, ...header });
    }
    await page.click('.desktop-nav > a[href="/about_bes/membership"]');
    await page.waitForFunction(() => location.pathname === '/about_bes/membership');
    await page.waitForSelector('.membership-summary');
    assert.equal(await page.$eval('.desktop-nav > a[href="/about_bes/membership"]', link => link.getAttribute('aria-current')), 'page');
    assert.equal(await page.$eval('.membership-summary a', link => link.getAttribute('href')), '/member_signup');
    for (const width of [1024, 768, 390, 320]) {
      await page.setViewport({ width, height: 1000 });
      await page.goto(base, { waitUntil: 'networkidle2' });
      await page.click('[aria-label="Open main menu"]');
      await page.waitForSelector('.mobile-navigation > a[href="/about_bes/membership"]', { visible: true });
      assert.equal(await page.$eval('.mobile-navigation > a[href="/about_bes/membership"]', link => link.textContent), 'Become a Member');
      await page.click('.mobile-navigation > a[href="/about_bes/membership"]');
      await page.waitForFunction(() => location.pathname === '/about_bes/membership');
      await page.waitForSelector('.membership-summary');
      await page.waitForSelector('.mobile-menu-paper', { hidden: true });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      results.push({ width, mobileNavigation: 'passed', drawerCloses: true });
    }
    fs.mkdirSync('artifacts', { recursive: true });
    fs.writeFileSync('artifacts/membership-navigation-qa.json', JSON.stringify(results, null, 2));
    console.log('Membership navigation passed: direct desktop link, active state, eight responsive widths, mobile link navigation, drawer closing, and signup destination.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
