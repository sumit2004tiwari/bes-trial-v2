/* Read-only checks against the supplied homepage film; creates no application data. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

async function captureFilm(page, file) {
  // Expand the app's inner scroll container for an unclipped section capture.
  const previous = await page.evaluate(() => {
    const scroll = document.querySelector('.inner_page');
    const state = { body: document.body.getAttribute('style') || '', scroll: scroll.getAttribute('style') || '', top: scroll.scrollTop };
    document.activeElement?.blur();
    document.body.style.height = 'auto';
    document.body.style.overflow = 'visible';
    scroll.style.height = 'auto';
    scroll.style.overflow = 'visible';
    scroll.scrollTop = 0;
    return state;
  });
  await page.locator('main .event-film').screenshot({ path: file });
  await page.evaluate(state => {
    document.body.setAttribute('style', state.body);
    const scroll = document.querySelector('.inner_page');
    scroll.setAttribute('style', state.scroll);
    scroll.scrollTop = state.top;
  }, previous);
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.BES_QA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const base = process.env.BES_QA_URL || 'http://localhost:3100';
  const checks = [];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base, { waitUntil: 'networkidle', timeout: 180000 });
  const video = page.locator('main .event-film video');
  assert.equal(await video.count(), 1);
  assert.equal(await page.locator('main .home-hero + .event-film').count(), 1);
  assert.equal(await video.evaluate(el => el.controls && el.playsInline && !el.autoplay && el.preload === 'none'), true);
  checks.push('Responsive native player directly below hero, with controls and no autoplay');

  const source = await video.locator('source').getAttribute('src');
  const response = await page.request.get(new URL(source, base).href, { headers: { Range: 'bytes=0-1023' } });
  assert.equal(response.status(), 206);
  assert.ok(response.headers()['content-type'].includes('video/mp4'));
  assert.ok(response.headers()['content-range'].startsWith('bytes 0-1023/'));
  checks.push('Supplied MP4 is served with byte-range support for seeking');

  await video.scrollIntoViewIfNeeded();
  await video.click();
  await video.evaluate(el => el.play());
  await page.waitForFunction(() => document.querySelector('.event-film video').currentTime > .25, { timeout: 30000 });
  const media = await video.evaluate(el => ({ duration: el.duration, width: el.videoWidth, height: el.videoHeight, error: el.error?.message || null }));
  assert.ok(media.duration > 0 && media.width > 0 && media.height > 0);
  assert.equal(media.error, null);
  await video.evaluate(el => el.pause());
  checks.push('Actual user-supplied film decodes, plays, and pauses');

  await video.evaluate(el => { el.currentTime = Math.min(5, el.duration / 3); });
  await page.waitForFunction(() => !document.querySelector('.event-film video').seeking);
  checks.push('Film can seek to another position');
  fs.mkdirSync('artifacts', { recursive: true });
  await captureFilm(page, 'artifacts/homepage-video-desktop.png');

  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await video.scrollIntoViewIfNeeded();
    const frame = await video.evaluate(el => ({ width: el.clientWidth, height: el.clientHeight, fit: getComputedStyle(el).objectFit, screen: innerWidth, scroll: document.querySelector('.inner_page').scrollWidth }));
    assert.ok(Math.abs(frame.width / frame.height - media.width / media.height) < .02);
    assert.equal(frame.fit, 'contain');
    assert.ok(frame.scroll <= width + 1);
    checks.push(`Film fits ${width}px viewport without cropping or overflow`);
    if (width === 390) await captureFilm(page, 'artifacts/homepage-video-mobile.png');
  }

  assert.deepEqual(errors, []);
  checks.push('No browser runtime errors during playback');
  fs.writeFileSync('artifacts/homepage-video-qa.json', JSON.stringify({ source, media, passed: checks.length, checks }, null, 2));
  console.log(JSON.stringify({ passed: checks.length, source, media }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
