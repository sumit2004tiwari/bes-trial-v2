const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.BES_QA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const base = process.env.BES_QA_URL || 'http://localhost:3100';
  const reports = [];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/', '/about_bes/contact_us', '/about_bes/executive_council', '/member_signup', '/galleries/pictures', '/offline.html']) {
    for (let attempt = 0; ; attempt++) {
      try { await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 180000 }); break; }
      catch (error) {
        // The PWA may reload once when its initial worker takes control.
        if (attempt >= 2 || !/ERR_ABORTED|ERR_NETWORK_CHANGED/.test(error.message)) throw error;
      }
    }
    await page.addScriptTag({ path: require.resolve('axe-core') });
    const result = await page.evaluate(async () => axe.run(document.querySelector('main'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
    const violations = result.violations.map(item => ({ id: item.id, impact: item.impact, description: item.description, nodes: item.nodes.map(node => ({ target: node.target, html: node.html, summary: node.failureSummary })) }));
    reports.push({ route, width, violations });
    console.log(width, route, JSON.stringify(violations));
    }
  }
  fs.writeFileSync('artifacts/accessibility-qa.json', JSON.stringify(reports, null, 2));
  await browser.close();
  if (reports.some(report => report.violations.length)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
