const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000');

    // Fill the Rocket Calculator
    console.log('Testing Rocket Calculator...');
    await page.getByLabel(/Specific Impulse/i).fill('400');
    await page.getByLabel(/Initial Mass/i).fill('2000');
    await page.getByLabel(/Final Mass/i).fill('200');

    // Press Enter to submit
    console.log('Pressing Enter...');
    await page.getByLabel(/Final Mass/i).press('Enter');

    // Wait for result
    console.log('Waiting for result...');
    await page.waitForSelector('text=9032.26');
    console.log('Calculation triggered!');

    // Take screenshot
    await page.screenshot({ path: 'verification/ux_improvement.png', fullPage: true });
    console.log('Screenshot saved to verification/ux_improvement.png');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
