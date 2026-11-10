/* Read-only browser checks: no registrations, emails, or database records are created. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const base = process.env.BES_QA_URL || 'http://localhost:3100';
const checks = [];
const failures = [];
const runtimeErrors = [];
async function check(name, run) {
  try { await run(); checks.push(name); console.log('PASS', name); }
  catch (error) { failures.push({ name, error: error.message }); console.log('FAIL', name, error.message); }
}
async function screenshot(page, file, full = false) {
  if (full) {
    await page.evaluate(() => document.activeElement?.blur());
    await page.evaluate(() => { document.body.style.overflow = 'visible'; document.body.style.height = 'auto'; const scroll = document.querySelector('.inner_page'); scroll.style.height = 'auto'; scroll.style.overflow = 'visible'; scroll.scrollTop = 0; });
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images).map(image => { image.loading = 'eager'; return image.decode().catch(() => {}); })); });
  }
  await page.screenshot({ path: `artifacts/${file}.png`, fullPage: full });
  if (full) await page.evaluate(() => { document.body.style.overflow = ''; document.body.style.height = ''; const scroll = document.querySelector('.inner_page'); scroll.style.height = ''; scroll.style.overflow = ''; });
}
async function assertPage(page, route) {
  let response;
  try { response = await page.goto(`${base}${route}`, { waitUntil: 'load', timeout: 60000 }); }
  catch (error) {
    if (!error.message.includes('ERR_NETWORK_CHANGED')) throw error;
    console.log('RETRY after browser network change', route);
    response = await page.goto(`${base}${route}`, { waitUntil: 'load', timeout: 60000 });
  }
  if (route !== '/offline' && (await page.title()) === 'Offline - BES Expo') {
    console.log('RETRY after service-worker network fallback', route);
    response = await page.goto(`${base}${route}`, { waitUntil: 'load', timeout: 60000 });
  }
  assert.equal(response.status(), 200);
  if (route !== '/offline') assert.notEqual(await page.title(), 'Offline - BES Expo');
  await page.locator('main h1').waitFor();
  if ((await page.title()) !== 'Offline - BES Expo') await page.waitForFunction(() => !!document.querySelector('.header-account button'));
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('main h1').count(), 1);
  const geometry = await page.evaluate(() => { const scroll = document.querySelector('.inner_page') || document.documentElement; const heading = document.querySelector('main h1').getBoundingClientRect(); return { viewport: innerWidth, docWidth: document.documentElement.scrollWidth, scrollWidth: scroll.scrollWidth, headingTop: heading.top, headingBottom: heading.bottom }; });
  assert.ok(geometry.docWidth <= geometry.viewport + 1, JSON.stringify(geometry));
  assert.ok(geometry.scrollWidth <= geometry.viewport + 1, JSON.stringify(geometry));
  assert.ok(geometry.headingTop >= 0 && geometry.headingTop < 600, JSON.stringify(geometry));
}
(async () => {
  fs.mkdirSync('artifacts', { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.BES_QA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  page.on('pageerror', error => runtimeErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && !message.text().includes('401 (Unauthorized)')) runtimeErrors.push(message.text()); });
  await check('Desktop home loads without overflow', () => assertPage(page, '/'));
  await check('Film section sits immediately below the hero', async () => {
    assert.equal(await page.locator('main .home-hero + .event-film').count(), 1);
    const video = page.locator('main .event-film video');
    if (await video.count()) {
      assert.equal(await video.getAttribute('preload'), 'none');
      assert.equal(await video.getAttribute('autoplay'), null);
      assert.equal(await video.evaluate(el => el.controls && el.playsInline), true);
    } else {
      const photo = page.locator('main .film-player img');
      await photo.scrollIntoViewIfNeeded();
      await photo.evaluate(el => el.decode());
      assert.ok(await photo.evaluate(el => el.naturalWidth > 0));
      assert.equal(await page.locator('main .film-player button').count(), 0);
    }
    await page.locator('.inner_page').evaluate(el => el.scrollTo({ top: 0 }));
  });
  await check('Readable homepage body text and larger introduction', async () => {
    const sizes = await page.locator('.homepage p').evaluateAll(els => els.map(el => parseFloat(getComputedStyle(el).fontSize)));
    assert.ok(sizes.length > 10);
    assert.ok(sizes.every(size => size >= 16), JSON.stringify(sizes));
    assert.ok(await page.locator('main .hero-description').evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 17));
  });
  await check('Hero photo next and previous controls', async () => {
    await page.waitForFunction(() => document.querySelectorAll('.hero-photo').length === 1);
    const original = await page.locator('.hero-photo').getAttribute('src');
    await page.getByRole('button', { name: 'Next event photo' }).click();
    await page.waitForFunction(src => document.querySelectorAll('.hero-photo').length === 1 && document.querySelector('.hero-photo').getAttribute('src') !== src, original);
    await page.getByRole('button', { name: 'Previous event photo' }).click();
    await page.waitForFunction(src => document.querySelectorAll('.hero-photo').length === 1 && document.querySelector('.hero-photo').getAttribute('src') === src, original);
  });
  await check('Keyboard-accessible desktop navigation', async () => { const button = page.getByRole('button', { name: 'BES India', exact: true }); await button.focus(); await page.keyboard.press('Enter'); assert.equal(await button.getAttribute('aria-expanded'), 'true'); await page.keyboard.press('Tab'); assert.ok((await page.evaluate(() => document.activeElement.textContent)).includes('At a Glance')); await page.keyboard.press('Escape'); assert.equal(await button.getAttribute('aria-expanded'), 'false'); assert.equal(await button.evaluate(el => el === document.activeElement), true); });
  await check('Brochure document exists and opens', async () => { const href = await page.locator('.brochure-float').getAttribute('href'); assert.ok(href.startsWith('/')); const response = await page.request.get(`${base}${href}`); assert.equal(response.status(), 200); assert.ok(response.headers()['content-type'].includes('pdf')); });
  await check('Countdown sits below navigation with the hero directly beneath it', async () => {
    const header = await page.locator('.site-header').boundingBox();
    const countdown = await page.locator('.expo-countdown').boundingBox();
    const hero = await page.locator('.home-hero').boundingBox();
    assert.equal(await page.getByRole('timer').count(), 1);
    assert.equal(Math.round(countdown.y), Math.round(header.y + header.height));
    assert.equal(Math.round(hero.y), Math.round(countdown.y + countdown.height));
  });
  await screenshot(page, 'homepage-desktop-full', true);
  await check('Member login dialog and password recovery', async () => { await page.getByRole('button', { name: 'Member login', exact: true }).click(); await page.getByLabel('Email address').waitFor(); await page.getByLabel('Email address').fill('invalid'); await page.locator('input[name=password]').fill('test'); assert.equal(await page.getByLabel('Email address').evaluate(el => el.validity.typeMismatch), true); await page.getByRole('button', { name: 'Forgot Password', exact: true }).click(); await page.getByText('Forgot Password', { exact: true }).waitFor(); await page.getByRole('button', { name: 'Close login' }).click(); });
  const routes = [];
  function walk(folder) { for (const entry of fs.readdirSync(folder, { withFileTypes: true })) { const file = path.join(folder, entry.name); if (entry.isDirectory() && !entry.name.includes('[') && !['backend', 'api', 'admin', 'account_setup'].includes(entry.name)) walk(file); else if (entry.name === 'page.tsx') { const route = '/' + path.relative('app', folder).split(path.sep).join('/'); if (route !== '/') routes.push(route); } } }
  walk('app');
  routes.push('/registrationform/e-badges/download-badge', '/about_bes/previous_council/2024-2026', '/event_conference/other_events/expos/2020');
  routes.push('/event_conference/other_events/seminars/view_details/vishwakarma');
  for (const route of routes) await check(`Desktop route ${route}`, async () => { await assertPage(page, route); assert.ok(!(await page.locator('main').innerText()).includes('Invalid Url')); });
  await page.goto(`${base}/about_bes/executive_council`, { waitUntil: 'load' });
  await check('Council email links and photographs', async () => { const links = await page.locator('.council-card a').evaluateAll(els => els.map(el => ({ href: el.getAttribute('href'), text: el.textContent }))); assert.ok(links.length > 0); assert.ok(links.every(link => link.href === 'mailto:' + link.text)); const missing = await page.locator('.council-portrait img').evaluateAll(els => els.filter(el => el.complete && el.naturalWidth === 0).map(el => el.src)); assert.deepEqual(missing, []); });
  await screenshot(page, 'council-desktop');
  await page.goto(`${base}/galleries/pictures`, { waitUntil: 'load' });
  await check('Gallery year selection updates actual photographs', async () => { const image = page.locator('.gallery-tile img').first(); assert.ok((await image.getAttribute('src')).includes('2026')); await page.getByRole('combobox').click(); await page.getByRole('option', { name: '2024', exact: true }).click(); await page.waitForURL('**selectedValue=2024'); await page.waitForFunction(() => document.querySelector('.gallery-tile img')?.getAttribute('src').includes('2024')); });
  await check('Gallery lightbox opens, advances, closes with Escape', async () => { await page.getByRole('button', { name: 'View event photograph 1', exact: true }).click(); await page.getByRole('dialog').waitFor(); await page.getByRole('button', { name: 'Next photograph', exact: true }).click(); assert.equal(await page.locator('.photo-viewer-footer > span').innerText(), `2 / ${await page.locator('.gallery-tile').count()}`); await page.keyboard.press('Escape'); await page.getByRole('dialog').waitFor({ state: 'hidden' }); });
  await screenshot(page, 'gallery-desktop');
  await page.goto(`${base}/member_signup`, { waitUntil: 'load' });
  await check('Signup validation prevents incomplete submissions', async () => { await page.locator('button[type=submit]').click(); assert.ok(await page.locator('.Mui-error').count() > 0); });
  await check('Signup password visibility toggle', async () => { const input = page.locator('input[name=password]'); await input.fill('test-value'); await page.getByRole('button', { name: 'Show password' }).click(); assert.equal(await input.getAttribute('type'), 'text'); await page.getByRole('button', { name: 'Hide password' }).click(); assert.equal(await input.getAttribute('type'), 'password'); });
  await screenshot(page, 'signup-desktop');
  for (const width of [320, 390, 768, 1024, 1280]) { await page.setViewportSize({ width, height: 900 }); await check(`Responsive home at ${width}px`, async () => {
    await assertPage(page, '/');
    assert.ok(await page.locator('main .hero-description').evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 17));
    const frame = await page.locator('main .film-player').evaluate(el => ({ ratio: el.clientWidth / el.clientHeight, expected: parseFloat(el.style.aspectRatio), width: el.clientWidth }));
    assert.ok(Math.abs(frame.ratio - frame.expected) < .02);
    assert.ok(frame.width <= width);
  }); }
  await page.setViewportSize({ width: 390, height: 844 });
  await check('Mobile menu expands and navigates', async () => { await page.getByRole('button', { name: 'Open main menu', exact: true }).click(); await page.locator('.mobile-navigation summary').filter({ hasText: 'BES India' }).click(); await page.locator('.mobile-navigation').getByRole('link', { name: 'At a Glance' }).click(); await page.waitForURL('**/about_bes/at_glance'); await page.locator('.mobile-menu-paper').waitFor({ state: 'hidden' }); });
  await check('Mobile section navigation works', async () => { await page.getByRole('button', { name: 'Open Navigation', exact: true }).click(); await page.getByRole('button', { name: 'Close Navigation', exact: true }).waitFor(); await page.locator('.MuiDrawer-paper').getByRole('link', { name: 'Membership', exact: true }).click(); await page.waitForURL('**/about_bes/membership'); });
  for (const route of ['/about_bes/at_glance', '/about_bes/contact_us', '/about_bes/executive_council', '/about_bes/membership', '/galleries/pictures', '/registrationform/visitor', '/registrationform/delegateregistration', '/registrationform/e-badges/download-badge', '/member_signup', '/event_conference/bes_expo/exibition/floor_plan', '/event_conference/bes_expo/exibition/venue']) await check(`Mobile route ${route}`, () => assertPage(page, route));
  await page.goto(`${base}/about_bes/contact_us`, { waitUntil: 'load' }); await screenshot(page, 'contact-mobile');
  await page.goto(base, { waitUntil: 'load' }); await screenshot(page, 'homepage-mobile-full', true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await check('Reduced motion is respected', async () => { assert.ok(await page.locator('.hero-photo').evaluate(el => parseFloat(getComputedStyle(el).transitionDuration) < .001)); });
  await check('No browser runtime or hydration errors', async () => assert.deepEqual([...new Set(runtimeErrors)], []));
  fs.writeFileSync('artifacts/design-qa.json', JSON.stringify({ passed: checks.length, failed: failures.length, checks, failures, runtimeErrors: [...new Set(runtimeErrors)], note: 'MongoDB, SMTP, real authentication, bookings and registration submissions cannot be verified without environment configuration.' }, null, 2));
  await browser.close();
  console.log(`${checks.length} passed, ${failures.length} failed`);
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
