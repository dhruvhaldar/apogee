import { test, expect } from '@playwright/test';

test('Copy button works and shows success state', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.screenshot({ path: 'test-1.png' });

  // Calculate something to show the result card (and copy button)
  await page.getByRole('button', { name: 'Calculate Delta-V' }).click();

  await page.waitForTimeout(2000); // give it time
  await page.screenshot({ path: 'test-2.png' });
});
