import { test, expect } from '@playwright/test';

test('take empty state screenshot', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'screenshot-empty.png', fullPage: true });
});
