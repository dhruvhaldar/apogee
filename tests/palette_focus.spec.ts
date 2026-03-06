import { test, expect } from '@playwright/test';

test('capture input focus', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);
  await page.focus('#orbit-altitude');
  await page.screenshot({ path: 'palette-focus.png', fullPage: false });
});
