import { test, expect } from '@playwright/test';

test('Copy button works and shows success state', async ({ page }) => {
  // Grant clipboard permissions explicitly (headless mode strictness)
  await page.context().grantPermissions(['clipboard-write', 'clipboard-read']);

  await page.goto('/');

  // Calculate something to show the result card (and copy button)
  await page.getByRole('button', { name: 'Calculate Delta-V' }).click();

  // Find the copy button
  const copyButton = page.getByLabel('Copy Delta-V result');
  await expect(copyButton).toBeVisible();

  // Click it
  await copyButton.click();

  // Check for success state
  const successButton = page.getByLabel('Copied to clipboard');
  await expect(successButton).toBeVisible();
  // We removed the native title attribute to improve keyboard accessibility.
  // The custom tooltip element should contain the text 'Copied!'
  await expect(page.locator('text=Copied!').first()).toBeVisible();

  // Screenshot for verification
  await page.screenshot({ path: 'copy-success.png' });
});
