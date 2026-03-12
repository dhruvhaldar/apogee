import { test, expect } from '@playwright/test';

test('capture homepage', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'palette-after.png', fullPage: true });
});
