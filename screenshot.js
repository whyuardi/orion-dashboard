const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://dryer-literally-trees-poison.trycloudflare.com', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/home/ubuntu/.hermes/web-demo/screenshot.png', fullPage: true });
  console.log('Screenshot saved');
  await browser.close();
})();
