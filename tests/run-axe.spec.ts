import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('run axe-core', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  console.log(JSON.stringify(results.violations, null, 2));
  expect(results.violations).toEqual([]);
});
