import { test, expect } from '@playwright/test';

test('take screenshot', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // fill a form to show results
  await page.fill('#orbit-altitude', '400');
  await page.click('button:has-text("Calculate Orbit")');
  await page.screenshot({ path: 'screenshot-current.png', fullPage: true });
});
