import { test, expect } from '@playwright/test';

test('Verify visuals', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('h1')).toContainText('APOGEE');

  // Verify focus style on Rocket ISP helper text
  const input = page.locator('#rocket-isp');
  await input.focus();

  // Wait for transition
  await page.waitForTimeout(500);

  // The helper text should have the text-cyan-400 color (rgb(34 211 238) roughly, or just take a screenshot)
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
});
