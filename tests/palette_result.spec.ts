import { test, expect } from '@playwright/test';

test('capture result box', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);
  await page.fill('#orbit-altitude', '400');
  await page.click('button:has-text("Calculate Orbit")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'palette-result.png', fullPage: false });
});
