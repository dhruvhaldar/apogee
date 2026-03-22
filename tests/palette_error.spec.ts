import { test, expect } from '@playwright/test';

test('capture error state screenshot', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for the background image to stop intercepting pointer events, or use force: true

  const rocketM0 = page.locator('#rocket-m0');
  await rocketM0.fill('100');
  const rocketMf = page.locator('#rocket-mf');
  await rocketMf.fill('1000');
  await page.locator('button', { hasText: 'Calculate Delta-V' }).click({ force: true });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-error.png', fullPage: true });
});
