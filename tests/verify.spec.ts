import { test, expect } from '@playwright/test';

test('capture life support form', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const crewInput = page.locator('#ls-crew');
  await crewInput.waitFor({ state: 'visible', timeout: 10000 });

  await crewInput.focus();
  await page.waitForTimeout(500);

  const formLocator = crewInput.locator('xpath=./ancestor::form');
  await formLocator.screenshot({ path: '/home/jules/verification/life-support-form.png' });
});
